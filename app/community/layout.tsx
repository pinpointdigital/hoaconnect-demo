import DashboardLayout from '@/app/dashboard/layout';

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
