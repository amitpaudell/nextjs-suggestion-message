'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';

import { useDebounceValue } from 'usehooks-ts';
import { toast } from '@/components/ui/toast';
import z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import axios, { AxiosError } from 'axios';
import { signUpSchema } from '@/schemas/signUpSchema';
import { useRouter } from 'next/navigation';

const SignUpForm = () => {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const debouncedUsername = useDebounceValue(username, 300);

  type SignInForm = z.infer<typeof signUpSchema>;
  const form = useForm<SignInForm>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ',',
    },
  });

  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (debouncedUsername) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
      }
      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${debouncedUsername}`,
        );
        setUsername(response.data.message);
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
  }, [debouncedUsername]);

  const onSubmit = async (data: SignInForm) => {
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
      setUsernameMessage(
        axiosError.response?.data.message ?? 'Error checking username',
      );
      let errorMessage = axiosError.response?.data.message;
      toast.add({
        title: 'Signup failed',
        description: 'error message',
      });
    }
  };

  return <div></div>;
};

export default SignUpForm;
