"use client";

import { useState } from "react";
import Image from "next/image";
import { FaHeart } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { GrNext, GrPrevious } from "react-icons/gr";
import { PhotoProvider, PhotoView } from "react-photo-view";
import "react-photo-view/dist/react-photo-view.css";

const ImageSlider = ({ images }: { images: string[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle Next Slide
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Handle Previous Slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  // Dynamically calculate visible images (4 at a time)
  const visibleImages = images
    .slice(currentIndex, currentIndex + 4)
    .concat(images.slice(0, Math.max(0, 4 - (images.length - currentIndex))));

  return (
    <PhotoProvider>
      <div className="flex flex-col lg:flex-row gap-6 relative">
        {/* Left Side - Main Slideshow */}
        <div className="relative w-full lg:w-3/4 h-[300px] md:h-[500px] overflow-hidden rounded-lg shadow-lg">
          <PhotoView src={images[currentIndex]}>
            <Image
              src={images[currentIndex]}
              alt={images[currentIndex]}
              fill
              className="object-cover cursor-pointer transition-transform duration-700 ease-in-out"
              sizes="(max-width: 768px) 100vw, 50vw"
              unoptimized
            />
          </PhotoView>
          <div className="absolute bottom-5 left-5 flex items-center gap-4">
            <button className="flex items-center gap-2 text-white bg-black bg-opacity-50 px-3 py-2 rounded-full">
              <FaHeart className="text-primary text-2xl" />
              75,84,589
            </button>
            <button className="flex text-white items-center gap-2 bg-black bg-opacity-50 px-3 py-2 rounded-full">
              <IoEyeOutline className="text-primary text-2xl" />
              75,84,589
            </button>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute flex items-center justify-center bg-primary top-1/2 left-4 transform -translate-y-1/2 text-white p-3 rounded-full hover:bg-opacity-70 transition shadow-lg"
          >
            <GrPrevious />
          </button>
          <button
            onClick={nextSlide}
            className="absolute flex justify-center items-center top-1/2 right-4 transform -translate-y-1/2 bg-primary text-white p-3 rounded-full hover:bg-opacity-70 transition shadow-lg"
          >
            <GrNext />
          </button>
        </div>

        {/* Right Side - Thumbnail Index */}
        <div className="lg:w-1/4 hidden lg:grid grid-cols-1 grid-rows-4 gap-4 overflow-hidden">
          {visibleImages.map((image, index) => {
            const actualIndex = (currentIndex + index) % images.length;
            return (
              <div
                key={actualIndex}
                onClick={() => setCurrentIndex(actualIndex)}
                className={`relative w-full cursor-pointer rounded-lg overflow-hidden border-2 ${
                  actualIndex === currentIndex
                    ? "border-primary scale-105 shadow-lg "
                    : "border-gray-300"
                } transition-transform duration-300`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${actualIndex}`}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-300"
                  unoptimized
                />

                {/* Remaining Images Counter */}
                {index === 3 && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full">
                    {images.length - (currentIndex + 1)} more images remaining
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Dots - Slide Indicators */}
        <div className="flex justify-center space-x-2 mt-4 lg:hidden">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-primary" : "bg-gray-400"
              }`}
            ></button>
          ))}
        </div>
      </div>
    </PhotoProvider>
  );
};

export default ImageSlider;
