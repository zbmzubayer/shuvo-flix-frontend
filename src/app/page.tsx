import Image from 'next/image';
import { Suspense } from 'react';

import { LoginForm } from '@/components/auth/login-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';

import Logo from '../../public/logo.svg';

export default function Home() {
  return (
    <div className="container flex h-screen flex-col items-center justify-center gap-2">
      <div className="flex size-16 items-center justify-center">
        <Image alt="Shuvo Flix Logo" className="size-full rounded-lg" src={Logo} />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-bold text-xl uppercase tracking-wider">Admin Panel</CardTitle>
          <CardDescription>Login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={<Spinner className="flex h-full w-full items-center justify-center" />}
          >
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
