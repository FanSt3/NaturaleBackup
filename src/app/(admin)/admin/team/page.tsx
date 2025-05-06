"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search,
  Edit,
  Trash2,
  X,
  User,
  Briefcase,
  FileText,
  Image as ImageIcon,
  UploadCloud,
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// Interface for team member data
interface TeamMember {
  id: string;
  name: string;
  position: string;
  image: string | null;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function TeamManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Fetch team members on mount
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await fetch('/api/team');
        if (!response.ok) {
          throw new Error('Failed to fetch team members');
        }
        const data = await response.json();
        setTeamMembers(data.teamMembers || []);
      } catch (error) {
        console.error('Error fetching team members:', error);
        toast.error('Greška prilikom učitavanja članova tima');
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // Filter team members based on search term
  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        if (currentMember) {
          setCurrentMember({
            ...currentMember,
            image: file as any // Temporary store the file object
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClear = () => {
    setImagePreview(null);
    if (currentMember) {
      setCurrentMember({
        ...currentMember,
        image: null
      });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle delete team member
  const handleDeleteMember = async (id: string) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete ovog člana tima?")) {
      try {
        const response = await fetch(`/api/team/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete team member');
        }
        
        setTeamMembers(prevMembers => prevMembers.filter(member => member.id !== id));
        toast.success('Član tima je uspešno obrisan');
      } catch (error) {
        console.error('Error deleting team member:', error);
        toast.error('Greška prilikom brisanja člana tima');
      }
    }
  };

  // Handle open dialog for new member
  const handleNewMember = () => {
    setCurrentMember({
      id: "",
      name: "",
      position: "",
      image: null,
      description: ""
    });
    setImagePreview(null);
    setIsDialogOpen(true);
  };

  // Handle open dialog for editing existing member
  const handleEditMember = (member: TeamMember) => {
    setCurrentMember(member);
    setImagePreview(member.image);
    setIsDialogOpen(true);
  };

  // Function to validate image URL
  const isValidImageUrl = (url?: string | null) => {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/uploads/');
  };

  // Handle save member
  const handleSaveMember = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!currentMember) return;
    
    // Validate form
    if (!currentMember.name.trim() || !currentMember.position.trim() || !currentMember.description.trim()) {
      toast.error('Molimo popunite sva obavezna polja');
      return;
    }
    
    setSaving(true);
    
    try {
      let imageUrl = currentMember.image;
      
      // If we have a new file to upload
      if (currentMember.image && typeof currentMember.image !== 'string') {
        const formData = new FormData();
        formData.append("file", currentMember.image as File);
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }
        
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url;
      }
      
      // Create the data to send to API
      const memberData = {
        name: currentMember.name,
        position: currentMember.position,
        description: currentMember.description,
        image: imageUrl
      };
      
      let response;
      
      if (currentMember.id) {
        // Update existing member
        response = await fetch(`/api/team/${currentMember.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberData)
        });
      } else {
        // Create new member
        response = await fetch('/api/team', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberData)
        });
      }
      
      if (!response.ok) {
        throw new Error('Failed to save team member');
      }
      
      const savedMember = await response.json();
      
      if (currentMember.id) {
        // Update in state
        setTeamMembers(prevMembers => 
          prevMembers.map(member => 
            member.id === currentMember.id ? savedMember : member
          )
        );
        toast.success('Član tima je uspešno ažuriran');
      } else {
        // Add to state
        setTeamMembers(prevMembers => [...prevMembers, savedMember]);
        toast.success('Novi član tima je uspešno dodat');
      }
      
      setIsDialogOpen(false);
      setCurrentMember(null);
    } catch (error) {
      console.error('Error saving team member:', error);
      toast.error('Greška prilikom čuvanja člana tima');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Upravljanje timom</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleNewMember}>
          <Plus className="mr-2 h-4 w-4" />
          Novi član tima
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Pretraga</CardTitle>
          <CardDescription>
            Pretražite članove tima po imenu ili poziciji
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Pretražite po imenu ili poziciji..."
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
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <p>Učitavanje članova tima...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => (
              <Card key={member.id} className="overflow-hidden hover:shadow-md transition-shadow">
                {member.image && isValidImageUrl(member.image) && (
                  <div className="relative w-full h-48">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{member.name}</CardTitle>
                      <CardDescription>{member.position}</CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        size="icon" 
                        variant="ghost"
                        onClick={() => handleEditMember(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteMember(member.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 line-clamp-3">{member.description}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 py-8 text-center text-gray-500">
              Nema pronađenih članova tima
            </div>
          )}
        </div>
      )}

      {/* Dialog for adding/editing team member */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentMember?.id ? "Izmeni člana tima" : "Dodaj novog člana tima"}
            </DialogTitle>
            <DialogDescription>
              Popunite detalje o članu tima. Sva polja su obavezna.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveMember}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ime i prezime</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="name"
                    placeholder="Unesite ime i prezime"
                    className="pl-10"
                    value={currentMember?.name || ""}
                    onChange={(e) => 
                      setCurrentMember(prev => prev ? {...prev, name: e.target.value} : null)
                    }
                    required
                    disabled={saving}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="position">Pozicija</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="position"
                    placeholder="Unesite poziciju"
                    className="pl-10"
                    value={currentMember?.position || ""}
                    onChange={(e) => 
                      setCurrentMember(prev => prev ? {...prev, position: e.target.value} : null)
                    }
                    required
                    disabled={saving}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Opis</Label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Textarea
                    id="description"
                    placeholder="Unesite opis člana tima"
                    className="pl-10 min-h-24"
                    value={currentMember?.description || ""}
                    onChange={(e) => 
                      setCurrentMember(prev => prev ? {...prev, description: e.target.value} : null)
                    }
                    required
                    disabled={saving}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Slika (opciono)</Label>
                <div className="border-2 border-dashed rounded-lg p-4 transition-colors hover:border-gray-400 focus-within:border-gray-400">
                  {imagePreview ? (
                    <div className="relative w-full aspect-square">
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
                        disabled={saving}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer flex flex-col items-center justify-center py-6 text-gray-500"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadCloud className="h-10 w-10 mb-2" />
                      <p className="text-sm font-medium">Kliknite da dodate sliku ili prevucite i otpustite</p>
                      <p className="text-xs mt-1">PNG, JPG, ili WEBP (max. 5MB)</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                    disabled={saving}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={saving}
                type="button"
              >
                Otkaži
              </Button>
              <Button 
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={saving}
              >
                {saving ? "Čuvanje..." : "Sačuvaj"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
} 