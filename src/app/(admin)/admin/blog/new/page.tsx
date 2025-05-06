"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import MarkdownEditor from "@/components/blog/MarkdownEditor";
import { toast } from "sonner";
import { 
  ArrowLeft, 
  Save,
  Trash2,
} from "lucide-react";
import Link from "next/link";

export default function NewBlogPostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [blogPost, setBlogPost] = useState({
    title: "",
    content: "",
    published: true
  });
  const [userId, setUserId] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!blogPost.title.trim()) {
      toast.error("Unesite naslov blog posta");
      return;
    }
    
    if (!blogPost.content.trim()) {
      toast.error("Unesite sadržaj blog posta");
      return;
    }

    if (!userId) {
      toast.error("Nije pronađen nijedan korisnik. Molimo prvo kreirajte korisnika.");
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...blogPost,
          authorId: userId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create blog post');
      }

      const data = await response.json();
      
      toast.success("Blog post je uspešno kreiran");
      router.push("/admin/blog");
    } catch (error) {
      console.error("Error creating blog post:", error);
      toast.error(error instanceof Error ? error.message : "Došlo je do greške prilikom kreiranja blog posta");
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    if (blogPost.title || blogPost.content) {
      if (window.confirm("Da li ste sigurni da želite da odbacite ovaj blog post? Svi uneseni podaci će biti izgubljeni.")) {
        router.push("/admin/blog");
      }
    } else {
      router.push("/admin/blog");
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
            <Link href="/admin/blog">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Novi blog post</h1>
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
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Detalji blog posta</CardTitle>
          <CardDescription>
            Unesite osnovne informacije o blog postu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Naslov</Label>
            <Input
              id="title"
              placeholder="Unesite naslov blog posta"
              value={blogPost.title}
              onChange={(e) => setBlogPost({...blogPost, title: e.target.value})}
              disabled={loading}
              required
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={blogPost.published}
              onCheckedChange={(checked: boolean) => setBlogPost({...blogPost, published: checked})}
              disabled={loading}
            />
            <Label htmlFor="published">Objavi odmah</Label>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sadržaj</CardTitle>
          <CardDescription>
            Napišite sadržaj blog posta koristeći Markdown format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MarkdownEditor
            value={blogPost.content}
            onChange={(value) => setBlogPost({...blogPost, content: value})}
            placeholder="Počnite da pišete sadržaj blog posta..."
          />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleSubmit}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? "Čuvanje..." : "Sačuvaj"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 