'use client';

import { createContext, useContext, useState } from 'react';

import { Dialog, DialogTrigger } from '@/components/ui/dialog';

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

const DialogContext = createContext<DialogContextValue | null>(null);

type DialogControlledProps = React.ComponentProps<typeof Dialog> & {
  trigger: React.ReactNode;
};

export function DialogControlled({ children, trigger, ...props }: DialogControlledProps) {
  const [open, setOpen] = useState(false);

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      <Dialog onOpenChange={setOpen} open={open} {...props}>
        <DialogTrigger onClick={(prev) => setOpen(!prev)}>{trigger}</DialogTrigger>
        {children}
      </Dialog>
    </DialogContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}
