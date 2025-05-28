'use client';

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from 'next/navigation';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import  { useAuth } from '@/hooks/use-auth';
import { AuthContext } from "@/contexts/jwt-context";
import { useContext } from "react";
import { useEffect } from "react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {

  const {isAuthenticated} = useContext(AuthContext);
  const { signOut } = useAuth()
  const router = useRouter();

  
  useEffect(() => {
    (async () => {
      await signOut();
    })();
  }, []); 
  

  const { signIn } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "john@mail.com",
      password: "changeme",
    },
  })

   async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    try {
      await signIn(values.email, values.password);
      router.push('/users')
    } catch(err) {
      form.setError('root', {
        type: "server",
        message: 'Something went wrong!',
      });
    }
  }
  

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
          )}
        />

        <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter your password
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
          )}
        />
        <div></div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
        </CardContent>
      </Card>
    </div>
  )
}