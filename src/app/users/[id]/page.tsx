'use client'

import { User } from "@/types/user";
import { useParams } from "next/navigation";
import { useEffect, useState } from 'react';
import { AuthContext } from "@/contexts/jwt-context";
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

export default function UserPage() {
  const params = useParams<{id:string}>();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const getUser = async () => {
          const apiUrl = 'https://api.escuelajs.co/api/v1/users/' + params?.id;
          try {
              const reponse = await fetch(apiUrl)
              if (!reponse.ok) {
                  throw new Error(`Reponse status: ${reponse.status}`);
              }
              const json = await reponse.json();
              console.log(json);
              setUser(json);
              } catch(error: any){
                  console.error(error.message);
              }
          };

          getUser();
  }, [params]);

  if (user === null) {
    return (
      <div>User not found</div>
    );
  } else {
    return(
      <div>
         <Card>
                  <CardHeader>
                      <CardTitle>{user.name}</CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>?</AvatarFallback>
                      </Avatar>
                  </CardContent>
                  <CardFooter>
                      <p>{user.role}</p>
                  </CardFooter>
              </Card>

      </div> 
    );
  }
}


 
 







 









