import bgImage from "@/assets/black-shapes-bg.jpg";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Prime. text with blur effect like reference */}
      <div className="relative z-10 select-none">
        <h1 className="font-inter font-black text-[clamp(8rem,20vw,18rem)] tracking-tighter text-white leading-none">
          <span className="inline-block relative">
            {/* Heavy blur extending left from P */}
            <span 
              className="absolute top-0 left-0 w-full h-full blur-[25px] opacity-50"
              style={{
                clipPath: 'inset(0 85% 0 0)',
                transform: 'translateX(-8%)'
              }}
            >
              Prime.
            </span>
            
            {/* Fade/erase effect at bottom of P */}
            <span 
              className="absolute top-0 left-0 w-full h-full"
              style={{
                clipPath: 'inset(70% 92% 0 0)',
                maskImage: 'linear-gradient(to bottom, white 0%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, white 0%, transparent 100%)',
                opacity: 0.3
              }}
            >
              Prime.
            </span>
            
            {/* Normal sharp text */}
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
