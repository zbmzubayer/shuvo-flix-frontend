'use client';

import { SheetIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { exportToExcel } from '@/lib/excel';
import type { ServiceAccountWithDealer } from '@/types/service-account';

export function ServiceAccountExportExcel({
  serviceAccounts,
  fileName,
}: {
  serviceAccounts: ServiceAccountWithDealer[];
  fileName?: string;
}) {
  const handleExport = () => {
    const customerData = serviceAccounts.map((item) => ({
      ID: item.id,
      Name: item.name,
      Email: item.email,
      Password: item.password,
      Dealer: item.dealer.name,
    }));
    exportToExcel(customerData, fileName || 'ServiceAccountsList');
  };

  return (
    <Button onClick={handleExport} size="sm" variant="outline">
      <SheetIcon />
      Export to Excel
    </Button>
  );
}
