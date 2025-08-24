'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { invalidateCache } from '@/actions/cache.action';
import { FileUpload } from '@/components/file-upload';
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
import { useFileUpload } from '@/hooks/use-file-upload';
import { uploadFile } from '@/services/file.service';
import { createProvider, PROVIDER_CACHE_KEY } from '@/services/provider.service';
import { type ProviderDto, providerSchema } from '@/validations/provider.dto';

export function CreateProviderForm() {
  const { setOpen } = useDialog();
  const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
    accept: 'image/*',
    maxFiles: 1,
  });

  const form = useForm<ProviderDto>({
    resolver: zodResolver(providerSchema),
    defaultValues: { name: '' },
  });

  const { mutateAsync } = useMutation({
    mutationFn: createProvider,
    onSuccess: () => {
      invalidateCache(PROVIDER_CACHE_KEY);
      toast.success('Provider created successfully');
      setOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to create provider', {
        description: error?.message,
      });
    },
  });

  const onSubmit = async (values: ProviderDto) => {
    const payload: ProviderDto & { logo: string } = { ...values, logo: '' };
    const file = files[0];
    if (file?.file instanceof File) {
      const { url } = await uploadFile(file.file);
      payload.logo = url;
    }
    await mutateAsync(payload);
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
                <Input placeholder="Enter the provider name" {...field} />
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
            Create
          </Button>
        </div>
      </form>
    </Form>
  );
}
