const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-dark-bg texture-overlay flex items-center justify-center">
      {/* Subtle gray reflections */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[30%] w-[400px] h-[300px] bg-gray-reflection/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[30%] left-[25%] w-[350px] h-[250px] bg-gray-reflection/8 rounded-full blur-[100px]" />
      </div>

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
