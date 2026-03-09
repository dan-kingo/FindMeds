import { ReactNode, useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { useNotificationStore } from "../stores/notificationStore";
import { notificationAPI } from "../services/api";
import {
  LayoutDashboard,
  Pill,
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Bell,
  Check,
  TrendingUp,
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout, user, pharmacy } = useAuthStore();
  const {
    notifications,
    unreadCount,
    setNotifications,
    setUnreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Medicines", href: "/medicines", icon: Pill },
    { name: "Orders", href: "/orders", icon: ShoppingCart },
    { name: "Sales Report", href: "/sales-report", icon: TrendingUp },
    { name: "Profile", href: "/profile?edit=true", icon: User },
  ];

  const isActive = (path: string) => {
    if (path === "/profile?edit=true") {
      return (
        location.pathname === "/profile" && location.search === "?edit=true"
      );
    }
    return location.pathname === path;
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationAPI.getUnreadCount();
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await notificationAPI.getNotifications();
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      markAsRead(notificationId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      markAllAsRead();
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUnreadCount();
      if (showNotifications) {
        await fetchNotifications();
      }
    };

    fetchData();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [showNotifications]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
            <h1 className="text-xl font-bold text-slate-900 font-heading">
              FindMeds Pharmacy
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
                      group flex items-center px-4 py-3 text-sm font-semibold rounded-xl transition-all border border-transparent
                      ${
                        isActive(item.href)
                          ? "bg-primary-100 text-primary-700 border-primary-200"
                          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900"
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
                    {item.name === "Orders" && unreadCount > 0 && (
                      <span className="ml-auto bg-error-500 text-white text-xs rounded-full h-5 min-w-5 px-1 flex items-center justify-center">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
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
                  <div className="font-semibold truncate">
                    {pharmacy?.name || user?.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {pharmacy?.email || user?.email}
                  </div>
                  {pharmacy?.status && (
                    <div className="text-xs mt-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          pharmacy.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : pharmacy.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {pharmacy.status}
                      </span>
                    </div>
                  )}
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
                FindMeds Pharmacy
              </h1>
            </div>

            <div className="flex items-center space-x-4" ref={notificationsRef}>
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    if (!showNotifications) {
                      fetchNotifications();
                    }
                  }}
                  className="relative p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg overflow-hidden z-50 border border-slate-200">
                    <div className="py-1">
                      <div className="px-4 py-2 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                        <h3 className="text-sm font-medium text-slate-700">
                          Notifications
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAllAsRead();
                          }}
                          className="text-xs text-primary-600 hover:text-primary-800 flex items-center"
                        >
                          <Check className="h-3 w-3 mr-1" /> Mark all as read
                        </button>
                      </div>

                      {notifications.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-slate-500">
                          No notifications
                        </div>
                      ) : (
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.map((notification) => (
                            <div
                              key={notification._id}
                              onClick={() => handleMarkAsRead(notification._id)}
                              className={`px-4 py-3 text-sm cursor-pointer ${!notification.isRead ? "bg-primary-50" : "bg-white"} hover:bg-slate-50`}
                            >
                              <div className="flex justify-between">
                                <p className="text-slate-700">
                                  {notification.message}
                                </p>
                                {!notification.isRead && (
                                  <span className="h-2 w-2 rounded-full bg-primary-500 mt-1.5"></span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-1">
                                {new Date(
                                  notification.createdAt,
                                ).toLocaleString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
