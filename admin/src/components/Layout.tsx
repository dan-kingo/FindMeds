import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import {
  LayoutDashboard,
  Users,
  Building2,
  ShoppingCart,
  Pill,
  Bell,
  BarChart3,
  LogOut,
  Menu,
  X,
  Shield,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { logout, admin } = useAuthStore();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Users", href: "/users", icon: Users },
    { name: "Pharmacies", href: "/pharmacies", icon: Building2 },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Medicines", href: "/medicines", icon: Pill },
    { name: "Notifications", href: "/notifications", icon: Bell },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="h-screen bg-transparent">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white/95 text-slate-800 border-r border-slate-200/80 shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between h-20 px-6 border-b border-slate-200 bg-white/90 shrink-0">
            <h1 className="text-xl font-bold text-slate-900 flex items-center font-heading">
              <span className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
                <Shield className="h-5 w-5" />
              </span>
              FindMeds Admin
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-6">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all
                      ${
                        isActive(item.href)
                          ? "bg-primary-100 text-primary-700 border border-primary-200"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-transparent"
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon
                      className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${isActive(item.href) ? "text-primary-600" : "text-slate-400 group-hover:text-slate-700"}
                    `}
                    />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200 sticky bottom-0 bg-white/95 pb-3">
              <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-[0.16em]">
                Account
              </div>
              <div className="space-y-1">
                <div className="px-3 py-2 text-sm text-slate-800 rounded-xl bg-slate-100/80">
                  <div className="font-semibold">Admin</div>
                  <div className="text-xs text-slate-500 truncate">
                    {admin?.email}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="group flex items-center w-full px-3 py-2 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-colors"
                >
                  <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-slate-700" />
                  Sign out
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="h-full lg:pl-72 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white/95 border-b border-slate-200/80">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md text-slate-500 hover:text-slate-900 lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-lg font-semibold text-slate-900 lg:hidden ml-2 font-heading">
                FindMeds Admin
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-slate-600 hidden sm:block">
                Command Center:{" "}
                <span className="font-semibold text-slate-900">Admin</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-primary-100 text-primary-700 grid place-items-center font-semibold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-8 animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
