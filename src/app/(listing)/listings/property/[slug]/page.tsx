"use client";

import Image from "next/image";
import Link from "next/link";
import ImageSlider from "@/components/listings/property/Imageslider";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";
import { useEffect, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";

// react-icons
import { BiSolidCheckbox } from "react-icons/bi";
import { BsCurrencyDollar } from "react-icons/bs";
import { CiBookmark } from "react-icons/ci";
import { FaChartArea } from "react-icons/fa6";
import { TiLocation } from "react-icons/ti";
import {
  FaBed,
  FaCar,
  FaBath,
  FaFire,
  FaTv,
  FaSpa,
  FaAngleDoubleDown,
} from "react-icons/fa";
import { MdOutlineLocalHospital, MdOutlineKitchen } from "react-icons/md";
import { BsBuilding } from "react-icons/bs";
import { FiLayers } from "react-icons/fi";

// hooks
import usePropertyById from "@/hooks/usePropertyById";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import { useFavorite } from "@/hooks/useFavorite";

// components
import ContactAndTour from "@/components/listings/property/ContactAndTour";
import FeaturesAndFacilities from "@/components/listings/property/FeaturesAndFacilities";
import LoadingSpinner from "@/components/loading/Loading";
import Tabs from "@/components/listings/property/Tabs";
import ContactOwner from "@/components/listings/property/ContactOwner";
import ShareComponent from "@/components/listings/property/Share";
import Card from "@/components/listings/Card";
import useRecentlyViewed from "@/hooks/useRecentlyViewed";

const Details = () => {
  const { slug } = useParams();
  const propertyId = Array.isArray(slug) ? slug[0] : slug;

  const { property, loading, similarProperties } = usePropertyById(propertyId);
  const ownerInforMation = property?.owner;

  // auth → derive userId for favorites (fallback to null if signed out)
  const { user, loading: authLoading } = useUnifiedAuth();
  const userId = useMemo(() => user?._id ?? user?.id ?? null, [user]);

  // favorites hook (per-card init on mount)
  const {
    isFavorite,
    loading: favLoading,
    toggle,
  } = useFavorite({
    propertyId,
    userId, // remove if your backend uses only cookies
    initOnMount: true,
  });

  const hasSaved = useRef(false);
  const { saveRecentlyViewedProperty } = useRecentlyViewed();

  useEffect(() => {
    if (property && !hasSaved.current) {
      saveRecentlyViewedProperty(property);
      hasSaved.current = true;
    }
  }, [property, saveRecentlyViewedProperty]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // click handler for the bookmark
  const handleToggleFavorite = async () => {
    if (!userId) {
      toast.error("Please log in to save favorites");
      return;
    }
    const ok = await toggle(
      (fav) =>
        toast.success(fav ? "Added to favorites" : "Removed from favorites"),
      () => toast.error("Something went wrong. Please try again.")
    );
    if (!ok) return;
  };

  const features = [
    { icon: <FaBed size={20} className="text-primary" />, label: "4 Bedrooms" },
    {
      icon: <FaCar size={20} className="text-primary" />,
      label: "Car Parking",
    },
    {
      icon: <FaBath size={20} className="text-primary" />,
      label: "2 Bathrooms",
    },
    {
      icon: <MdOutlineLocalHospital size={20} className="text-primary" />,
      label: "Free Medical",
    },
    {
      icon: <FiLayers size={20} className="text-primary" />,
      label: "12400 sqft",
    },
    { icon: <FaFire size={20} className="text-primary" />, label: "Fireplace" },
    {
      icon: <BsBuilding size={20} className="text-primary" />,
      label: "1 Living Room",
    },
    { icon: <FaTv size={20} className="text-primary" />, label: "TV Cable" },
    {
      icon: <MdOutlineKitchen size={20} className="text-primary" />,
      label: "2 Kitchens",
    },
    { icon: <FaSpa size={20} className="text-primary" />, label: "Free Spa" },
    {
      icon: <BsBuilding size={20} className="text-primary" />,
      label: "Residential",
    },
    {
      icon: <BsBuilding size={20} className="text-primary" />,
      label: "Build 2007",
    },
  ];
  const facilities = [
    "Gym and Fitness Center",
    "Swimming Pool",
    "Children's Playground",
    "Community Hall",
    "High-Speed Internet",
    "Pet-Friendly Environment",
  ];

  return (
    <div className="min-h-screen pt-20 px-4 lg:p-20">
      <h2 className="text-2xl font-bold mb-2">{property?.title}</h2>

      {/* top content */}
      <div className="flex lg:justify-between lg:items-center flex-col lg:flex-row space-y-4">
        <div className="flex items-center">
          <TiLocation />
          <p>{property?.location.address}</p>
        </div>
        <div className="flex items-center gap-4">
          <ShareComponent />
          <button
            type="button"
            onClick={handleToggleFavorite}
            disabled={favLoading || authLoading}
            aria-pressed={isFavorite}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            className="bg-gray-100 rounded-md p-2 flex items-center gap-2 disabled:opacity-60"
            title={isFavorite ? "Saved" : "Save"}
          >
            <CiBookmark
              className={isFavorite ? "text-primary" : "text-gray-600"}
              size={18}
            />
            <span className="text-sm">{isFavorite ? "Saved" : "Save"}</span>
          </button>
        </div>
      </div>

      {/* image slider */}
      <div className="py-10">
        {property?.sliderImages && (
          <ImageSlider images={property.sliderImages} />
        )}
      </div>

      {/* details content */}
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-10 gap-6 items-start">
          {/* Left */}
          <div className="md:col-span-6 space-y-6">
            {/* For Sale + Price */}
            <div>
              <div className="flex items-center gap-2 text-gray-700 text-sm md:text-base font-medium">
                <BiSolidCheckbox className="text-primary text-lg md:text-xl" />
                For Sale
              </div>
              <div className="flex items-center gap-1 text-black text-lg md:text-xl font-semibold">
                <BsCurrencyDollar className="text-base" />
                {property?.price?.toLocaleString()}
              </div>
            </div>

            {/* Down Payment Info */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-full max-w-xl shadow-sm space-y-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
                <div className="flex items-center gap-2 text-primary font-medium">
                  <FaAngleDoubleDown className="text-lg md:text-xl" />
                  <span className="text-base md:text-lg">Down Payment</span>
                </div>
                <div className="flex items-center gap-1 text-lg font-bold text-black">
                  <BsCurrencyDollar className="text-base" />
                  <span>20,000</span>
                </div>
              </div>
              <div className="text-right">
                <Link
                  href="/mortgage-calculator"
                  className="text-primary text-sm underline hover:text-red-600 transition"
                >
                  Mortgage Calculator
                </Link>
              </div>
            </div>

            {/* Property Stats */}
            <div className="flex flex-wrap gap-3 text-sm md:text-base">
              <span className="bg-gray-100 px-4 py-2 flex items-center gap-2 rounded-md shadow-sm">
                <FaBed className="text-base text-gray-600" /> 2 Beds
              </span>
              <span className="bg-gray-100 px-4 py-2 flex items-center gap-2 rounded-md shadow-sm">
                <FaBath className="text-base text-gray-600" /> 3 Baths
              </span>
              <span className="bg-gray-100 px-4 py-2 flex items-center gap-2 rounded-md shadow-sm">
                <FaChartArea className="text-base text-gray-600" />
                12,400 sqft
              </span>
            </div>

            {/* Overview */}
            <div className="pt-4 border-t">
              <h2 className="text-lg md:text-xl font-semibold text-black mb-2">
                Overview
              </h2>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                {property?.description}
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="md:col-span-4">
            <ContactAndTour id={propertyId} />
          </div>
        </div>

        {/* gallery */}
        <div className="py-5 space-y-5">
          <h2 className="text-2xl font-bold">Gallery</h2>
          <PhotoProvider>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
              {property?.galleryImages?.map((image, index) => (
                <PhotoView key={index} src={image}>
                  <Image
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    width={300}
                    height={200}
                    unoptimized
                    className="cursor-pointer w-full rounded-md"
                  />
                </PhotoView>
              ))}
            </div>
          </PhotoProvider>
        </div>

        {/* location */}
        <div className="w-full space-y-4">
          <h2 className="text-2xl font-bold pt-4 lg:pt-10">
            Location Information
          </h2>
          {property?.nearbyLocations && (
            <Tabs
              locationInMap={property.location}
              schools={property.nearbyLocations.schools}
              shops={property.nearbyLocations.shops}
              commute={property.nearbyLocations.commute}
            />
          )}
        </div>

        {/* features + facilities */}
        <div>
          <FeaturesAndFacilities features={features} facilities={facilities} />
        </div>

        {/* Similar Properties */}
        <div className="pt-10">
          <h2 className="text-2xl font-bold mb-4">Similar Properties</h2>
          <div className="flex overflow-x-auto md:grid md:grid-cols-3 gap-4 space-x-4 md:space-x-0 pt-2 pb-2">
            {similarProperties.length > 0 ? (
              similarProperties.slice(0, 3).map((listing, index) => (
                <div className="min-w-[280px] md:min-w-0" key={index}>
                  <Card badge="similar" timeAgo="1h ago" listing={listing} />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 w-full">
                No new listings available.
              </p>
            )}
          </div>
        </div>

        {/* owner contact */}
        <div className="lg:pt-20 pt-10">
          <ContactOwner ownerInforMation={ownerInforMation} />
        </div>
      </div>
    </div>
  );
};

export default Details;
