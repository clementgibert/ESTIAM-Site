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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import type { User } from '@/types/user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"






export default function User() {
 
  interface User {
      id: number;
      email: string;
      password: string;
      name: string;
      role: string;
      avatar: string;
  }

  const [users, setUsers] = useState<User[]>([]);//useState <array User>(variable initiale (array))
  const [loading, setLoading] = useState<boolean>(true); // useState<type>(var_intiale);
 
  useEffect(() => {
      const getUsers = async () => {
          //console.log('test');
          setLoading(true);
          const apiUrl = 'https://api.escuelajs.co/api/v1/users';
          try {
              const reponse = await fetch(apiUrl)
              if (!reponse.ok) {
                  throw new Error(`Reponse status: ${reponse.status}`);
              }
              const json = await reponse.json();
              console.log(json);
              setLoading(false);
              setUsers(json);
              } catch(error: any){
                  console.error(error.message);
                  setLoading(false);
              }
          };
          getUsers();
      }, []);

  return (
      <div>
          Users: <br/>
          {loading ? ( //si il est true (? = if else statement)
              <div>
                  <Skeleton className="w-[150px] h-[200px] rounded-full" />
              </div>
          ) : (
          //sinon

          <div className="grid grid-cols-3 gap-4 mx-4">
             
          {users.map((_user, index) => ( //key={_user.id}
          <div key={index}>
              <Card>
                  <CardHeader>
                      <CardTitle>{_user.name} - {_user.id}</CardTitle>
                      <CardDescription>{_user.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Avatar>
                          <AvatarImage src={_user.avatar} />
                          <AvatarFallback>?</AvatarFallback>
                      </Avatar>
                  </CardContent>
                  <CardFooter>
                      <p>{_user.role}</p>
                  </CardFooter>
              </Card>
          </div>
          ))}
          </div>
          )}
      </div>
  );
}


