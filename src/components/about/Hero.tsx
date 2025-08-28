import Image from "next/image";
import aboutUsBg from "@/assets/images/about_bg.png";

const Hero: React.FC = () => {
  return (
    <header className="relative text-white text-center py-32">
      <div className="absolute inset-0 z-[-1]">
        <Image src={aboutUsBg} alt="About Us Background" fill />
      </div>

      <h1 className="text-5xl md:text-6xl font-bold mb-6">About Us</h1>
      <p className="text-xl md:text-2xl max-w-xl mx-auto">
        We are committed to helping you find the perfect property.
      </p>
    </header>
  );
};

export default Hero;
