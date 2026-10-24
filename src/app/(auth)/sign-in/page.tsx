'use client';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from '@/components/ui/toast';
import z from 'zod';
import { useRouter } from 'next/navigation';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { signInSchema } from '@/schemas/signInSchema';
import { signIn } from 'next-auth/react';

const SignInPage = () => {
  const router = useRouter();

  type SignInForm = z.infer<typeof signInSchema>;
  const form = useForm<SignInForm>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data: SignInForm) => {
    console.log('dasdsa');
    const result = await signIn('credentials', {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    console.log(result);
    if (result?.error) {
      if (result.error === 'CredentialsSignin') {
        toast.add({
          title: 'Login Failed',
          description: 'Incorrect username or password',
        });
      } else {
        toast.add({
          title: 'Error',
          description: result?.error,
        });
      }
    }
    if (result?.url) {
      router.replace('/dashboard');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 space-y-12">
      <div className="w-full max-w-md border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Signup Registration
        </h2>

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              <Controller
                name="identifier"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Username/Email</FieldLabel>
                    <Input placeholder="username / email" {...field} />
                  </Field>
                )}
              />

              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      type="password"
                      id="password"
                      placeholder="password"
                      {...field}
                    />
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>

          {/* Button */}
          <Field>
            <Button type="submit" className="mt-4">
              Sigin
            </Button>
          </Field>
        </form>
        <div className="text-center mt-4">
          <p>
            Not a member yet?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignInPage;
