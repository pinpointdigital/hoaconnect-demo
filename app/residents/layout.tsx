import DashboardLayout from '@/app/dashboard/layout';

export default function ResidentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
