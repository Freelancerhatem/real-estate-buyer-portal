"use client";

import { listing } from "@/types/listing";
import Image from "next/image";
import Link from "next/link";
import {
  FaBed,
  FaBath,
  FaArrowsAltH,
  FaMapMarkerAlt,
  FaHeart,
} from "react-icons/fa";

interface RealEstateCardProps {
  listing: listing;
  badge?: string;
  timeAgo?: string;
}

const ListingCard: React.FC<RealEstateCardProps> = ({ listing, badge }) => {
  const {
    _id: propertyId,
    thumbnail,
    title,
    location,
    totalBedrooms,
    totalBathrooms,
    totalArea,
    price,
  } = listing;

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden max-w-full">
        {/* Image Section */}
        <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover w-full h-full"
            />
          ) : null}

          {badge && (
            <span className="absolute top-2 left-2 bg-secondary text-white text-xs sm:text-sm px-3 py-1 rounded-full font-semibold shadow-md">
              {badge}
            </span>
          )}
          <button
            className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md focus:outline-none"
            aria-label="Toggle Favorite"
          >
            <FaHeart
              className={`text-lg sm:text-xl
                
              `}
            />
          </button>
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">
            {title}
          </h2>

          {/* Location */}
          <div className="flex items-center text-sm text-gray-600 space-x-2">
            <FaMapMarkerAlt className="text-sm" />
            <span>{location?.country}</span>
          </div>

          {/* Features */}
          <div className="flex justify-between text-xs sm:text-sm text-gray-700 pt-2">
            <div className="flex items-center space-x-1">
              <FaBed />
              <span>{totalBedrooms} Beds</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaBath />
              <span>{totalBathrooms} Baths</span>
            </div>
            <div className="flex items-center space-x-1">
              <FaArrowsAltH />
              <span>{totalArea} sqft</span>
            </div>
          </div>

          {/* Price & Button */}
          <div className="flex justify-between items-center pt-2">
            <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
              ${price.toLocaleString()}
            </span>
            <Link href={`listings/property/${propertyId}`} passHref>
              <button className="bg-primary text-white text-xs sm:text-sm md:text-base px-3 py-1.5 md:px-4 md:py-2 rounded-md hover:bg-hover focus:outline-none focus:ring-2 focus:ring-hover">
                View Details
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ListingCard;
