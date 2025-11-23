import { useState } from "react";
import bgImage from "@/assets/black-shapes-bg.jpg";
import { Sidebar } from "@/components/Sidebar";
import { Camera, LogOut } from "lucide-react";

const Profil = () => {
  const [profile, setProfile] = useState({
    name: "Utilisateur Prime",
    email: "user@prime.app",
    avatar: "",
  });

  const handleLogout = () => {
    console.log("Déconnexion");
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      <Sidebar />

      <div className="relative z-10 ml-20 px-20 py-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Profil</h1>
            <p className="text-white/60">Gérez vos informations personnelles</p>
          </div>

          {/* Profile Card */}
          <div className="backdrop-blur-xl bg-white/10 rounded-3xl border border-white/20 p-8 shadow-2xl">
            {/* Avatar */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full backdrop-blur-md bg-white/10 border border-white/20 flex items-center justify-center">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt="Avatar"
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-white font-bold">
                      {profile.name.charAt(0)}
                    </span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full backdrop-blur-md bg-accent-blue/80 hover:bg-accent-blue border border-white/20 flex items-center justify-center transition-colors">
                  <Camera className="w-5 h-5 text-white" />
                </button>
              </div>
              <p className="text-white/60 text-sm mt-4">Prime - version demo</p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-white/80 text-sm mb-2">Nom</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm mb-2">Mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white placeholder:text-white/40 focus:outline-none focus:border-white/20 transition-colors"
                />
              </div>

              <button className="w-full backdrop-blur-md bg-accent-blue/80 hover:bg-accent-blue rounded-xl py-3 text-white font-medium transition-colors">
                Enregistrer les modifications
              </button>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full backdrop-blur-xl bg-white/10 hover:bg-accent-red/20 border border-white/20 rounded-3xl p-6 shadow-2xl transition-all flex items-center justify-center gap-3 group"
          >
            <LogOut className="w-5 h-5 text-white/60 group-hover:text-accent-red transition-colors" />
            <span className="text-white/80 group-hover:text-white font-medium transition-colors">
              Se déconnecter
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profil;
