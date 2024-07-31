'use client'

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { Separator } from '@radix-ui/react-separator';

function Navbar() {
  const { data: session } = useSession();
  const user : User = session?.user;

  return (
    <>
    
    <nav className="p-4 md:p-6 shadow-md bg-zinc-700 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0">
          Mystry Message
        </a>
        {session ? (
          <>
            <span className="mr-4">
              Welcome, {user.username || user.email}
            </span>
            <Link href="/">
              <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
                Logout
              </Button>
            </Link>
            
          </>
        ) : (
          <Link href="/sign-in">
            <Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>
          </Link>
        )}
      </div>
    </nav>
    </>
  );
}

export default Navbar;