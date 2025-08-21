'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useDialog } from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { createCustomer } from '@/services/customer.service';
import { type CustomerDto, customerSchema } from '@/validations/customer.dto';

export function CreateCustomerForm() {
  const { setOpen } = useDialog();

  const form = useForm<CustomerDto>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      personalEmail: '',
      phone: '',
      social: '',
    },
  });

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      setOpen(false);
      toast.success('Customer created successfully');
    },
    onError: () => {
      toast.error('Failed to create customer', {
        description: error?.message,
      });
    },
  });

  const onSubmit = async (values: CustomerDto) => {
    await mutateAsync(values);
  };

  return (
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Name</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="Enter customer name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personalEmail"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Personal Email</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="Enter customer personal email" type="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Phone</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="Enter customer phone" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="social"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Social</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="Enter social link" type="url" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="mt-4 flex justify-end">
          <Button disabled={isPending} type="submit">
            {isPending && <Spinner />}
            Create Customer
          </Button>
        </div>
      </form>
    </Form>
  );
}
