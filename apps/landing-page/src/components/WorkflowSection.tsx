"use client";

const steps = [
  { number: "01", title: "Create your\nprofile", subtitle: "Start your journey", rotate: "md:-rotate-6" },
  { number: "02", title: "Join a\nhackathon", subtitle: "Browse active events", rotate: "md:rotate-3 md:mt-24" },
  { number: "03", title: "Build your\nteam", subtitle: "Find perfect allies", rotate: "md:-rotate-3 md:mb-16" },
  { number: "04", title: "Win great\nprizes", subtitle: "Level up your career", rotate: "md:rotate-6 md:mt-8" },
];

export default function WorkflowSection() {
  return (
    <section id="workflow" className="bg-[#080808] py-32 relative overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-24">
          <div className="flex items-center justify-center gap-2 text-[10px] font-black tracking-[0.3em] text-primary mb-6">
            <span className="w-2 h-2 bg-primary"></span> ROADMAP
          </div>
          <h2 className="huge-title text-4xl md:text-6xl text-white leading-[0.9]">
            HOW IT WORKS?
          </h2>
        </div>

        {/* Cards + SVG Path */}
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 md:gap-4 md:h-[400px]">
          {/* SVG Scribble Path (desktop only) */}
          <svg
            className="absolute top-[20%] left-0 w-full h-full z-0 hidden md:block pointer-events-none overflow-visible"
            width="100%"
            height="100%"
          >
            <path
              className="scribble-path"
              d="M 100,80 Q 250,20 350,100 T 600,80 T 850,120 T 1100,50"
              fill="none"
              stroke="#FF5C00"
              strokeLinecap="round"
              strokeWidth="4"
            />
          </svg>

          {steps.map((step) => (
            <div
              key={step.number}
              className={`relative z-10 group w-full max-w-[240px] ${step.rotate} hover:rotate-0 transition-transform duration-300`}
            >
              <div className="roadmap-card p-6 flex flex-col items-center text-center rounded-sm">
                <div className="w-16 h-16 mb-4 bg-black rounded-full flex items-center justify-center border-2 border-primary shadow-[4px_4px_0_#FF5C00]">
                  <span className="huge-title text-2xl text-white">{step.number}</span>
                </div>
                <h3 className="font-archivo text-xl text-white mb-4 uppercase leading-tight bg-black inline-block px-2 -skew-x-6 whitespace-pre-line">
                  {step.title}
                </h3>
                <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                  {step.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
