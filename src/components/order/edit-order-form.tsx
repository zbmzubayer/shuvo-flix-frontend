'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueries } from '@tanstack/react-query';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { invalidateCaches } from '@/actions/cache.action';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { fetchApi } from '@/lib/api';
import { cn } from '@/lib/utils';
import { CUSTOMER_CACHE_KEY } from '@/services/customer.service';
import { ORDER_CACHE_KEY, updateOrder } from '@/services/order.service';
import { PROVIDER_CACHE_KEY } from '@/services/provider.service';
import { SERVICE_CACHE_KEY } from '@/services/service.service';
import { CUSTOMER_SOCIAL, type CustomerDetails } from '@/types/customer';
import { ORDER_ACCOUNT_TYPE, ORDER_STATUS, type OrderDetails } from '@/types/order';
import type { Provider } from '@/types/provider';
import type { ServiceWithServiceAccount } from '@/types/service';
import { type OrderFormDto, orderFormSchema } from '@/validations/order.dto';

interface EditOrderFormProps {
  order: OrderDetails;
  setOpen: (open: boolean) => void;
}

export function EditOrderForm({ order, setOpen }: EditOrderFormProps) {
  const [popOverOpen, setPopOverOpen] = useState(false);
  const [servicePopOverOpen, setServicePopOverOpen] = useState(false);
  const [accountPopOverOpen, setAccountPopOverOpen] = useState(false);
  const [{ data: customers }, { data: services }, { data: providers }] = useQueries({
    queries: [
      {
        queryKey: [CUSTOMER_CACHE_KEY],
        queryFn: () => fetchApi<CustomerDetails[]>('/customer', { method: 'GET' }),
      },
      {
        queryKey: [SERVICE_CACHE_KEY],
        queryFn: () => fetchApi<ServiceWithServiceAccount[]>('/service', { method: 'GET' }),
      },
      {
        queryKey: [PROVIDER_CACHE_KEY],
        queryFn: () => fetchApi<Provider[]>('/provider', { method: 'GET' }),
      },
    ],
  });

  const form = useForm<OrderFormDto>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      customer: {
        name: order.customer.name,
        personalEmail: order.customer.personalEmail || undefined,
        phone: order.customer.phone,
        social: order.customer.social ?? undefined,
        socialLink: order.customer.socialLink ?? '',
      },
      email: order.email || undefined,
      serviceId: order.serviceId,
      serviceAccountId: order.serviceAccountId,
      providerId: order.providerId,
      status: order.status,
      accountType: order.accountType,
      dateRange: {
        from: new Date(order.startDate),
        to: new Date(order.endDate),
      },
      note: order.note ?? '',
    },
  });

  const selectedServiceId = form.getValues('serviceId');
  const selectedService = useMemo(() => {
    if (services && selectedServiceId) {
      return services.find((s) => s.id === selectedServiceId);
    }
  }, [services, selectedServiceId]);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateOrder,
    onSuccess: () => {
      invalidateCaches([ORDER_CACHE_KEY, SERVICE_CACHE_KEY, CUSTOMER_CACHE_KEY]);
      setOpen(false);
      toast.success('Order updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update order', {
        description: error?.message,
      });
    },
  });

  const onSubmit = async (values: OrderFormDto) => {
    const { dateRange, ...data } = values;
    await mutateAsync({
      id: order.id,
      data: { ...data, startDate: dateRange.from, endDate: dateRange.to },
    });
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
              <Popover onOpenChange={setPopOverOpen} open={popOverOpen}>
                <PopoverTrigger asChild>
                  {/** biome-ignore lint/a11y/useSemanticElements: <explanation> */}
                  <Button
                    aria-expanded={popOverOpen}
                    className="justify-between"
                    disabled
                    role="combobox"
                    type="button"
                    variant="outline"
                  >
                    {field.value || 'Select customer'}
                    <ChevronsUpDownIcon className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInput
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setPopOverOpen(false);
                        }
                      }}
                      onValueChange={field.onChange}
                      placeholder="Search customer..."
                      value={field.value}
                    />

                    <CommandList>
                      <CommandEmpty>No customer found.</CommandEmpty>
                      <CommandGroup>
                        {customers?.map((customer) => (
                          <CommandItem
                            key={customer.phone}
                            onSelect={() => {
                              form.setValue('customer.phone', customer.phone);
                              form.setValue('customer.name', customer.name);
                              form.setValue('customer.personalEmail', customer.personalEmail);
                              form.setValue('customer.social', customer.social);
                              form.setValue('customer.socialLink', customer.socialLink);
                              setPopOverOpen(false);
                            }}
                            value={customer.phone}
                          >
                            {customer.phone}
                            <CheckIcon
                              className={cn(
                                'ml-auto',
                                form.getValues('customer.phone') === customer.phone
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
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
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Personal Email</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === '' ? undefined : val);
                  }}
                  placeholder="Enter customer personal email"
                  type="email"
                  {...fieldProps}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field: { onChange, ...fieldProps } }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Account Email</FormLabel>
                <FormMessage />
              </div>
              <FormControl>
                <Input
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange(val === '' ? undefined : val);
                  }}
                  placeholder="Enter customer account email"
                  type="email"
                  {...fieldProps}
                />
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
                  <Popover onOpenChange={setServicePopOverOpen} open={servicePopOverOpen}>
                    <PopoverTrigger asChild className="w-2/5 rounded-r-none">
                      {/** biome-ignore lint/a11y/useSemanticElements: <explanation> */}
                      <Button
                        aria-expanded={servicePopOverOpen}
                        className="justify-between"
                        role="combobox"
                        variant="outline"
                      >
                        {selectedService?.name || 'Select Service'}
                        <ChevronsUpDownIcon className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-[var(--radix-popover-trigger-width)] p-0"
                    >
                      <Command>
                        <CommandInput placeholder="Search service..." />
                        <CommandList>
                          <CommandEmpty>No service found.</CommandEmpty>
                          <CommandGroup>
                            {services?.map((service) => (
                              <CommandItem
                                key={service.id}
                                onSelect={() => {
                                  form.setValue('serviceId', service.id);
                                  // form.resetField('serviceAccountId');
                                  field.onChange('');
                                  setServicePopOverOpen(false);
                                }}
                                value={service.name}
                              >
                                {service.name}
                                <CheckIcon
                                  className={cn(
                                    'ml-auto',
                                    form.getValues('serviceId') === service.id
                                      ? 'opacity-100'
                                      : 'opacity-0'
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <Popover onOpenChange={setAccountPopOverOpen} open={accountPopOverOpen}>
                    <PopoverTrigger asChild className="flex-1 rounded-l-none">
                      {/** biome-ignore lint/a11y/useSemanticElements: <explanation> */}
                      <Button
                        aria-expanded={accountPopOverOpen}
                        className="justify-between"
                        role="combobox"
                        variant="outline"
                      >
                        {selectedService?.serviceAccounts.find(
                          (account) => account.id === field.value
                        )?.name || 'Select an account'}
                        <ChevronsUpDownIcon className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      className="w-[var(--radix-popover-trigger-width)] p-0"
                    >
                      <Command>
                        <CommandInput placeholder="Search accounts..." />
                        <CommandList>
                          <CommandEmpty>No account found.</CommandEmpty>
                          <CommandGroup>
                            {services?.length && selectedService?.serviceAccounts?.length
                              ? selectedService.serviceAccounts?.map((account) => (
                                  <CommandItem
                                    key={account.id}
                                    onSelect={() => {
                                      field.onChange(account.id);
                                      setAccountPopOverOpen(false);
                                    }}
                                    value={account.name}
                                  >
                                    {account.name}
                                    <CheckIcon
                                      className={cn(
                                        'ml-auto',
                                        form.getValues('serviceAccountId') === account.id
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                ))
                              : null}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString() || ''}
              >
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
              <Select onValueChange={field.onChange} value={field.value}>
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
              <Select onValueChange={field.onChange} value={field.value}>
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
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
}
