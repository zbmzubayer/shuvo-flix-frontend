'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
import { updateProvider } from '@/services/provider.service';
import type { Provider } from '@/types/provider';
import { type ProviderDto, providerSchema } from '@/validations/provider.dto';

export function EditProviderForm({ provider }: { provider: Provider }) {
  const { setOpen } = useDialog();
  const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
    accept: 'image/*',
    maxFiles: 1,
    initialFiles: provider.logo
      ? [{ id: provider.id.toString(), name: provider.logo, url: provider.logo }]
      : [],
  });

  const form = useForm<ProviderDto>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: provider.name || '',
    },
  });

  const { mutateAsync, error } = useMutation({
    mutationFn: updateProvider,
    onSuccess: () => {
      toast.success('Provider updated successfully');
      setOpen(false);
    },
    onError: () => {
      toast.error('Failed to update provider', {
        description: error?.message,
      });
    },
  });

  const onSubmit = async (values: ProviderDto) => {
    const payload: ProviderDto & { logo: string } = {
      ...values,
      logo: files[0]?.file.name ?? null,
    };

    const file = files[0];
    if (file?.file instanceof File) {
      const { url } = await uploadFile(file.file);
      payload.logo = url;
    }

    await mutateAsync({ id: provider.id, data: payload });
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
            Update
          </Button>
        </div>
      </form>
    </Form>
  );
}
