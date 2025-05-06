"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Mail,
  Key,
  UserPlus,
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
import { toast } from "sonner";

// Interface for admin user data
interface AdminUser {
  id: string;
  name: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
  firstLogin: boolean;
}

export default function AdminManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<Partial<AdminUser> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Fetch admin users on mount
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await fetch('/api/administrators');
        if (!response.ok) {
          throw new Error('Failed to fetch administrators');
        }
        const data = await response.json();
        setAdmins(data.admins || []);
      } catch (error) {
        console.error('Error fetching administrators:', error);
        toast.error('Greška prilikom učitavanja administratora');
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  // Filter admins based on search term
  const filteredAdmins = admins.filter(admin => {
    const matchesSearch = 
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Handle delete admin
  const handleDeleteAdmin = async (id: string) => {
    if (window.confirm("Da li ste sigurni da želite da obrišete ovog administratora?")) {
      try {
        const response = await fetch(`/api/administrators/${id}`, {
          method: 'DELETE',
        });
        
        if (!response.ok) {
          throw new Error('Failed to delete administrator');
        }
        
        setAdmins(prevAdmins => prevAdmins.filter(admin => admin.id !== id));
        toast.success('Administrator je uspešno obrisan');
      } catch (error) {
        console.error('Error deleting administrator:', error);
        toast.error('Greška prilikom brisanja administratora');
      }
    }
  };

  // Handle open dialog for new admin
  const handleNewAdmin = () => {
    setCurrentAdmin({
      name: "",
      email: "",
      firstLogin: true
    });
    setPassword("");
    setIsDialogOpen(true);
  };

  // Handle save admin
  const handleSaveAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!currentAdmin) return;
    
    // Validate form
    if (!currentAdmin.name?.trim() || !currentAdmin.email?.trim() || !password.trim()) {
      toast.error('Molimo popunite sva obavezna polja');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentAdmin.email)) {
      toast.error('Unesite validnu email adresu');
      return;
    }
    
    // Validate password strength
    if (password.length < 8) {
      toast.error('Lozinka mora imati najmanje 8 karaktera');
      return;
    }
    
    setSaving(true);
    
    try {
      // Create the data to send to API
      const adminData = {
        name: currentAdmin.name,
        email: currentAdmin.email,
        password: password
      };
      
      const response = await fetch('/api/administrators', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adminData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save administrator');
      }
      
      const savedAdmin = await response.json();
      
      // Add to state
      setAdmins(prevAdmins => [...prevAdmins, savedAdmin.admin]);
      
      toast.success('Novi administrator je uspešno dodat i obaveštenje je poslato na email');
      setIsDialogOpen(false);
      setCurrentAdmin(null);
      setPassword("");
    } catch (error) {
      console.error('Error saving administrator:', error);
      let errorMessage = 'Greška prilikom čuvanja administratora';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Upravljanje administratorima</h1>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={handleNewAdmin}>
          <Plus className="mr-2 h-4 w-4" />
          Novi administrator
        </Button>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Pretraga</CardTitle>
          <CardDescription>
            Pretražite administratore po imenu ili email adresi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Pretražite po imenu ili email adresi..."
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
          <p>Učitavanje administratora...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAdmins.length > 0 ? (
            filteredAdmins.map((admin) => (
              <Card key={admin.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{admin.name}</CardTitle>
                      <CardDescription>{admin.email}</CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteAdmin(admin.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm">
                    {admin.firstLogin ? (
                      <span className="text-orange-500">Korisnik se još nije prvi put ulogovao</span>
                    ) : (
                      <span className="text-emerald-500">Korisnik je promenio inicijalnu lozinku</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-3 py-8 text-center text-gray-500">
              Nema pronađenih administratora
            </div>
          )}
        </div>
      )}

      {/* Dialog for adding administrator */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              Dodaj novog administratora
            </DialogTitle>
            <DialogDescription>
              Popunite podatke o administratoru. Sva polja su obavezna. Email sa pristupnim podacima će biti poslat na unesenu email adresu.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveAdmin}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Ime i prezime</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="name"
                    placeholder="Unesite ime i prezime"
                    className="pl-10"
                    value={currentAdmin?.name || ""}
                    onChange={(e) => 
                      setCurrentAdmin(prev => prev ? {...prev, name: e.target.value} : null)
                    }
                    required
                    disabled={saving}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email adresa</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Unesite email adresu"
                    className="pl-10"
                    value={currentAdmin?.email || ""}
                    onChange={(e) => 
                      setCurrentAdmin(prev => prev ? {...prev, email: e.target.value} : null)
                    }
                    required
                    disabled={saving}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Inicijalna lozinka</Label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Unesite inicijalnu lozinku"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={saving}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Lozinka mora imati najmanje 8 karaktera. Administrator će biti zatražen da promeni ovu lozinku prilikom prvog prijavljivanja.
                </p>
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