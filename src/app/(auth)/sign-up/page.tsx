'use client';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';

import { useDebounceCallback } from 'usehooks-ts';
import { toast } from '@/components/ui/toast';
import z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { signUpSchema } from '@/schemas/signUpSchema';
import { useRouter } from 'next/navigation';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const debounced = useDebounceCallback(setUsername, 300);

  type SignUpForm = z.infer<typeof signUpSchema>;
  const form = useForm<SignUpForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
      }
      try {
        const response = await axios.get(
          `/api/check-username-api?username=${username}`,
        );
        setUsernameMessage(response.data.message);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        setUsernameMessage(
          axiosError.response?.data.message ?? 'Error checking username',
        );
      } finally {
        setIsCheckingUsername(false);
      }
    };
    checkUsernameUnique();
  }, [username]);

  const onSubmit = async (data: SignUpForm) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      toast.add({
        title: 'Sucess',
        description: response.data.message,
      });
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      console.log('ERROR IN SIGNUP', error);
      const axiosError = error as AxiosError<ApiResponse>;

      let errorMessage = axiosError.response?.data.message;
      ('There was a problem with your sign-up. Please try again.');
      toast.add({
        title: 'Signup failed',
        description: errorMessage,
      });
      setIsSubmitting(false);
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
                name="username"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="name">Username</FieldLabel>
                    <Input
                      id="name"
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </Field>
                )}
              />
              {isCheckingUsername && <Loader2 className="animate-spin" />}
              <p
                className={`text-sm ${usernameMessage === 'Username is unique' ? 'text-green-500' : 'text-red-500'}`}
              >
                {usernameMessage}
              </p>

              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor="name">Email</FieldLabel>
                    <Input id="name" placeholder="email" {...field} />
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
            <Button type="submit" className="mt-4" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'SignUP'
              )}
            </Button>
          </Field>
        </form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default SignUpForm;
