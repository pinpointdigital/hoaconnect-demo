import DashboardLayout from '@/app/dashboard/layout';

export default function VendorsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
