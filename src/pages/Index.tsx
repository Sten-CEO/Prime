import bgImage from "@/assets/black-shapes-bg.jpg";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Prime. text with blur trail effect */}
      <div className="relative z-10 select-none">
        <h1 className="font-inter font-black text-[clamp(8rem,20vw,18rem)] tracking-tighter text-white leading-none">
          <span className="inline-block relative">
            {/* Blurred trail extending left from P */}
            <span 
              className="absolute top-0 left-0 w-full h-full blur-[20px]"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, white 15%, transparent 15%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, white 15%, transparent 15%)',
                transform: 'translateX(-10%)'
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
