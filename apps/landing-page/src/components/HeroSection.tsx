"use client";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-black">
      {/* Giant Title */}
      <div className="relative z-10 w-full max-w-7xl px-4 pointer-events-none select-none">
        <h1 className="huge-title text-[14vw] lg:text-[200px] text-center leading-none text-white tracking-tighter font-black">
          JOIN<br />
          TAKATHON
        </h1>
      </div>

      {/* Floating Elements */}
      {/* Yellow coin - top left */}
      <div className="absolute top-[20%] left-[10%] floating-delayed z-20">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-4 border-yellow-300 shadow-[0_0_30px_rgba(234,179,8,0.4)] flex items-center justify-center">
          <svg className="w-10 h-10 text-yellow-100" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15 9H9v6h6V9zm-2 4h-2v-2h2v2zm8-2V9h-2V7c0-1.1-.9-2-2-2h-2V3h-2v2h-2V3H9v2H7c-1.1 0-2 .9-2 2v2H3v2h2v2H3v2h2v2c0 1.1.9 2 2 2h2v2h2v-2h2v2h2v-2h2c1.1 0 2-.9 2-2v-2h2v-2h-2v-2h2zm-4 6H7V7h10v10z" />
          </svg>
        </div>
      </div>

      {/* Yellow coin - bottom right */}
      <div className="absolute bottom-[15%] right-[10%] floating z-20">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 border-4 border-yellow-300 shadow-[0_0_20px_rgba(234,179,8,0.3)] flex items-center justify-center">
          <svg className="w-8 h-8 text-yellow-100" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H11.5v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.65c.09 1.71 1.37 2.66 2.85 2.97V19h1.73v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.65-3.42z" />
          </svg>
        </div>
      </div>

      {/* Orange diamond - top right */}
      <div className="absolute top-[30%] right-[15%] floating-fast z-20">
        <div className="w-12 h-12 bg-primary/20 backdrop-blur-md border border-primary/50 rotate-45 flex items-center justify-center shadow-[0_0_20px_rgba(255,92,0,0.5)]">
          <div className="w-6 h-6 bg-primary"></div>
        </div>
      </div>

      {/* Code icon - bottom left */}
      <div className="absolute bottom-[30%] left-[12%] floating z-20 opacity-70">
        <div className="w-10 h-10 bg-blue-500/20 backdrop-blur-md border border-blue-400/50 rotate-[15deg] flex items-center justify-center">
          <svg className="w-5 h-5 text-blue-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
          </svg>
        </div>
      </div>

      {/* Laptop card - top right (desktop only) */}
      <div className="absolute top-[15%] right-[25%] floating-delayed z-20 hidden lg:block">
        <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 shadow-2xl rotate-12">
          <svg className="w-9 h-9 text-zinc-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z" />
          </svg>
        </div>
      </div>

      {/* Bottom Mascot Area */}
      <div className="absolute bottom-[-50px] left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl">
        <div className="relative w-full aspect-square flex items-end justify-center">
          <div className="relative w-96 h-96 md:w-[500px] md:h-[500px] floating">
            <div className="absolute inset-0 bg-primary blur-[120px] opacity-30 rounded-full"></div>
            <div className="relative z-20 w-full h-full">
              <img
                src="/mascot.png"
                alt="Takathon Mascot"
                className="w-full h-full object-contain drop-shadow-[0_20px_60px_rgba(255,92,0,0.6)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient blur */}
      <div className="gradient-blur"></div>
    </section>
  );
}
