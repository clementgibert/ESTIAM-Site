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
import type { User } from '@/types/user';

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?name=User&background=random";


export default function User() {
  interface User {
    id: number;
    email: string;
    password: string;
    name: string;
    role: string;
    avatar: string;
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      const apiUrl = 'https://api.escuelajs.co/api/v1/users';
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        setUsers(json);
      } catch (error: any) {
        console.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('https://api.escuelajs.co/api/v1/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newUser,
          avatar: DEFAULT_AVATAR,
        }),
      });
      const created = await res.json();
      setUsers([...users, created]);
      setNewUser({ name: '', email: '', password: '', role: '' });
    } catch (err) {
      console.error(err);
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

  return (
    <div className="p-4">
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
          onChange={(e) =>
            setNewUser({ ...newUser, password: e.target.value })
          }
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

      <div>Users:</div>
      {loading ? (
        <div>
          <Skeleton className="w-[150px] h-[200px] rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 mx-4">
          {users.map((_user, index) => (
            <div key={index}>
              <Card>
                <CardHeader>
                  <CardTitle>
                    {_user.name} - {_user.id}
                  </CardTitle>
                  <CardDescription>{_user.email}</CardDescription>
                </CardHeader>

                <CardContent>
                  
                  <img
                    src={_user.avatar || DEFAULT_AVATAR}
                    onError={(e) => {
                    (e.target as HTMLImageElement).src = DEFAULT_AVATAR;
                }}
                    alt={`${_user.name}'s avatar`}
                    className="w-16 h-16 rounded-full object-cover"
                    />

                </CardContent>

                <CardFooter className="flex justify-between items-center">
                  <p>{_user.role}</p>
                  <button
                    onClick={() => handleDeleteUser(_user.id)}
                    className="text-red-600 text-sm"
                  >
                    Supprimer
                  </button>
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
