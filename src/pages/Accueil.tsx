import bgImage from "@/assets/black-shapes-bg.jpg";

const Accueil = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Page d'accueil */}
      </div>
    </div>
  );
};

export default Accueil;
