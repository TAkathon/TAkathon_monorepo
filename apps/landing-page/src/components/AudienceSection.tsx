"use client";

const personas = [
    {
        number: "01",
        title: "STUDENTS",
        subtitle: "Build portfolio & win prizes",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCdDkzqESJSr11_vomiN8MLbt3Py07zDe8gldaww_uJp7Trw_j2ql_KBELRpsTeCCZCRVvMOfZoQFbVd-GpdxxqnHC6buM3o0ErCOVlfOQoqW_93GrHYvK3V30E-O6e7n1t3m0cTJtDCCShjrKCf5fg0W2kOlSMjzNi9pXdBytpN-tsZb0I3ztxG7E_oz_pJ-o4tQEic1xZD8dQj2uRug4_jtHSCRzNn-HrdOQy0ro2GwRPTPAd7zbLk9UWLyU4WCILnU3kHawdTXg",
        watermarkIcon: (
            <svg className="w-36 h-36 text-white/10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z" />
            </svg>
        ),
        floatClass: "floating-delayed",
    },
    {
        number: "02",
        title: "ORGANIZERS",
        subtitle: "Manage events seamlessly",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0dPT4c0F_jgrCk0ESqzGMgRdBqWhTXxadQ65HVTDmd1zzS4mIWU-0xiBrP48aEHmT4Jv3-IIw6XkDeGrNa-RvmIeMM8GBxaRDOMv-ZVMhr-Kmm05yjr48TsB-fxOdM6Zdt0Cob3cMZohwS7ImLfMsd_sdoTP5_LONgViYXxGk0H51IWGGd5wS6kllWzsTZLd3ry0s8LDKH7fUNf6xBELXnUXskgm4f_2zi7QJe57GCqBJgRD1JigK4nNjDoe6MgR2DM1A78jkAkE",
        watermarkIcon: (
            <svg className="w-36 h-36 text-primary/20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.53 11.06L12.58 7.11l1.41-1.41 2.54 2.53 5.54-5.53 1.41 1.41-6.95 6.95zM19 19H5V8h7.11l2-2H5c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6.97l-2 2V19z" />
            </svg>
        ),
        floatClass: "floating",
    },
    {
        number: "03",
        title: "SPONSORS",
        subtitle: "Access top tech talent",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDofH7LYXEvRdDP4-juh12WHT-_htvgMPxRU4nQQFqarcpStad_1xPYwDQEdbkPLDv0jDVEkQbdhOrN5OUwkXvyuWAg7Fn1nV-wTE35DfgM1GHszi14qQeYTxXhfwzvWI0jhmNcfuItsIapo2zWu4CjY9KxHwQPwv2WIIgPwc1ggpDyR45ovJpwiI-DDVlV3kzgF5zD7NNV5u4MdxAXCgo8s87nYfRG69Qvtq0PhImWF0jRY25maNRvea045v300BvfzwpH4XV5QrY",
        watermarkIcon: (
            <svg className="w-36 h-36 text-yellow-500/10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
            </svg>
        ),
        floatClass: "floating-fast",
    },
];

export default function AudienceSection() {
    return (
        <section id="audience" className="py-32 bg-black relative">
            <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
                <h2 className="huge-title text-5xl md:text-8xl text-center mb-24 tracking-tighter text-white">
                    WHO IS TAKATHON BUILT FOR?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    {personas.map((persona) => (
                        <div
                            key={persona.number}
                            className="relative aspect-[3/4.5] rounded-[4px] overflow-hidden group cursor-pointer border border-white/10 bg-zinc-900 shadow-2xl hover:border-primary/50 transition-colors"
                        >
                            {/* Background Image */}
                            <img
                                alt={persona.title}
                                className="absolute inset-0 w-full h-full object-cover blur-[1px] group-hover:blur-0 transition-all duration-700 brightness-50"
                                src={persona.image}
                            />

                            {/* Overlay */}
                            <div className="absolute inset-0 persona-card-overlay"></div>

                            {/* Content */}
                            <div className="absolute inset-0 p-10 flex flex-col justify-between">
                                <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-white">
                                    <span className="w-2 h-2 bg-primary"></span> {persona.number}
                                </div>
                                <div>
                                    <div className="huge-title text-5xl lg:text-6xl leading-none mb-2">
                                        {persona.title}
                                    </div>
                                    <p className="text-xs font-bold tracking-widest text-zinc-300 uppercase">
                                        {persona.subtitle}
                                    </p>
                                </div>
                            </div>

                            {/* Floating Watermark Icon */}
                            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${persona.floatClass} pointer-events-none`}>
                                {persona.watermarkIcon}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
