import Image from "next/image";
import demo from "@/assets/images/female.jpg";

const Team: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50 text-center">
      {/* Section Title */}
      <h2 className="text-4xl font-semibold text-[#FF4C5A] mb-12">
        Meet Our Team
      </h2>

      {/* Team Members */}
      <div className="flex flex-wrap justify-center gap-12">
        {/* Team Member 1 */}
        <div className="team-member max-w-xs bg-white rounded-lg shadow-xl p-6 transition-transform transform hover:scale-105">
          <Image
            src={demo}
            alt="John Doe, CEO"
            className="w-48 h-48 object-cover rounded-full mx-auto mb-4 border-4 border-[#FF4C5A]"
          />
          <h3 className="text-xl font-semibold text-[#FF4C5A] mb-2">
            John Doe
          </h3>
          <p className="text-md text-gray-600 mb-4">CEO & Founder</p>
          <p className="text-gray-700">
            John has over 20 years of experience in real estate.
          </p>
        </div>

        {/* Team Member 2 */}
        <div className="team-member max-w-xs bg-white rounded-lg shadow-xl p-6 transition-transform transform hover:scale-105">
          <Image
            src={demo}
            alt="Jane Smith, Lead Agent"
            className="w-48 h-48 object-cover rounded-full mx-auto mb-4 border-4 border-[#FF4C5A]"
          />
          <h3 className="text-xl font-semibold text-[#FF4C5A] mb-2">
            Jane Smith
          </h3>
          <p className="text-md text-gray-600 mb-4">Lead Agent</p>
          <p className="text-gray-700">
            Jane is an expert negotiator with a passion for helping clients.
          </p>
        </div>

        {/* Add more team members here */}
      </div>
    </section>
  );
};

export default Team;
