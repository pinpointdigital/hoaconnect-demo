import DashboardLayout from '@/app/dashboard/layout';

export default function CommunityDocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
