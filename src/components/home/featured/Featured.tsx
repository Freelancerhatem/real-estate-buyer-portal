"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import Card from "@/components/listings/Card";
const Featured = () => {
  const [featured, setFeatured] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/properties/featured");
        setFeatured(response.data.data.slice(0, 3));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);
  if (loading) {
    return (
      <div className="px-4 py-6 md:py-8 lg:px-20">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-black mb-4">
          Featured Properties
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 shadow animate-pulse"
            >
              <div className="bg-gray-300 h-40 w-full mb-4 rounded"></div>
              <div className="h-4 bg-gray-300 w-3/4 mb-2 rounded"></div>
              <div className="h-4 bg-gray-300 w-1/2 mb-2 rounded"></div>
              <div className="h-4 bg-gray-300 w-full rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:py-8 lg:px-20">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-black mb-4">
        Featured Properties
      </h2>

      {error && (
        <p className="text-center text-red-500 text-sm md:text-base">{error}</p>
      )}

      {/* Scrollable container on small devices */}
      <div className="overflow-x-auto">
        <div
          className="flex space-x-4 md:grid md:gap-6"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {featured.length > 0 ? (
            featured.map((listing, index) => (
              <div key={index} className="min-w-[300px] md:min-w-0">
                <Card badge="featured" listing={listing} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No featured listings available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Featured;
