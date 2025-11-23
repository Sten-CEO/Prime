import bgImage from "@/assets/black-shapes-bg.jpg";

const Index = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImage})` }}
      />

      {/* Prime. text with diagonal blur effect */}
      <div className="relative z-10 select-none">
        <h1 className="font-inter font-black text-[clamp(8rem,20vw,18rem)] tracking-tighter text-white leading-none">
          <span className="inline-block relative">
            {/* Diagonal blur effect on left side of P - strong blur bottom-left */}
            <span 
              className="absolute top-0 left-0 w-full h-full blur-[30px] opacity-40"
              style={{
                clipPath: 'polygon(0% 30%, 12% 0%, 12% 100%, 0% 100%)',
                transform: 'translate(-3%, 1%)'
              }}
            >
              Prime.
            </span>
            
            {/* Medium blur layer for gradient transition */}
            <span 
              className="absolute top-0 left-0 w-full h-full blur-[15px] opacity-35"
              style={{
                clipPath: 'polygon(0% 20%, 15% 0%, 15% 100%, 0% 100%)',
                transform: 'translate(-1.5%, 0.5%)'
              }}
            >
              Prime.
            </span>
            
            {/* Light blur for smooth transition */}
            <span 
              className="absolute top-0 left-0 w-full h-full blur-[8px] opacity-25"
              style={{
                clipPath: 'polygon(0% 10%, 17% 0%, 17% 100%, 0% 100%)',
                transform: 'translate(-0.5%, 0.2%)'
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
