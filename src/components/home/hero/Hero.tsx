"use client";
import Image from "next/image";
import banner from "@/assets/images/banner.webp";
import SearchBar from "./Searchbar";

const Banner = () => {
  return (
    <div className="relative grid grid-cols-1 lg:grid-cols-2 items-center min-h-screen pb-5 md:pb-0">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={banner}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover"
          priority
        />
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60"></div>

      {/* Left Side Content */}
      <div className="relative z-10 px-4  md:px-16 lg:pl-20 pt-24 lg:pt-40 space-y-6 text-white text-center md:text-left">
        <h1 className="uppercase  text-4xl md:text-5xl font-bold md:leading-tight">
          Find Your Modern & Affordable Home
        </h1>

        {/* Search Bar */}
        <SearchBar />

        {/* Statistics Section */}
        {/* <BannerStats /> */}
      </div>
    </div>
  );
};

export default Banner;
