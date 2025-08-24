'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { invalidateCache } from '@/actions/cache.action';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { CUSTOMER_CACHE_KEY, createCustomer } from '@/services/customer.service';
import { CUSTOMER_SOCIAL } from '@/types/customer';
import { type CustomerDto, customerSchema } from '@/validations/customer.dto';

export function CreateCustomerForm() {
  const { setOpen } = useDialog();

  const form = useForm<CustomerDto>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      personalEmail: '',
      phone: '',
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      invalidateCache(CUSTOMER_CACHE_KEY);
      setOpen(false);
      toast.success('Customer created successfully');
    },
    onError: (error) => {
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
            <FormItem className="col-span-2">
              <div className="flex items-center justify-between">
                <FormLabel>Social</FormLabel>
                <FormMessage />
              </div>
              <div className="flex items-center">
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-2/5 rounded-r-none">
                    <SelectValue placeholder="Social" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(CUSTOMER_SOCIAL)?.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className="rounded-l-none focus-visible:ring-0"
                  placeholder="Enter social link"
                  {...form.register('socialLink')}
                />
              </div>
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
