"use client";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";

interface Feature {
  icon: React.ReactNode;
  label: string;
}

interface FeaturesAndFacilitiesProps {
  features: Feature[];
  facilities: string[];
}

const FeaturesAndFacilities: React.FC<FeaturesAndFacilitiesProps> = ({
  features,
  facilities,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-20  ">
      {/* Features Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 border-b-2 border-blue-500 pb-2">
          Features
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center justify-center text-center space-x-3 p-2 bg-white rounded-md shadow hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-white text-white rounded-full">
                {feature.icon}
              </div>
              <span className="text-gray-700 text-sm font-medium">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Facilities Section */}
      <div className="space-y-3">
        <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-green-500 pb-2">
          Facilities
        </h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {facilities.map((facility, index) => (
            <li
              key={index}
              className="flex items-center space-x-3 p-3 bg-white rounded-md shadow hover:bg-green-50 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-600 rounded-full">
                <FaCheckCircle size={14} />
              </div>
              <span className="text-gray-700 text-sm font-medium">
                {facility}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeaturesAndFacilities;
