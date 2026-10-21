'use client';

import { useParams, useRouter } from 'next/navigation';
import React, { Suspense } from 'react';
import { toast } from '@/components/ui/toast';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import z from 'zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from '@/types/ApiResponse';
import { verifySchema } from '@/schemas/verifySchema';
import { Field, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@base-ui/react/input';
import { Button } from '@/components/ui/button';

const VerifyAccount = () => (
  <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
    <VerifyAccountForm />
  </Suspense>
);

const VerifyAccountForm = () => {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  console.log(params.username);
  type SignUpForm = z.infer<typeof verifySchema>;
  const form = useForm<SignUpForm>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    try {
      const response = await axios.post<ApiResponse>('/api/verify-code', {
        username: params.username,
        code: data.code,
      });
      toast.add({
        title: 'Sucess',
        description: response.data.message,
      });

      router.replace('/sign-in');
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;

      const errorMessage =
        axiosError.response?.data?.message ??
        'There was a problem verifying your account. Please try again.';
      toast.add({
        title: 'Verification failed',
        description: errorMessage,
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              <Controller
                name="code"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>verification code</FieldLabel>
                    <Input placeholder="OTP Code" {...field} />
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
          <Field>
            <Button type="submit" className="mt-4">
              Verify
            </Button>
          </Field>
        </form>
      </div>
    </div>
  );
};

export default VerifyAccount;
