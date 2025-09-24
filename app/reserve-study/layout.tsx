import DashboardLayout from '@/app/dashboard/layout';

export default function ReserveStudyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
