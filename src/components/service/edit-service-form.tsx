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
import { SERVICE_CACHE_KEY, updateService } from '@/services/service.service';
import type { Service } from '@/types/service';
import { type ServiceDto, serviceSchema } from '@/validations/service.dto';

export function EditServiceForm({ service }: { service: Service }) {
  const { setOpen } = useDialog();
  const [{ files }, { removeFile, openFileDialog, getInputProps }] = useFileUpload({
    accept: 'image/*',
    maxFiles: 1,
    initialFiles: service.logo
      ? [{ id: service.id.toString(), name: service.logo, url: service.logo }]
      : [],
  });

  const form = useForm<ServiceDto>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: service.name || '',
    },
  });

  const { mutateAsync } = useMutation({
    mutationFn: updateService,
    onSuccess: () => {
      invalidateCache(SERVICE_CACHE_KEY);
      toast.success('Service updated successfully');
      setOpen(false);
    },
    onError: (error) => {
      toast.error('Failed to update service', {
        description: error?.message,
      });
    },
  });

  const onSubmit = async (values: ServiceDto) => {
    const payload: ServiceDto & { logo: string } = {
      ...values,
      logo: files[0]?.file.name ?? null,
    };

    const file = files[0];
    if (file?.file instanceof File) {
      const { url } = await uploadFile(file.file);
      payload.logo = url;
    }

    await mutateAsync({ id: service.id, data: payload });
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
                <Input placeholder="Enter the service name" {...field} />
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
