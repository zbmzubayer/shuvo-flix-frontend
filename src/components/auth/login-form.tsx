'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CircleAlertIcon } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { InputPassword } from '@/components/ui/input-password';
import { Spinner } from '@/components/ui/spinner';
import { type LoginSchema, loginSchema } from '@/validations/auth.dto';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const searchParams = useSearchParams();
  const router = useRouter();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const onSubmit = async (values: LoginSchema) => {
    setIsLoading(true);
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
    const res = await signIn('credentials', {
      username: values.username,
      password: values.password,
      redirect: false,
    });
    setIsLoading(false);
    if (res?.error) {
      setError(res.error);
    }
    if (res?.ok) {
      toast.success('Login successful!', { description: 'Welcome back!' });
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Enter your username" {...field} />
              </FormControl>
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
                <InputPassword placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {error && <LoginFormAlert error={error} />}
        <div className="flex justify-center">
          <Button className="w-1/2 text-base" type="submit">
            {isLoading && <Spinner />}
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function LoginFormAlert({ error }: { error: string }) {
  return (
    <Alert variant="destructive">
      <CircleAlertIcon className="size-4" />
      <AlertTitle>Login Failed!</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
}
