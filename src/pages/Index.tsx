import bgImage from "@/assets/black-shapes-bg.jpg";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Prime. text with blur effect */}
      <div className="relative z-10 select-none">
        <h1 className="font-inter font-black text-[clamp(8rem,20vw,18rem)] tracking-tighter text-white leading-none">
          <span className="inline-block relative">
            {/* Blurred P extending to the left */}
            <span className="absolute inset-0 blur-[8px] opacity-60" style={{
              clipPath: 'polygon(0% 0%, 35% 0%, 35% 100%, 0% 100%)',
              transform: 'translateX(-15%)'
            }}>
              Prime.
            </span>
            
            {/* Fade out effect at bottom of P */}
            <span className="absolute inset-0 opacity-40" style={{
              clipPath: 'polygon(0% 75%, 15% 75%, 15% 100%, 0% 100%)',
              filter: 'blur(4px)',
              background: 'linear-gradient(to bottom, white, transparent)'
            }}>
              Prime.
            </span>
            
            {/* Normal text */}
            <span className="relative">
              Prime.
            </span>
          </span>
        </h1>
      </div>
    </div>
  );
};

export default Index;
