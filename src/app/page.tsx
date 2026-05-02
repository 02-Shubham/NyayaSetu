import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { FeatureSection } from "@/components/FeatureSection";
import { HowItWorksSection } from "@/components/HowItWorksSection";
import { WhyBestSection } from "@/components/WhyBestSection";
import { ProblemSolvingSection } from "@/components/ProblemSolvingSection";
import { VerifyBot } from "@/components/VerifyBot";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center overflow-hidden">

      <Navbar />

      <div className="w-full max-w-[1400px] mx-auto px-0 md:px-6 pt-20 pb-20 flex flex-col gap-24 md:gap-40 relative z-10">
        <HeroSection />
        <WhyBestSection />
        <HowItWorksSection />
        <ProblemSolvingSection />
        <FeatureSection />
      </div>

      <VerifyBot />
    </main>
  );
}
