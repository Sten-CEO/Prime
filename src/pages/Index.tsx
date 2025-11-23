import bgImage from "@/assets/black-shapes-bg.jpg";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Prime. text with blur and distortion effect */}
      <div className="relative z-10 select-none">
        <h1 className="font-inter font-black text-[clamp(8rem,20vw,18rem)] tracking-tighter text-dark-fg leading-none">
          <span className="inline-block relative">
            {/* Blurred and stretched P and r */}
            <span className="absolute inset-0 blur-[2px] opacity-70" style={{
              transform: 'scale(1.05, 1.08) translateX(-2%) translateY(2%)',
              transformOrigin: 'center left',
              clipPath: 'ellipse(45% 100% at 20% 60%)'
            }}>
              Pr
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
