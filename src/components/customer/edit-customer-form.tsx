'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { invalidateCache } from '@/actions/cache.action';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { CUSTOMER_CACHE_KEY, updateCustomer } from '@/services/customer.service';
import { CUSTOMER_SOCIAL, type Customer } from '@/types/customer';
import { type CustomerDto, customerSchema } from '@/validations/customer.dto';

interface EditCustomerFormProps {
  customer: Customer;
  setOpen: (open: boolean) => void;
}

export function EditCustomerForm({ customer, setOpen }: EditCustomerFormProps) {
  const form = useForm<CustomerDto>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: customer.name,
      personalEmail: customer.personalEmail,
      phone: customer.phone,
      social: customer.social ?? undefined,
      socialLink: customer.socialLink,
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      invalidateCache(CUSTOMER_CACHE_KEY);
      setOpen(false);
      toast.success('Customer updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update customer', {
        description: error?.message,
      });
    },
  });

  const onSubmit = async (values: CustomerDto) => {
    await mutateAsync({ id: customer.id, data: values });
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
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
