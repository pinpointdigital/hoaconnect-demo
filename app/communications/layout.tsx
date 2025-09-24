import DashboardLayout from '@/app/dashboard/layout';

export default function CommunicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
