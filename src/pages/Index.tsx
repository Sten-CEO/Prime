import bgImage from "@/assets/black-shapes-bg.jpg";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Prime. text */}
      <div className="relative z-10 select-none">
        <h1 className="font-inter font-black text-[clamp(8rem,20vw,18rem)] tracking-tighter text-white leading-none">
          Prime.
        </h1>
      </div>
    </div>
  );
};

export default Index;
