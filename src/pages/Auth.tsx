import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().trim().email("Email invalide").max(255, "Email trop long"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").max(100, "Mot de passe trop long"),
  fullName: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(100, "Nom trop long").optional(),
});

const Auth = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/accueil");
      }
    };
    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && event === "SIGNED_IN") {
        navigate("/accueil");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate inputs
      const validationData = isSignUp 
        ? { email, password, fullName }
        : { email, password };
      
      authSchema.parse(validationData);

      if (isSignUp) {
        // Sign up
        const redirectUrl = `${window.location.origin}/accueil`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              full_name: fullName,
            }
          }
        });

        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Compte existant",
              description: "Ce compte existe déjà. Essayez de vous connecter.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else {
          toast({
            title: "Inscription réussie",
            description: "Vérifiez votre email pour confirmer votre compte (ou connectez-vous directement si la confirmation est désactivée).",
          });
          // Switch to login after successful signup
          setIsSignUp(false);
          setPassword("");
        }
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid")) {
            toast({
              title: "Identifiants incorrects",
              description: "Email ou mot de passe incorrect.",
              variant: "destructive",
            });
          } else {
            throw error;
          }
        } else {
          toast({
            title: "Connexion réussie",
            description: "Bienvenue sur Prime.",
          });
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.issues[0];
        toast({
          title: "Erreur de validation",
          description: firstError.message,
          variant: "destructive",
        });
      } else {
        console.error("Auth error:", error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/src/assets/black-shapes-bg.jpg')" }}
      />

      {/* Logo */}
      <div className="absolute top-8 left-8 z-10">
        <span className="text-white font-bold text-2xl tracking-tight">Prime.</span>
      </div>

      {/* Auth Form */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="backdrop-blur-2xl bg-white/[0.03] border border-white/[0.08] rounded-3xl p-10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            {isSignUp ? "Créer un compte" : "Connexion"}
          </h1>
          <p className="text-white/60 text-center mb-8">
            {isSignUp ? "Rejoignez Prime" : "Bienvenue sur Prime"}
          </p>

          <form onSubmit={handleAuth} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="text-sm text-white/70 mb-2 block">Nom complet</label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/40"
                  placeholder="Votre nom"
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label className="text-sm text-white/70 mb-2 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/40"
                placeholder="votre@email.com"
                required
              />
            </div>

            <div>
              <label className="text-sm text-white/70 mb-2 block">Mot de passe</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/[0.05] border-white/[0.1] text-white placeholder:text-white/40"
                placeholder="••••••••"
                required
              />
              {isSignUp && (
                <p className="text-xs text-white/40 mt-2">Minimum 6 caractères</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full backdrop-blur-xl bg-white/[0.08] border border-white/[0.15] rounded-2xl px-6 py-3 hover:bg-white/[0.12] hover:border-white/[0.2] hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] transition-all cursor-pointer shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] text-white font-semibold"
            >
              {loading ? "Chargement..." : (isSignUp ? "S'inscrire" : "Se connecter")}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-white/60 hover:text-white text-sm transition-colors"
            >
              {isSignUp 
                ? "Déjà un compte ? Se connecter" 
                : "Pas de compte ? S'inscrire"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
