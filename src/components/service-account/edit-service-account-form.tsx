'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueries } from '@tanstack/react-query';
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';
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
import { getQueryClient } from '@/lib/get-query-client';
import { cn } from '@/lib/utils';
import { DEALER_CACHE_KEY } from '@/services/dealer.service';
import { SERVICE_CACHE_KEY } from '@/services/service.service';
import {
  SERVICE_ACCOUNT_CACHE_KEY,
  updateServiceAccount,
} from '@/services/service-account.service';
import type { Dealer } from '@/types/dealer';
import type { ServiceWithServiceAccount } from '@/types/service';
import { SERVICE_ACCOUNT_PAYMENT, type ServiceAccount } from '@/types/service-account';
import { type ServiceAccountDto, serviceAccountSchema } from '@/validations/service-account.dto';

interface Props {
  account: ServiceAccount;
  setOpen: (open: boolean) => void;
}

export function EditServiceAccountForm({ account, setOpen }: Props) {
  const [servicePopOverOpen, setServicePopOverOpen] = useState(false);
  const queryClient = getQueryClient();
  const [{ data: services }, { data: dealers }] = useQueries({
    queries: [
      {
        queryKey: [SERVICE_CACHE_KEY],
        queryFn: () => fetchApi<ServiceWithServiceAccount[]>('/service', { method: 'GET' }),
      },
      {
        queryKey: [DEALER_CACHE_KEY],
        queryFn: () => fetchApi<Dealer[]>('/dealer', { method: 'GET' }),
      },
    ],
  });

  const form = useForm<ServiceAccountDto>({
    resolver: zodResolver(serviceAccountSchema),
    defaultValues: {
      name: account.name ?? '',
      email: account.email ?? '',
      password: account.password ?? '',
      serviceId: account.serviceId,
      dealerId: account.dealerId,
      payment: account.payment,
      personalSlots: account.personalSlots,
      sharedSlots: account.sharedSlots,
      joinDate: new Date(account.joinDate),
      expiryDate: new Date(account.expiryDate),
      note: account.note ?? '',
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: updateServiceAccount,
    onSuccess: () => {
      invalidateCaches([SERVICE_ACCOUNT_CACHE_KEY, SERVICE_CACHE_KEY]);
      queryClient.invalidateQueries({ queryKey: [SERVICE_CACHE_KEY] });
      setOpen(false);
      toast.success('Account updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update account', {
        description: error?.message,
      });
    },
  });

  const onSubmit = async (data: ServiceAccountDto) => {
    await mutateAsync({ id: account.id, data });
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
              <FormControl>
                <Popover onOpenChange={setServicePopOverOpen} open={servicePopOverOpen}>
                  <PopoverTrigger asChild>
                    {/** biome-ignore lint/a11y/useSemanticElements: <explanation> */}
                    <Button
                      aria-expanded={servicePopOverOpen}
                      className="justify-between"
                      role="combobox"
                      variant="outline"
                    >
                      {services?.find((s) => s.id === field.value)?.name || 'Select Service'}
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
                                field.onChange(service.id);
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
              </FormControl>
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
              <Select
                onValueChange={(value) => field.onChange(Number(value))}
                value={field.value?.toString()}
              >
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
              <Select onValueChange={field.onChange} value={field.value}>
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
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === '') onChange('');
                    else onChange(Number.parseInt(inputValue, 10));
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
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (inputValue === '') onChange('');
                    else onChange(Number.parseInt(inputValue, 10));
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
