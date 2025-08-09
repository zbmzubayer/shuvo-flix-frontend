'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueries } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
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
import { Textarea } from '@/components/ui/textarea';
import { getAllDealers } from '@/services/dealer.service';
import { getAllServices } from '@/services/service.service';
import { createServiceAccount } from '@/services/service-account.service';
import { SERVICE_ACCOUNT_PAYMENT } from '@/types/service-account';
import { type ServiceAccountDto, serviceAccountSchema } from '@/validations/service-account.dto';

export function CreateServiceAccountForm() {
  const [{ data: services }, { data: dealers }] = useQueries({
    queries: [
      { queryKey: ['services'], queryFn: getAllServices },
      { queryKey: ['dealers'], queryFn: getAllDealers },
    ],
  });

  const form = useForm<ServiceAccountDto>({
    resolver: zodResolver(serviceAccountSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: createServiceAccount,
    onSuccess: () => {
      toast.success('Account created successfully');
    },
    onError: () => {
      toast.error('Failed to create account', {
        description: error?.message,
      });
    },
  });

  const onSubmit = async (values: ServiceAccountDto) => {
    console.log('Form submitted with values:', values);
    // await mutateAsync(values);
  };

  return (
    <Form {...form}>
      <form
        className="grid-cols-2 gap-x-5 space-y-3 sm:grid"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter the name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter the email" {...field} />
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
                <Input placeholder="Enter the password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">Service</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {services?.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dealerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">Dealer</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a dealer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dealers?.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">Payment</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a payment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(SERVICE_ACCOUNT_PAYMENT)?.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalSlots"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">Personal Slots</FormLabel>
              <FormControl>
                <Input
                  min={0}
                  onChange={(e) => {
                    const value = Number.parseFloat(e.target.value);
                    if (value) {
                      onChange(value);
                    } else onChange('');
                  }}
                  placeholder="Enter personal slots"
                  type="number"
                  {...fieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sharedSlots"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">Shared Slots</FormLabel>
              <FormControl>
                <Input
                  min={0}
                  onChange={(e) => {
                    const value = Number.parseFloat(e.target.value);
                    if (value) {
                      onChange(value);
                    } else onChange('');
                  }}
                  placeholder="Enter shared slots"
                  type="number"
                  {...fieldProps}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="joinDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">Join Date</FormLabel>
              <FormControl>
                <DatePicker onChange={field.onChange} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700 dark:text-gray-300">Expiry Date</FormLabel>
              <FormControl>
                <DatePicker onChange={field.onChange} value={field.value} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 dark:text-gray-300">Note</FormLabel>
                <FormControl>
                  <Textarea {...field} className="resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-2 mt-4 flex justify-end">
          <Button type="submit">Create</Button>
        </div>
      </form>
    </Form>
  );
}
