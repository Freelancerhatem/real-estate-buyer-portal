"use client";
import Image from "next/image";
import { FaCogs, FaUsers, FaLightbulb } from "react-icons/fa";
import ourService from "@/assets/images/our_service.png";

const Ours: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 items-center justify-between gap-10 pt-20 px-4 lg:px-20">
      {/* Left Side - Simple & Clean Content */}
      <div className="space-y-6">
        {/* Title and Description */}
        <div>
          <h2 className="text-4xl font-bold text-gray-900">Our Services</h2>
          <p className="text-lg text-gray-700 mt-4 leading-relaxed">
            We offer seamless real estate solutions, expert consultation, and
            innovative property management tailored to your needs.
          </p>
        </div>

        {/* Service Items */}
        <div className="space-y-2 mt-8">
          <ServiceItem
            icon={<FaCogs className="text-primary text-3xl" />}
            title="Property Management"
            description="Manage your properties effortlessly with our all-in-one solutions."
          />

          <ServiceItem
            icon={<FaUsers className="text-primary text-3xl" />}
            title="Expert Consultation"
            description="Receive personalized guidance from industry experts."
          />

          <ServiceItem
            icon={<FaLightbulb className="text-primary text-3xl" />}
            title="Innovative Solutions"
            description="Leverage cutting-edge technology for smarter real estate decisions."
          />
        </div>
      </div>

      {/* Right Side - Clean Image Layout */}
      <div className="relative flex justify-center">
        <Image
          src={ourService}
          alt="Our Services"
          width={600}
          height={400}
          className="rounded-lg w-[80%]"
        />
      </div>
    </div>
  );
};

const ServiceItem = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="flex items-center space-x-4  py-4 rounded-lg  transition-all duration-300 ">
      <div className="w-14 h-14 flex items-center justify-center rounded-full bg-white border border-gray-300">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default Ours;
