"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileEdit, Activity, Users, BookMarked, Database, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    blogs: 0,
    activities: 0,
    teamMembers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const fetchStats = async () => {
    try {
      setRefreshing(true);
      // Fetch blog count
      const blogsRes = await fetch("/api/blogs?limit=1");
      const blogsData = await blogsRes.json();
      
      // Fetch activities count
      const activitiesRes = await fetch("/api/activities?limit=1");
      const activitiesData = await activitiesRes.json();
      
      // Fetch team members count
      const teamRes = await fetch("/api/team?limit=1");
      const teamData = await teamRes.json();

      // Set stats with proper error handling
      setStats({
        blogs: blogsData?.pagination?.total || 0,
        activities: activitiesData?.pagination?.total || 0,
        teamMembers: teamData?.pagination?.total || 0,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to fetch dashboard stats");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Set up visibility change listener to refresh stats when user returns to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchStats();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleRefresh = () => {
    if (!refreshing) {
      fetchStats();
    }
  };

  const handleSeedDatabase = async () => {
    if (seeding) return;
    
    try {
      setSeeding(true);
      const response = await fetch("/api/seed", {
        method: "POST",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to seed database");
      }
      
      toast.success("Database seeded successfully");
      
      // Refresh stats
      setTimeout(() => {
        fetchStats();
      }, 1000);
    } catch (error) {
      console.error("Error seeding database:", error);
      toast.error("Failed to seed database");
    } finally {
      setSeeding(false);
    }
  };

  const dashboardItems = [
    {
      title: "Blog Posts",
      icon: FileEdit,
      count: stats.blogs,
      link: "/admin/blog",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Activities",
      icon: Activity,
      count: stats.activities,
      link: "/admin/activities",
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Team Members",
      icon: Users,
      count: stats.teamMembers,
      link: "/admin/team",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500 mt-2">
            Welcome to the Naturale admin panel. Manage your content here.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleRefresh}
            disabled={refreshing}
            className="h-9 w-9"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
          
          {/* Development-only seed button */}
          {process.env.NODE_ENV === "development" && (
            <Button 
              onClick={handleSeedDatabase} 
              disabled={seeding}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Database className="mr-2 h-4 w-4" />
              {seeding ? "Seeding..." : "Seed Database"}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {dashboardItems.map((item) => (
          <Link key={item.title} href={item.link}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">{item.title}</CardTitle>
                <div className={`p-2 rounded-full ${item.bgColor}`}>
                  <item.icon className={`h-5 w-5 ${item.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {loading || refreshing ? "..." : item.count}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {loading || refreshing ? "Loading..." : `Total ${item.title.toLowerCase()}`}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-medium">
              Getting Started
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <BookMarked className="mr-2 h-5 w-5 text-emerald-500" />
                Managing Content
              </h3>
              <p className="text-sm text-gray-500">
                Click on any of the cards above to manage your blog posts, activities, and team members.
                You can create, edit, and delete content from their respective sections.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <FileEdit className="mr-2 h-5 w-5 text-emerald-500" />
                Blog Posts
              </h3>
              <p className="text-sm text-gray-500">
                Write engaging blog posts about physics concepts, projects, and news.
                Blog posts support Markdown formatting for rich content.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <Activity className="mr-2 h-5 w-5 text-emerald-500" />
                Activities
              </h3>
              <p className="text-sm text-gray-500">
                Create activities such as workshops, demonstrations, and events.
                Include detailed descriptions and images to attract participants.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <Users className="mr-2 h-5 w-5 text-emerald-500" />
                Team Members
              </h3>
              <p className="text-sm text-gray-500">
                Add information about your team members including their roles, 
                expertise, and profile pictures.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 