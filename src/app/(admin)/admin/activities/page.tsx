"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search,
  Edit,
  Trash2,
  Eye,
  ListFilter,
  X,
  Image,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";

// Define activity type
interface Activity {
  id: string;
  title: string;
  content: string;
  image: string | null;
  published: boolean;
  createdAt: Date;
  author: {
    name: string;
  };
}

export default function ActivitiesManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/activities');
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        
        const data = await response.json();
        
        // Transform the data to match our interface
        const formattedActivities = data.activities.map((activity: any) => ({
          ...activity,
          createdAt: new Date(activity.createdAt),
          status: activity.published ? 'published' : 'draft'
        }));
        
        setActivities(formattedActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
        toast.error('Failed to load activities');
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  // Filter activities based on search term and status
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (activity.author?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                          (statusFilter === "published" && activity.published) ||
                          (statusFilter === "draft" && !activity.published);
    
    return matchesSearch && matchesStatus;
  });

  // Handle delete activity
  const handleDeleteActivity = async (id: string) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete ovu aktivnost?")) {
      try {
        const response = await fetch(`/api/activities/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete activity');
        }
        
        setActivities(prevActivities => prevActivities.filter(activity => activity.id !== id));
        toast.success('Aktivnost uspešno obrisana');
      } catch (error) {
        console.error('Error deleting activity:', error);
        toast.error('Failed to delete activity');
      }
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Upravljanje aktivnostima</h1>
        <Button 
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => router.push('/admin/activities/new')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova aktivnost
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Pretraga i filtriranje</CardTitle>
          <CardDescription>
            Pretražite aktivnosti po naslovu ili autoru
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Pretražite po naslovu ili autoru..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
                className={statusFilter === "all" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                <ListFilter className="mr-2 h-4 w-4" />
                Sve
              </Button>
              <Button
                variant={statusFilter === "published" ? "default" : "outline"}
                onClick={() => setStatusFilter("published")}
                className={statusFilter === "published" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                Objavljene
              </Button>
              <Button
                variant={statusFilter === "draft" ? "default" : "outline"}
                onClick={() => setStatusFilter("draft")}
                className={statusFilter === "draft" ? "bg-emerald-600 hover:bg-emerald-700" : ""}
              >
                Nacrti
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Aktivnosti</CardTitle>
          <CardDescription>
            {loading ? 'Učitavanje...' : `Ukupno ${filteredActivities.length} ${filteredActivities.length === 1 ? "aktivnost" : "aktivnosti"}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto rounded-md border">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">Naslov</th>
                  <th scope="col" className="px-6 py-3">Autor</th>
                  <th scope="col" className="px-6 py-3">Status</th>
                  <th scope="col" className="px-6 py-3">Datum</th>
                  <th scope="col" className="px-6 py-3">Slika</th>
                  <th scope="col" className="px-6 py-3 text-right">Akcije</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr className="bg-white border-b">
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Učitavanje aktivnosti...
                    </td>
                  </tr>
                ) : filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => (
                    <tr key={activity.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {activity.title}
                      </td>
                      <td className="px-6 py-4">
                        {activity.author?.name || 'Unknown'}
                      </td>
                      <td className="px-6 py-4">
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            activity.published
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {activity.published ? 'Objavljena' : 'Nacrt'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <CalendarDays className="h-4 w-4 mr-1 text-gray-400" />
                          {activity.createdAt.toLocaleDateString('sr-RS')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {activity.image ? (
                          <div className="flex items-center">
                            <Image className="h-4 w-4 mr-1 text-emerald-500" />
                            <span className="text-emerald-500">Da</span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <Image className="h-4 w-4 mr-1 text-gray-400" />
                            <span className="text-gray-400">Ne</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <Button size="icon" variant="ghost" asChild>
                          <Link href={`/activities#${activity.id}`} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => router.push(`/admin/activities/edit/${activity.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteActivity(activity.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white border-b">
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      Nema pronađenih aktivnosti
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 