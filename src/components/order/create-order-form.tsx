'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueries } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { invalidateCaches } from '@/actions/cache.action';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
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
import { CUSTOMER_CACHE_KEY } from '@/services/customer.service';
import { createOrder, ORDER_CACHE_KEY } from '@/services/order.service';
import { getAllProviders } from '@/services/provider.service';
import { getAllServices, SERVICE_CACHE_KEY } from '@/services/service.service';
import { CUSTOMER_SOCIAL } from '@/types/customer';
import { ORDER_ACCOUNT_TYPE, ORDER_STATUS } from '@/types/order';
import { type OrderFormDto, orderFormSchema } from '@/validations/order.dto';

export function CreateOrderForm() {
  const { setOpen } = useDialog();
  const [selectedServiceIndex, setSelectedServiceIndex] = useState<number>(0);
  const [{ data: services }, { data: providers }] = useQueries({
    queries: [
      { queryKey: ['services'], queryFn: getAllServices },
      { queryKey: ['providers'], queryFn: getAllProviders },
    ],
  });

  const form = useForm<OrderFormDto>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customer: {
        name: '',
        personalEmail: '',
        phone: '',
        socialLink: '',
      },
      email: '',
    },
  });

  useEffect(() => {
    if (services) {
      form.setValue('serviceId', services?.[selectedServiceIndex]?.id);
    }
  }, [services]);

  useEffect(() => {
    form.resetField('serviceAccountId');
  }, [selectedServiceIndex]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      invalidateCaches([ORDER_CACHE_KEY, SERVICE_CACHE_KEY, CUSTOMER_CACHE_KEY]);
      setOpen(false);
      toast.success('Order created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create order', {
        description: error?.message,
      });
    },
  });

  const onSubmit = async (values: OrderFormDto) => {
    const { dateRange, ...data } = values;
    await mutateAsync({ ...data, startDate: dateRange.from, endDate: dateRange.to });
  };

  return (
    <Form {...form}>
      <form
        className="grid-cols-2 gap-x-5 space-y-3 sm:grid"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="customer.phone"
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
          name="customer.name"
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
          name="customer.personalEmail"
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Account Email</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input placeholder="Enter customer account email" type="email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="serviceAccountId"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Service Account</FormLabel>
                  <FormMessage />
                </div>
                <div className="flex items-center">
                  <Select
                    onValueChange={(value) => {
                      const index = Number(value);
                      setSelectedServiceIndex(index);
                      if (services) {
                        form.setValue('serviceId', services[index]?.id);
                      }
                    }}
                    value={selectedServiceIndex.toString()}
                  >
                    <SelectTrigger className="w-2/5 rounded-r-none">
                      <SelectValue placeholder="Service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services?.map((item, index) => (
                        <SelectItem key={item.id} value={index.toString()}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value?.toString() || ''}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full rounded-l-none">
                        <SelectValue placeholder="Select an account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {services?.length &&
                      services[selectedServiceIndex]?.serviceAccounts?.length ? (
                        services[selectedServiceIndex]?.serviceAccounts?.map((item) => (
                          <SelectItem key={item.id} value={item.id.toString()}>
                            {item.name}
                          </SelectItem>
                        ))
                      ) : (
                        <p className="my-3 text-center text-muted-foreground text-sm">
                          Accounts empty
                        </p>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="providerId"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Provider</FormLabel>
                <FormMessage />
              </div>
              <Select onValueChange={(value) => field.onChange(Number(value))}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {providers?.map((item) => (
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
          name="status"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Status</FormLabel>
                <FormMessage />
              </div>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select order status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ORDER_STATUS)?.map((item) => (
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
          name="dateRange"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Start Date & End Date</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <DateRangePicker onChange={field.onChange} value={field.value} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="accountType"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Account Type</FormLabel>
                <FormMessage />
              </div>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select account type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(ORDER_ACCOUNT_TYPE)?.map((item) => (
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
          name="customer.social"
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
                  {...form.register('customer.socialLink')}
                />
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <div className="flex items-center justify-between">
                <FormLabel>Note</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Textarea {...field} className="resize-none" placeholder="Enter order notes" />
              </FormControl>
            </FormItem>
          )}
        />
        <div className="col-span-2 mt-2 flex justify-end">
          <Button disabled={isPending} type="submit">
            {isPending && <Spinner />}
            Create Order
          </Button>
        </div>
      </form>
    </Form>
  );
}
