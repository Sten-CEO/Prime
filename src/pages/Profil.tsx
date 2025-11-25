import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Home, Award, BookOpen, Target, User, Settings, Upload, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const Profil = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setEmail(user.email || "");
        setFullName(user.user_metadata?.full_name || "");
      }
    };
    getUser();
  }, []);

  const getInitials = () => {
    if (!fullName) return "U";
    const names = fullName.split(" ");
    if (names.length >= 2) {
      return names[0][0] + names[1][0];
    }
    return fullName[0];
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });

      if (error) throw error;

      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Erreur",
        description: "Le mot de passe doit contenir au moins 6 caractères",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: "Mot de passe mis à jour",
        description: "Votre mot de passe a été changé avec succès",
      });

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: "Erreur",
        description: "Impossible de changer le mot de passe",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/src/assets/black-shapes-bg.jpg')" }}
      />

      {/* Glass Sidebar */}
      <div className="fixed left-6 top-6 bottom-6 w-20 z-20">
        <div className="h-full backdrop-blur-2xl bg-white/[0.02] rounded-2xl border border-white/[0.08] flex flex-col items-center py-6 px-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)]">
          <div className="mb-4">
            <span className="text-white font-bold text-lg tracking-tight">Prime.</span>
          </div>
          
          <Separator className="w-10 bg-white/20 mb-8" />
          
          <div className="flex-none">
            <button 
              onClick={() => navigate("/accueil")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <Home className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <Separator className="w-10 bg-white/20 mx-auto my-4" />
          </div>
          
          <div className="flex-1 flex flex-col gap-4">
            <button 
              onClick={() => navigate("/domaines/business")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <Award className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button 
              onClick={() => navigate("/journal")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors">
              <Target className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <Separator className="w-10 bg-white/20 mx-auto my-2" />
          </div>
          
          <div className="flex-none flex flex-col gap-4 mt-8">
            <button className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/[0.08] transition-colors">
              <User className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
            <button 
              onClick={() => navigate("/parametres")}
              className="w-12 h-12 flex items-center justify-center rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
            >
              <Settings className="w-5 h-5 text-gray-400 opacity-70" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 ml-32 min-h-screen">
        <div className="max-w-4xl mx-auto p-8 space-y-6">
          <h1 className="text-4xl font-bold text-white mb-8">Profil</h1>

          {/* Bloc 1 - En-tête profil */}
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{getInitials()}</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{fullName || "Utilisateur"}</h2>
                <p className="text-white/60 text-sm">Membre Prime</p>
              </div>
            </div>
          </div>

          {/* Bloc 2 - Informations personnelles */}
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <h2 className="text-2xl font-semibold text-white mb-6">Informations personnelles</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/70 mb-2 block">Nom complet</label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-white/[0.05] border-white/[0.1] text-white"
                  placeholder="Votre nom complet"
                />
              </div>
              <div>
                <label className="text-sm text-white/70 mb-2 block">Email</label>
                <Input
                  value={email}
                  disabled
                  className="bg-white/[0.02] border-white/[0.08] text-white/60 cursor-not-allowed"
                />
              </div>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl px-6 py-3 hover:bg-white/[0.04] hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] text-white font-medium"
              >
                {loading ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </div>

          {/* Bloc 3 - Sécurité */}
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <h2 className="text-2xl font-semibold text-white mb-6">Sécurité</h2>
            <p className="text-lg text-white/80 mb-4">Changer le mot de passe</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/70 mb-2 block">Ancien mot de passe</label>
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="bg-white/[0.05] border-white/[0.1] text-white"
                />
              </div>
              <div>
                <label className="text-sm text-white/70 mb-2 block">Nouveau mot de passe</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white/[0.05] border-white/[0.1] text-white"
                />
              </div>
              <div>
                <label className="text-sm text-white/70 mb-2 block">Confirmer le nouveau mot de passe</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white/[0.05] border-white/[0.1] text-white"
                />
              </div>
              <p className="text-xs text-white/40">
                Astuce : utilise un mot de passe long et unique.
              </p>
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl px-6 py-3 hover:bg-white/[0.04] hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] text-white font-medium"
              >
                {loading ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </button>
            </div>
          </div>

          {/* Bloc 4 - Photo de profil & Déconnexion */}
          <div className="grid grid-cols-2 gap-6">
            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <h2 className="text-xl font-semibold text-white mb-6">Photo de profil</h2>
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">{getInitials()}</span>
                </div>
                <button className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl px-4 py-2 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all cursor-pointer text-white text-sm flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Téléverser une image
                </button>
                <button className="text-white/40 hover:text-white/60 text-xs transition-colors">
                  Supprimer la photo
                </button>
              </div>
            </div>

            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] flex flex-col justify-center">
              <h2 className="text-xl font-semibold text-white mb-6">Déconnexion</h2>
              <button
                onClick={handleLogout}
                className="backdrop-blur-xl bg-red-500/[0.1] border border-red-500/[0.2] rounded-2xl px-6 py-3 hover:bg-red-500/[0.15] hover:border-red-500/[0.3] hover:-translate-y-0.5 transition-all cursor-pointer text-red-400 font-medium flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
