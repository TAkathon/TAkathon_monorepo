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
        <main className="relative">
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
