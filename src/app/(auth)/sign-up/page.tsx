"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { signUpSchema } from "@/Schema/signUpSchema";
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { ApiResponse } from "../../../../types/ApiResponse";
import axios, { AxiosError } from 'axios';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";


function SignUpForm() {
    const [username, setusername] = useState<string>("");
    const [usernameMessage,setusernameMessage] = useState<string>("");
    const [isUsernameChecking, setisUsernameChecking] = useState<boolean>(false);
    const [isSubmitting, setisSubmitting] = useState(false);
    const debounced = useDebounceCallback(setusername, 500);

    const router = useRouter();
    const {toast} = useToast();

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
          username: '',
          email: '',
          password: '',
        },
      });

      useEffect(() => {
        const checkUsername = async () => {
            if(username){
                setusernameMessage("");
                setisUsernameChecking(true);

                try {
                    const response = await axios.get<ApiResponse>(`/api/check-unique-username?username=${username}`);
                    setusernameMessage( response.data.message );

                } catch (error) {
                    const axiosError = error as AxiosError<ApiResponse>;
                    setusernameMessage(
                        axiosError.response?.data.message ?? 'Error checking username'
                    );
                }
                finally{
                    setisUsernameChecking(false)
                }
            }
        } 

        checkUsername();
        
      }, [username]);


      const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setisSubmitting(true);

        try {
            const response = await axios.post("/api/sign-up" , data);

            toast({
                title: "Success",
                description: response.data.message,
            })

            router.replace(`/verify/${username}`);

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            let errorMessage = axiosError.response?.data.message;
            toast({
                title: 'Sign Up Failed',
                description: errorMessage,
                variant: "destructive" 
            })

        } finally{
            setisSubmitting(false);
        }

      };
      
      


  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-700">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join Mystry Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  
                    <Input 
                        {...field}
                        onChange={(e) => {
                            field.onChange(e);
                            debounced(e.target.value);
                        }}
                    />
                  
                  
                  {isUsernameChecking && <Loader2 className=" animate-spin" />}
                  {!isUsernameChecking && usernameMessage && (
                    <p
                      className={`text-sm ${
                        usernameMessage === 'Username is unique'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {usernameMessage}
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="abcd@abc.abc" name="email" />
                  </FormControl>
                  
                  <p className='text-sm  opacity-30 text-black'>We will send you a verification code</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field}  name="password" />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className='w-full' disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-400 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
       </div>
    </div>
  )
}

export default SignUpForm