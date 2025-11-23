import bgImage from "@/assets/black-shapes-bg.jpg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Index = () => {
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
      <div className="relative z-20 w-full max-w-md mx-4">
        <div 
          className="relative rounded-3xl p-8 border border-white/20"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <h2 className="text-2xl font-semibold text-white mb-8">Bienvenu</h2>
          
          <div className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/70 text-sm uppercase tracking-wider">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="natalia@email.com"
                className="h-12 rounded-xl border-white/20 text-white placeholder:text-white/40"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/70 text-sm uppercase tracking-wider">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••••••••"
                className="h-12 rounded-xl border-white/20 text-white placeholder:text-white/40"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              />
            </div>

            {/* Login Button */}
            <Button 
              className="w-full h-12 rounded-xl mt-8 text-white font-medium"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              Connectez-vous
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
