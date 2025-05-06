"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Save,
  Trash2,
  ImagePlus,
  Calendar
} from "lucide-react";
import Link from "next/link";

export default function NewActivityPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userId, setUserId] = useState("");
  
  const [activity, setActivity] = useState({
    title: "",
    content: "",
    date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
    image: null as File | null,
    published: true
  });

  useEffect(() => {
    // Get the first user for testing
    const getFirstUser = async () => {
      try {
        const response = await fetch('/api/users/first');
        if (!response.ok) {
          throw new Error('Failed to fetch first user');
        }
        const data = await response.json();
        if (data && data.user) {
          setUserId(data.user.id);
        } else {
          toast.error("Nije pronađen nijedan korisnik u bazi.");
        }
      } catch (error) {
        console.error("Error fetching first user:", error);
        toast.error("Greška pri dohvatanju korisnika. Možda ćete morati prvo da kreirate korisnika.");
      }
    };

    getFirstUser();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setActivity({...activity, image: file});
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClear = () => {
    setActivity({...activity, image: null});
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!activity.title.trim()) {
      toast.error("Unesite naslov aktivnosti");
      return;
    }
    
    if (!activity.content.trim()) {
      toast.error("Unesite opis aktivnosti");
      return;
    }

    if (!userId) {
      toast.error("Nije pronađen nijedan korisnik. Molimo prvo kreirajte korisnika.");
      return;
    }
    
    setLoading(true);
    
    try {
      let imageUrl = null;
      
      // Upload image if it exists
      if (activity.image) {
        const formData = new FormData();
        formData.append("file", activity.image);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Failed to upload image');
        }
        
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }
      
      // Create activity data for API call
      const activityData = {
        title: activity.title,
        content: activity.content,
        published: activity.published,
        authorId: userId,
        image: imageUrl
      };

      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activityData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create activity');
      }

      toast.success("Aktivnost je uspešno kreirana");
      router.push("/admin/activities");
    } catch (error) {
      console.error("Error creating activity:", error);
      toast.error(error instanceof Error ? error.message : "Došlo je do greške prilikom kreiranja aktivnosti");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    if (activity.title || activity.content || activity.image) {
      if (window.confirm("Da li ste sigurni da želite da odbacite ovu aktivnost? Svi uneseni podaci će biti izgubljeni.")) {
        router.push("/admin/activities");
      }
    } else {
      router.push("/admin/activities");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2"
            asChild
          >
            <Link href="/admin/activities">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Nova aktivnost</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleDiscard}
            disabled={loading}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Odbaci
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Čuvanje..." : "Sačuvaj"}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalji aktivnosti</CardTitle>
              <CardDescription>
                Unesite osnovne informacije o aktivnosti
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Naslov</Label>
                <Input
                  id="title"
                  placeholder="Unesite naslov aktivnosti"
                  value={activity.title}
                  onChange={(e) => setActivity({...activity, title: e.target.value})}
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date">Datum</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="date"
                    type="date"
                    value={activity.date}
                    onChange={(e) => setActivity({...activity, date: e.target.value})}
                    className="pl-10"
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Opis aktivnosti</Label>
                <Textarea
                  id="content"
                  placeholder="Unesite detaljan opis aktivnosti..."
                  value={activity.content}
                  onChange={(e) => setActivity({...activity, content: e.target.value})}
                  className="min-h-[200px]"
                  disabled={loading}
                  required
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={activity.published}
                  onCheckedChange={(checked: boolean) => setActivity({...activity, published: checked})}
                  disabled={loading}
                />
                <Label htmlFor="published">Objavi odmah</Label>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Fotografija aktivnosti</CardTitle>
              <CardDescription>
                Dodajte fotografiju koja predstavlja aktivnost (opcionalno)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center text-center">
                {imagePreview ? (
                  <div className="relative w-full aspect-video">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover rounded-md"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 h-8 w-8"
                      onClick={handleImageClear}
                      disabled={loading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div 
                      className="cursor-pointer p-4 flex flex-col items-center justify-center w-full"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <ImagePlus className="h-10 w-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-2">Kliknite da dodate fotografiju ili prevucite i otpustite</p>
                      <p className="text-xs text-gray-400">PNG, JPG, ili WEBP (max. 5MB)</p>
                    </div>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  disabled={loading}
                />
              </div>
              
              {!imagePreview && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  Izaberi fotografiju
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Card className="mt-6">
        <CardFooter className="flex justify-end py-4">
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Čuvanje..." : "Sačuvaj aktivnost"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 