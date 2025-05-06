"use client";

import { ReactNode, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  FileEdit, 
  Activity, 
  Users, 
  Settings,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  // Redirect if user is not on login page and not authenticated
  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [user, loading, pathname, router]);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to log out");
    }
  };

  // Show login page without layout if on login page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Show loading state or the admin layout for authenticated users
  if (loading || !user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Blog", href: "/admin/blog", icon: FileEdit },
    { name: "Aktivnosti", href: "/admin/activities", icon: Activity },
    { name: "Tim", href: "/admin/team", icon: Users },
    { name: "Podešavanja", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle */}
      <div className="fixed top-0 left-0 z-40 lg:hidden p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-600"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Open sidebar</span>
        </Button>
      </div>

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-lg z-50">
            <div className="flex items-center justify-between h-16 px-6 bg-emerald-600 text-white">
              <span className="text-xl font-semibold">Naturale Admin</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="text-white hover:bg-emerald-700"
              >
                <X className="h-6 w-6" />
                <span className="sr-only">Close sidebar</span>
              </Button>
            </div>
            
            <nav className="flex-1 px-3 py-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link 
                    key={item.name}
                    href={item.href}
                    className={`
                      flex items-center px-4 py-3 text-sm font-medium rounded-md 
                      ${isActive(item.href) 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
              
              <Separator className="my-4" />
              
              <div className="px-4 py-2 text-sm text-gray-500">
                Logged in as: {user.name}
              </div>
              
              <Button 
                variant="outline" 
                className="w-full justify-start text-red-600" 
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
              
              <Button variant="outline" className="w-full justify-start mt-2" asChild>
                <Link href="/">
                  <LogOut className="mr-3 h-5 w-5" />
                  Back to website
                </Link>
              </Button>
            </nav>
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1">
            <div className="flex items-center h-16 px-6 bg-emerald-600 text-white">
              <span className="text-xl font-semibold">Naturale Admin</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
              <nav className="flex-1 px-3 py-4 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={item.name}
                      href={item.href}
                      className={`
                        flex items-center px-4 py-3 text-sm font-medium rounded-md
                        ${isActive(item.href) 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'text-gray-700 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Icon className="mr-3 h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}
                
                <Separator className="my-4" />
                
                <div className="px-4 py-2 text-sm text-gray-500">
                  Logged in as: {user.name}
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-red-600" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </Button>
                
                <Button variant="outline" className="w-full justify-start mt-2" asChild>
                  <Link href="/">
                    <LogOut className="mr-3 h-5 w-5" />
                    Back to website
                  </Link>
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none px-4 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
} 