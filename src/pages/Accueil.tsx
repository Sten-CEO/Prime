import bgImage from "@/assets/black-shapes-bg.jpg";
import { Sidebar } from "@/components/Sidebar";

const Accueil = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Content */}
      <div className="relative z-10 ml-32">
        {/* Page d'accueil */}
      </div>
    </div>
  );
};

export default Accueil;
