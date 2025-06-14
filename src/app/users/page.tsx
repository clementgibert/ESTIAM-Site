'use client';

import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const DEFAULT_AVATAR = 'https://ui-avatars.com/api/?name=User&background=random';

interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  avatar: string;
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ name?: string; email?: string }>({});

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEditable = (user: User) => user.id > 100;

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch('https://api.escuelajs.co/api/v1/users');
        const json = await res.json();
        setUsers(json.filter((u: User) => typeof u.id === 'number'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const newErrors: { [key: string]: string } = {};
    if (!newUser.name.trim()) newErrors.name = 'le nom est requis';
    if (!newUser.email.trim()) newErrors.email = "l'email est requis";
    if (!newUser.password.trim()) newErrors.password = 'le mot de passe est requis.';
    if (!newUser.role.trim()) newErrors.role = 'le role est requis.';
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
  
    setErrors({});
  
    try {
      const res = await fetch('https://api.escuelajs.co/api/v1/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
          avatar: DEFAULT_AVATAR,
        }),
      });
  
      if (!res.ok) {
        const error = await res.text();
        console.error('POST failed:', error);
        return;
      }
  
      const created = await res.json();
  
      if (!created.id) {
        //nextId grace à chatgpt.. Mais on regarde la longeur du string users, si > 0
        //math.max() retourne la valeur maximum donnée, cad qu'on prend l'id le plus grand et on rajoute 1
        //sinon on retourne 1.
        const nextId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
        created.id = nextId;
      }
  
      created.role = newUser.role;
  
      setUsers([...users, created]);
      setNewUser({ name: '', email: '', password: '', role: '' });
    } catch (err) {
      console.error('Error creating user:', err);
    }
  };
  

  const handleDeleteUser = async (id: number) => {
    try {
      await fetch(`https://api.escuelajs.co/api/v1/users/${id}`, {
        method: 'DELETE',
      });
      setUsers(users.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async () => {
    if (editingUserId === null) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('Token manquant');
      return;
    }

    try {
      const userToUpdate = users.find((u) => u.id === editingUserId);
      if (!userToUpdate) return;

      const res = await fetch(`https://api.escuelajs.co/api/v1/users/${editingUserId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...userToUpdate,
          ...editData,
        }),
      });

      if (!res.ok) throw new Error(`Status: ${res.status}`);

      const updated = await res.json();
      setUsers(users.map((u) => (u.id === editingUserId ? updated : u)));
      setEditingUserId(null);
      setEditData({});
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      {/* Formulaire d'ajout */}
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
        {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
      <form
        onSubmit={handleAddUser}
        className="p-4 border mb-6 rounded-md grid grid-cols-2 gap-2"
      >
        <input
          type="text"
          placeholder="Name"
          value={newUser.name}
          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="p-2 border rounded"
        />
  
        <input
          type="text"
          placeholder="Role"
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
          className="p-2 border rounded"
        />
        
        <button
          type="submit"
          className="bg-blue-600 text-white rounded px-4 py-2 col-span-2"
        >
          Ajouter un utilisateur
        </button>
      </form>

      {/* Liste des utilisateurs */}
      {loading ? (
        <Skeleton className="w-[150px] h-[200px] rounded-full" />
      ) : (
        <div className="grid grid-cols-3 gap-4 mx-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader>
                {editingUserId === user.id ? (
                  <>
                    <input
                      type="text"
                      value={editData.name ?? user.name}
                      onChange={(e) =>
                        setEditData((prev) => ({ ...prev, name: e.target.value }))
                      }
                      className="border p-1 rounded w-full"
                    />
                    <input
                      type="email"
                      value={editData.email ?? user.email}
                      onChange={(e) =>
                        setEditData((prev) => ({ ...prev, email: e.target.value }))
                      }
                      className="border p-1 rounded w-full mt-2"
                    />
                  </>
                ) : (
                  <>
                    <CardTitle>{user.name} - {user.id}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </>
                )}
              </CardHeader>

              <CardContent>
                <img
                  src={user.avatar || DEFAULT_AVATAR}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                  }}
                  alt={`${user.name}'s avatar`}
                  className="w-16 h-16 rounded-full object-cover"
                />
              </CardContent>

              <CardFooter className="flex justify-between items-center gap-2">
                <p>{user.role || 'Rôle non défini'}</p>

                {isEditable(user) && (
                  <div className="flex gap-2">
                    {editingUserId === user.id ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="text-green-600 text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingUserId(null);
                            setEditData({});
                          }}
                          className="text-gray-600 text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setEditingUserId(user.id);
                            setEditData({
                              name: user.name,
                              email: user.email,
                            });
                          }}
                          className="text-blue-600 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 text-sm"
                        >
                          Supprimer
                        </button>
                      </>
                    )}
                  </div>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
