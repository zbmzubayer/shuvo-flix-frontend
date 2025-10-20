'use client';

import { PlusIcon } from 'lucide-react';

import { CreateServiceAccountForm } from '@/components/service-account/create-service-account-form';
import { Button } from '@/components/ui/button';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogProvider,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function CreateServiceAccountDialog() {
  return (
    <DialogProvider>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon />
          Create account
        </Button>
      </DialogTrigger>
      <DialogContent
        className="flex flex-col gap-0 p-0 sm:max-w-xl"
        onWheel={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="overflow-y-auto p-6">
          <DialogHeader className="mb-2">
            <DialogTitle>Create Account</DialogTitle>
            <DialogDescription>Please enter the details for the new account.</DialogDescription>
          </DialogHeader>
          <CreateServiceAccountForm />
        </div>
      </DialogContent>
    </DialogProvider>
  );
}
