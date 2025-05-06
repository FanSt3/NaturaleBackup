"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  User, 
  Mail, 
  Key, 
  Bell, 
  Phone, 
  Save,
  AlertTriangle,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function SettingsPage() {
  const { user } = useAuth();
  // User profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "+381 65 123 4567",
    avatarUrl: "",
  });

  // Set user data when it's loaded
  useEffect(() => {
    if (user) {
      setProfile({
        ...profile,
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);
  
  // Password state
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [firstLogin, setFirstLogin] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  // Notifications state
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: true,
    updates: true,
  });

  // Check if this is the first login
  useEffect(() => {
    if (user && user.firstLogin) {
      setFirstLogin(true);
    }
  }, [user]);
  
  // Handle profile form submit
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send an API request to update the profile
    toast.success("Profil je uspešno ažuriran");
  };
  
  // Handle password form submit
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.new !== password.confirm) {
      toast.error("Lozinke se ne podudaraju");
      return;
    }
    
    if (password.new.length < 8) {
      toast.error("Nova lozinka mora imati najmanje 8 karaktera");
      return;
    }

    setIsChangingPassword(true);
    
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: password.current,
          newPassword: password.new,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to change password');
      }

      toast.success("Lozinka je uspešno promenjena");
      setPassword({ current: "", new: "", confirm: "" });
      setFirstLogin(false);
    } catch (error) {
      console.error('Error changing password:', error);
      let errorMessage = 'Greška prilikom promene lozinke';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };
  
  // Handle notifications form submit
  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you'd send an API request to update the notification settings
    toast.success("Podešavanja obaveštenja su ažurirana");
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Podešavanja</h1>
      
      <Tabs defaultValue={firstLogin ? "password" : "profile"} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="password">Lozinka</TabsTrigger>
          <TabsTrigger value="notifications">Obaveštenja</TabsTrigger>
        </TabsList>
        
        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profil</CardTitle>
              <CardDescription>
                Upravljajte informacijama o svom profilu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="flex flex-col space-y-6 md:flex-row md:space-x-6 md:space-y-0">
                  <div className="mb-4 flex flex-col items-center space-y-2">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.avatarUrl} alt={profile.name} />
                      <AvatarFallback className="text-2xl">
                        {profile.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Button type="button" variant="outline" size="sm">
                      Promeni sliku
                    </Button>
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ime i prezime</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={e => setProfile({...profile, name: e.target.value})}
                          className="pl-10"
                          required
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
                          value={profile.email}
                          onChange={e => setProfile({...profile, email: e.target.value})}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Broj telefona</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={e => setProfile({...profile, phone: e.target.value})}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                    <Save className="mr-2 h-4 w-4" />
                    Sačuvaj promene
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Password Settings */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Promena lozinke</CardTitle>
              <CardDescription>
                Ažurirajte vašu lozinku
              </CardDescription>
            </CardHeader>
            <CardContent>
              {firstLogin && (
                <Alert className="mb-6 bg-amber-50 text-amber-800 border-amber-300">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Ovo je vaše prvo prijavljivanje</AlertTitle>
                  <AlertDescription>
                    Iz bezbednosnih razloga, molimo vas da promenite inicijalnu lozinku pre korišćenja sistema.
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Trenutna lozinka</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="current-password"
                        type="password"
                        value={password.current}
                        onChange={e => setPassword({...password, current: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nova lozinka</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="new-password"
                        type="password"
                        value={password.new}
                        onChange={e => setPassword({...password, new: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Potvrdi novu lozinku</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="confirm-password"
                        type="password"
                        value={password.confirm}
                        onChange={e => setPassword({...password, confirm: e.target.value})}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button 
                    type="submit" 
                    className="bg-emerald-600 hover:bg-emerald-700"
                    disabled={isChangingPassword}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {isChangingPassword ? "Menjanje lozinke..." : "Promeni lozinku"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notifications Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Podešavanja obaveštenja</CardTitle>
              <CardDescription>
                Odaberite koja obaveštenja želite da primate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNotificationsSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-notifications">Email obaveštenja</Label>
                      <p className="text-sm text-gray-500">
                        Primajte obaveštenja putem email-a
                      </p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(checked: boolean) => 
                        setNotifications({...notifications, email: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-notifications">Push obaveštenja</Label>
                      <p className="text-sm text-gray-500">
                        Primajte push obaveštenja u pregledaču
                      </p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notifications.push}
                      onCheckedChange={(checked: boolean) => 
                        setNotifications({...notifications, push: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="marketing-notifications">Marketinška obaveštenja</Label>
                      <p className="text-sm text-gray-500">
                        Primajte najnovije vesti o našim aktivnostima i događajima
                      </p>
                    </div>
                    <Switch
                      id="marketing-notifications"
                      checked={notifications.marketing}
                      onCheckedChange={(checked: boolean) => 
                        setNotifications({...notifications, marketing: checked})
                      }
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="update-notifications">Obaveštenja o ažuriranjima</Label>
                      <p className="text-sm text-gray-500">
                        Budite obavešteni o novim funkcionalnostima i ažuriranjima platforme
                      </p>
                    </div>
                    <Switch
                      id="update-notifications"
                      checked={notifications.updates}
                      onCheckedChange={(checked: boolean) => 
                        setNotifications({...notifications, updates: checked})
                      }
                    />
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                    <Save className="mr-2 h-4 w-4" />
                    Sačuvaj podešavanja
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 