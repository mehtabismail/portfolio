import AdminChrome from "@/components/admin/AdminChrome";
import "./admin-panel.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminChrome>{children}</AdminChrome>;
}
