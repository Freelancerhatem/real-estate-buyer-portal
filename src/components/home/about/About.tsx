"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import about from "@/assets/images/about.png";

const About: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-12 px-6 sm:px-12 lg:px-20 py-16 lg:py-24">
      {/* Left Side - Image */}
      <div className="w-full lg:w-1/2 flex justify-center">
        <Image
          src={about}
          alt="About Us"
          width={600}
          height={400}
          className="rounded-lg max-w-full h-auto"
          priority
        />
      </div>

      {/* Right Side - About Us Content */}
      <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
          About Us
        </h2>
        <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
          We are a team of real estate professionals dedicated to helping you
          find the perfect property. Whether you are looking to buy, sell, or
          rent, we offer tailored solutions and expert guidance to make your
          experience seamless and stress-free.
        </p>
        <div>
          <Link href="/about-us">
            <button className="bg-primary text-white py-3 px-6 rounded-lg hover:bg-hover transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Learn More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
