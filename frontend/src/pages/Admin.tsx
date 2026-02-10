import { useState, useEffect } from "react";
import {
  Link,
  Outlet,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  Settings,
  User,
  MessageSquare,
  Briefcase,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import logo from "@/assets/logo.png";

const menuItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/admin/projects", label: "Projects", icon: FolderOpen },
  { path: "/admin/services", label: "Services", icon: Briefcase },
  { path: "/admin/testimonials", label: "Testimonials", icon: MessageSquare },
  { path: "/admin/about", label: "About Me", icon: User },
  { path: "/admin/settings", label: "Settings", icon: Settings },
];

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
      // Clear any stored auth data
      localStorage.removeItem("token");
      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const item = menuItems.find((item) => item.path === currentPath);
    return item ? item.label : "Dashboard";
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col bg-card border-r border-border transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0 md:w-20"
        }`}
      >
        <div
          className={`flex items-center gap-3 p-4 border-b border-border ${!sidebarOpen && "md:justify-center"}`}
        >
          <img
            src={logo}
            alt="DynamiteVisuals"
            className="w-10 h-10 object-contain"
          />
          {sidebarOpen && (
            <span className="font-display font-bold text-lg">Admin</span>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                } ${!sidebarOpen && "md:justify-center md:px-2"}`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        <div
          className={`p-4 border-t border-border ${!sidebarOpen && "md:flex md:justify-center"}`}
        >
          <Button
            onClick={handleLogout}
            variant="outline"
            className={`w-full flex items-center gap-2 ${!sidebarOpen && "md:w-auto md:px-2"}`}
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 flex items-center gap-4 px-6 py-4 bg-background/95 backdrop-blur border-b border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="shrink-0"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium capitalize">
              {getPageTitle()}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Admin;
