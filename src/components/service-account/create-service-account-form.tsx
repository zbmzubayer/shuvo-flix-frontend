'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueries } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { invalidateCaches } from '@/actions/cache.action';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
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
import { Textarea } from '@/components/ui/textarea';
import { getAllDealers } from '@/services/dealer.service';
import { getAllServices, SERVICE_CACHE_KEY } from '@/services/service.service';
import {
  createServiceAccount,
  SERVICE_ACCOUNT_CACHE_KEY,
} from '@/services/service-account.service';
import { SERVICE_ACCOUNT_PAYMENT } from '@/types/service-account';
import { type ServiceAccountDto, serviceAccountSchema } from '@/validations/service-account.dto';

export function CreateServiceAccountForm() {
  const { setOpen } = useDialog();
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

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createServiceAccount,
    onSuccess: () => {
      invalidateCaches([SERVICE_ACCOUNT_CACHE_KEY, SERVICE_CACHE_KEY]);
      toast.success('Account created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create account', {
        description: error?.message,
      });
    },
  });

  const onSubmit = async (values: ServiceAccountDto) => {
    setOpen(false);
    await mutateAsync(values);
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
              <div className="flex items-center justify-between">
                <FormLabel>Name</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="Enter the name" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Email</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="Enter the email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="Enter the password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="serviceId"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Service</FormLabel>
                <FormMessage />
              </div>
              <Select onValueChange={(value) => field.onChange(Number(value))}>
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
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dealerId"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Dealer</FormLabel>
                <FormMessage />
              </div>
              <Select onValueChange={(value) => field.onChange(Number(value))}>
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
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payment"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Payment</FormLabel>
                <FormMessage />
              </div>
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
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="personalSlots"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Personal Slots</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') onChange(undefined);
                    else onChange(Number.parseInt(value, 10));
                  }}
                  placeholder="Enter personal slots"
                  type="number"
                  {...fieldProps}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sharedSlots"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Shared Slots</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '') onChange(undefined);
                    else onChange(Number.parseInt(value, 10));
                  }}
                  placeholder="Enter shared slots"
                  type="number"
                  {...fieldProps}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="joinDate"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Join Date</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <DatePicker onChange={field.onChange} value={field.value} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="expiryDate"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Expiry Date</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <DatePicker onChange={field.onChange} value={field.value} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Note</FormLabel>
                  <FormMessage />
                </div>
                <FormControl>
                  <Textarea {...field} className="resize-none" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="col-span-2 mt-2 flex justify-end">
          <Button disabled={isPending} type="submit">
            {isPending && <Spinner />}
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}
