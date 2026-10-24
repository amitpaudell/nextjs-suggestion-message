'use client';
import { User } from 'next-auth';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';
const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user;
  return (
    <nav className="flex justify-around p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <Link href="/" className="text-xl font-bold mb-4 md:mb-0">
        True Feedback
      </Link>

      {session ? (
        <div>
          <span className="mr-4">Welcome, {user.username || user.email}</span>
          <Button
            onClick={() => signOut()}
            className="w-full md:w-auto bg-slate-100 text-black"
            variant="outline"
          >
            Logout
          </Button>
        </div>
      ) : (
        <div>
          <Link href="/sign-in">
            <Button
              variant="outline"
              className="w-full md:w-auto bg-slate-100 text-black"
            >
              Login
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
