'use client';

import { SheetIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { exportToExcel } from '@/lib/excel';
import type { CustomerDetails } from '@/types/customer';

export function CustomerExportExcel({ customers }: { customers: CustomerDetails[] }) {
  const handleExport = () => {
    const customerData = customers.map((customer) => ({
      ID: customer.id,
      Name: customer.name,
      Email: customer.personalEmail,
      Phone: customer.phone,
      Social: customer.social || 'N/A',
      SocialLink: customer.socialLink || 'N/A',
    }));
    exportToExcel(customerData, 'CustomersList');
  };

  return (
    <Button onClick={handleExport} size="sm" variant="outline">
      <SheetIcon />
      Export to Excel
    </Button>
  );
}
