import bgImage from "@/assets/black-shapes-bg.jpg";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Prime. text with blur dissolve effect */}
      <div className="relative z-10 select-none">
        <h1 className="font-inter font-black text-[clamp(8rem,20vw,18rem)] tracking-tighter text-white leading-none">
          <span className="inline-block relative">
            {/* Heavy blur layer - far left */}
            <span 
              className="absolute inset-0 blur-[35px] opacity-30"
              style={{
                clipPath: 'inset(0 88% 0 0)'
              }}
            >
              Prime.
            </span>
            
            {/* Medium blur layer */}
            <span 
              className="absolute inset-0 blur-[20px] opacity-40"
              style={{
                clipPath: 'inset(0 85% 0 0)'
              }}
            >
              Prime.
            </span>
            
            {/* Light blur layer - closest to sharp text */}
            <span 
              className="absolute inset-0 blur-[10px] opacity-50"
              style={{
                clipPath: 'inset(0 82% 0 0)'
              }}
            >
              Prime.
            </span>
            
            {/* Bottom fade effect on P */}
            <span 
              className="absolute inset-0 blur-[5px] opacity-20"
              style={{
                clipPath: 'inset(75% 88% 0 0)',
                maskImage: 'linear-gradient(to bottom, white, transparent)',
                WebkitMaskImage: 'linear-gradient(to bottom, white, transparent)'
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
