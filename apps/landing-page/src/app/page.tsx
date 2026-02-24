import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import AudienceSection from "@/components/AudienceSection";
import WorkflowSection from "@/components/WorkflowSection";
import CTASection from "@/components/CTASection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
    return (
        <main className="relative bg-black font-display text-white selection:bg-primary selection:text-white overflow-x-hidden">
            <div className="digital-dust"></div>
            <Navbar />
            <HeroSection />
            <ProblemSection />
            <AudienceSection />
            <WorkflowSection />
            <CTASection />
            <ContactSection />
            <Footer />
        </main>
    );
}
