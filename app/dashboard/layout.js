export const metadata = { title: 'Dashboard', robots: { index: false, follow: false } };
export default function DashboardLayout({ children }) {
  return <div className="min-h-screen bg-[#EFE6D6] text-espresso">{children}</div>;
}
