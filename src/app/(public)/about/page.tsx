import CTA from "@/components/about/CTA";
import Hero from "@/components/about/Hero";
import Mission from "@/components/about/Mission";
import Team from "@/components/about/Team";

const AboutPage: React.FC = () => {
  return (
    <div>
      <Hero />
      <Mission />
      <Team />

      <CTA />
    </div>
  );
};

export default AboutPage;
