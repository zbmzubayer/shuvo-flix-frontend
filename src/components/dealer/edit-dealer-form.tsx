'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { invalidateCache } from '@/actions/cache.action';
import { useDialog } from '@/components/dialog-controlled';
import { FileUpload } from '@/components/file-upload';
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
import { Spinner } from '@/components/ui/spinner';
import { useFileUpload } from '@/hooks/use-file-upload';
import { DEALER_CACHE_KEY, updateDealer } from '@/services/dealer.service';
import { uploadFile } from '@/services/file.service';
import type { Dealer } from '@/types/dealer';
import { type DealerDto, dealerSchema } from '@/validations/dealer.dto';

export function EditDealerForm({ dealer }: { dealer: Dealer }) {
  const { setOpen } = useDialog();
  const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
    accept: 'image/*',
    maxFiles: 1,
    initialFiles: dealer.logo
      ? [{ id: dealer.id.toString(), name: dealer.logo, url: dealer.logo }]
      : [],
  });

  const form = useForm<DealerDto>({
    resolver: zodResolver(dealerSchema),
    defaultValues: {
      name: dealer.name || '',
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: updateDealer,
    onSuccess: () => {
      invalidateCache(DEALER_CACHE_KEY);
      toast.success('Dealer updated successfully');
      setOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to update dealer', {
        description: error?.message,
      });
    },
  });

  const onSubmit = async (values: DealerDto) => {
    const payload: DealerDto & { logo: string } = { ...values, logo: files[0]?.file.name ?? null };

    const file = files[0];
    if (file?.file instanceof File) {
      const { url } = await uploadFile(file.file);
      payload.logo = url;
    }

    await mutateAsync({ id: dealer.id, data: payload });
  };

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter the dealer name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-end justify-between">
          <FileUpload
            files={files}
            getInputProps={getInputProps}
            label="Logo"
            openFileDialog={openFileDialog}
            removeFile={removeFile}
          />
          <Button disabled={form.formState.isSubmitting} size="sm" type="submit">
            {form.formState.isSubmitting && <Spinner />}
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
}
