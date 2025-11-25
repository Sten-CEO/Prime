import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Home, Award, BookOpen, Target, User, Settings, Upload, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Profil = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
        title: t.profileUpdated,
        description: t.profileUpdateSuccess,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t.error,
        description: t.updateError,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: t.error,
        description: t.passwordMismatch,
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: t.error,
        description: t.passwordTooShort,
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
        title: t.passwordUpdated,
        description: t.passwordUpdateSuccess,
      });

      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error changing password:", error);
      toast({
        title: t.error,
        description: t.passwordUpdateError,
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

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // TODO: Implémenter l'upload vers Supabase Storage
      toast({
        title: "En cours de développement",
        description: "La fonctionnalité d'upload de photo sera bientôt disponible",
      });
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        title: t.error,
        description: "Impossible de téléverser la photo",
        variant: "destructive",
      });
    }
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
        <div className="max-w-5xl mx-auto p-8 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white">{t.profileTitle}</h1>
            <button
              onClick={handleLogout}
              className="backdrop-blur-xl bg-red-500/[0.08] border border-red-500/[0.15] rounded-xl px-4 py-2 hover:bg-red-500/[0.12] hover:border-red-500/[0.25] transition-all cursor-pointer text-red-400 text-sm font-medium flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {t.logout}
            </button>
          </div>

          {/* Bloc 1 - Photo + Infos personnelles côte à côte */}
          <div className="grid grid-cols-5 gap-6">
            {/* Photo de profil */}
            <div className="col-span-2 backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <h2 className="text-xl font-semibold text-white mb-6">{t.profilePhoto}</h2>
              <div className="flex flex-col items-center gap-4">
                <div 
                  onClick={handlePhotoClick}
                  className="w-32 h-32 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center cursor-pointer hover:border-primary/50 transition-all group"
                >
                  <span className="text-4xl font-bold text-white group-hover:scale-110 transition-transform">{getInitials()}</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <p className="text-white/60 text-sm text-center">{t.memberPrime}</p>
                <button 
                  onClick={handlePhotoClick}
                  className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl px-4 py-2 hover:bg-white/[0.04] hover:border-white/[0.12] transition-all cursor-pointer text-white text-sm flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {t.uploadImage}
                </button>
              </div>
            </div>

            {/* Infos personnelles */}
            <div className="col-span-3 backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
              <h2 className="text-2xl font-semibold text-white mb-6">{t.personalInfo}</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-white/70 mb-2 block">{t.fullName}</label>
                  <Input
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-white/[0.05] border-white/[0.1] text-white"
                    placeholder={t.fullName}
                  />
                </div>
                <div>
                  <label className="text-sm text-white/70 mb-2 block">{t.email}</label>
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
                  {loading ? t.saving : t.saveChanges}
                </button>
              </div>
            </div>
          </div>

          {/* Bloc 2 - Sécurité */}
          <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-3xl p-8 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
            <h2 className="text-2xl font-semibold text-white mb-6">{t.security}</h2>
            <p className="text-lg text-white/80 mb-4">{t.changePassword}</p>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-white/70 mb-2 block">{t.oldPassword}</label>
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="bg-white/[0.05] border-white/[0.1] text-white"
                />
              </div>
              <div>
                <label className="text-sm text-white/70 mb-2 block">{t.newPassword}</label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-white/[0.05] border-white/[0.1] text-white"
                />
              </div>
              <div>
                <label className="text-sm text-white/70 mb-2 block">{t.confirmPassword}</label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-white/[0.05] border-white/[0.1] text-white"
                />
              </div>
              <p className="text-xs text-white/40">
                {t.passwordHint}
              </p>
              <button
                onClick={handleChangePassword}
                disabled={loading}
                className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.08] rounded-2xl px-6 py-3 hover:bg-white/[0.04] hover:border-white/[0.12] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)] text-white font-medium"
              >
                {loading ? t.updating : t.updatePassword}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
