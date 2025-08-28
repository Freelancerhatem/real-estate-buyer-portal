"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { FaQuoteLeft } from "react-icons/fa";
import { MdOutlineNavigateBefore, MdOutlineNavigateNext } from "react-icons/md";

const reviews = [
  {
    id: 1,
    text: "Amazing service! Highly recommend for anyone looking for quality and reliability.",
    name: "John Doe",
    rating: 4,
    img: "https://via.placeholder.com/50",
  },
  {
    id: 2,
    text: "The team was professional and went above and beyond to meet our expectations.",
    name: "Jane Smith",
    rating: 4,
    img: "https://via.placeholder.com/50",
  },
  {
    id: 3,
    text: "I was impressed with the seamless process and the attention to detail. Great work!",
    name: "Michael Brown",
    rating: 4.5,
    img: "https://via.placeholder.com/50",
  },
  {
    id: 4,
    text: "Fantastic experience! The staff was friendly and the process was smooth.",
    name: "Sarah Wilson",
    rating: 5,
    img: "https://via.placeholder.com/50",
  },
  {
    id: 5,
    text: "Highly professional and exceeded all our expectations. Kudos to the team!",
    name: "David Clark",
    rating: 4.8,
    img: "https://via.placeholder.com/50",
  },
  {
    id: 6,
    text: "A reliable and efficient service that I will use again in the future.",
    name: "Emily Johnson",
    rating: 4.2,
    img: "https://via.placeholder.com/50",
  },
  {
    id: 7,
    text: "Great support throughout the process. I felt like a valued customer.",
    name: "Chris Evans",
    rating: 4.7,
    img: "https://via.placeholder.com/50",
  },
  {
    id: 8,
    text: "The service was good, but there is room for improvement in communication.",
    name: "Jessica Lee",
    rating: 3.8,
    img: "https://via.placeholder.com/50",
  },
];

const Reviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [cardsToShow, setCardsToShow] = useState(3);

  // Handle previous button
  const handlePrevClick = () => {
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
  };

  // Handle next button
  const handleNextClick = () => {
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
  };

  // Auto-slide logic
  useEffect(() => {
    if (isHovered) return; // Pause auto-slide on hover

    const autoSlide = setInterval(() => {
      handleNextClick();
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(autoSlide); // Cleanup interval
  }, [currentIndex, isHovered]);

  // Determine the number of cards to show based on screen size
  useEffect(() => {
    const updateCardsToShow = () => {
      if (window.innerWidth < 640) {
        setCardsToShow(1); // Mobile
      } else if (window.innerWidth < 1024) {
        setCardsToShow(2); // Tablet
      } else {
        setCardsToShow(3); // Desktop
      }
    };

    updateCardsToShow(); // Set on initial load
    window.addEventListener("resize", updateCardsToShow); // Update on resize

    return () => {
      window.removeEventListener("resize", updateCardsToShow);
    };
  }, []);

  return (
    <div
      className="w-full p-6 lg:p-20 bg-gray-50"
      onMouseEnter={() => setIsHovered(true)} // Pause auto-slide
      onMouseLeave={() => setIsHovered(false)} // Resume auto-slide
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800">User Reviews</h2>
        <div className="flex space-x-4">
          <button
            onClick={handlePrevClick}
            className="bg-primary text-white rounded-full p-3 shadow-lg transition-transform transform hover:scale-110"
          >
            <MdOutlineNavigateBefore size={24} />
          </button>
          <button
            onClick={handleNextClick}
            className="bg-primary text-white rounded-full p-3 shadow-lg transition-transform transform hover:scale-110"
          >
            <MdOutlineNavigateNext size={24} />
          </button>
        </div>
      </div>

      {/* Reviews */}
      <div className="relative overflow-hidden">
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${(currentIndex * 100) / cardsToShow}%)`,
          }}
        >
          {reviews.map((review) => (
            <div
              key={review.id}
              className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 p-6 transform transition-all duration-500 hover:scale-105"
            >
              <div className="p-8  bg-white rounded-lg">
                <div className="flex relative items-center mb-6">
                  {/* Enhanced Quote Icon */}
                  <FaQuoteLeft className="text-primary absolute  top-0 -left-6    text-xl  " />
                  <p className="text-lg text-gray-600 ">{review.text}</p>
                </div>
                <hr className="my-4 border-gray-300" />
                <div className="flex items-center">
                  <Image
                    src={review.img}
                    alt={review.name}
                    className="w-16 h-16 rounded-full mr-4 shadow-lg"
                    width={50}
                    height={50}
                  />
                  <div>
                    <p className="font-semibold text-gray-700">{review.name}</p>
                    <div className="flex items-center mt-1">
                      {/* Display star rating */}
                      {[...Array(Math.floor(review.rating))].map((_, i) => (
                        <span key={i} className="text-yellow-500">
                          &#9733;
                        </span>
                      ))}
                      {[...Array(5 - Math.floor(review.rating))].map((_, i) => (
                        <span key={i} className="text-gray-300">
                          &#9733;
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
