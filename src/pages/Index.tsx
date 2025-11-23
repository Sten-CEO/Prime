import bgImage from "@/assets/black-shapes-bg.jpg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleLogin = () => {
    setIsExiting(true);
    setTimeout(() => {
      navigate("/accueil");
    }, 1000);
  };
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Prime. text */}
      <div className="absolute z-10 select-none">
        <h1 className="font-inter font-black text-[clamp(8rem,20vw,18rem)] tracking-tighter text-white leading-none">
          Prime.
        </h1>
      </div>

      {/* Glassmorphism Login Card */}
      <div className={`relative z-20 w-full max-w-sm mx-4 transition-all duration-700 ease-in-out ${
        isExiting ? '-translate-y-[150vh] opacity-0' : 'translate-y-0 opacity-100'
      }`}>
        <div 
          className="relative rounded-3xl p-10 border border-white/20"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <h2 className="text-2xl font-semibold text-white mb-10">Connectez-vous à Prime.</h2>
          
          <div className="space-y-8">
            {/* Email Field */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-white/80 text-sm uppercase tracking-wider font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="natalia@email.com"
                className="h-12 rounded-xl border-white/30 text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/50"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <Label htmlFor="password" className="text-white/80 text-sm uppercase tracking-wider font-medium">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••••"
                className="h-12 rounded-xl border-white/30 text-white placeholder:text-white/50 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-white/50"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              />
            </div>

            {/* Login Button */}
            <Button 
              onClick={handleLogin}
              className="w-full h-12 rounded-xl mt-10 text-white font-medium active:scale-[0.98] transition-transform"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              Connexion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
