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
    <div className="flex h-screen bg-transparent">
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
        fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-slate-100 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-slate-700/80 bg-slate-900">
          <h1 className="text-xl font-bold text-white flex items-center font-heading">
            <span className="mr-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary-500/20 text-primary-300">
              <Shield className="h-5 w-5" />
            </span>
            FindMeds Admin
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
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
                        ? "bg-primary-500/20 text-primary-200 border border-primary-400/40"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white border border-transparent"
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon
                    className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${isActive(item.href) ? "text-primary-300" : "text-slate-500 group-hover:text-slate-300"}
                  `}
                  />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700/80">
            <div className="px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-[0.16em]">
              Account
            </div>
            <div className="space-y-1">
              <div className="px-3 py-2 text-sm text-slate-200 rounded-xl bg-slate-800/70">
                <div className="font-semibold">Admin</div>
                <div className="text-xs text-slate-400 truncate">
                  {admin?.email}
                </div>
              </div>
              <button
                onClick={logout}
                className="group flex items-center w-full px-3 py-2 text-sm font-medium text-slate-300 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5 text-slate-500 group-hover:text-slate-300" />
                Sign out
              </button>
            </div>
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white/75 backdrop-blur-md border-b border-white/70">
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
