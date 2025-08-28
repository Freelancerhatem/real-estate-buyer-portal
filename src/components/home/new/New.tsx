"use client";
import Card from "@/components/listings/Card";
import axiosInstance from "@/lib/axiosInstance";
import { listing } from "@/types/listing";
import React, { useEffect, useState } from "react";

const New = () => {
  const [data, setData] = useState<listing[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewListings = async () => {
      try {
        const response = await axiosInstance("/properties/new");
        setData(response.data.data.slice(0, 3));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      }
    };
    fetchNewListings();
  }, []);

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="px-4 py-4 lg:px-20">
      <div>
        <h2 className="text-2xl font-bold text-black mb-4">New Listings</h2>
      </div>

      {/* Scrollable container for mobile, grid for tablet+ */}
      <div className="md:hidden -mx-4 overflow-x-auto pb-4">
        <div className="flex gap-4 px-4 min-w-max">
          {data.length > 0 ? (
            data.map((listing, index) => (
              <div key={index} className="min-w-[280px] flex-shrink-0">
                <Card badge="new" timeAgo="1h ago" listing={listing} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 w-full">
              No new listings available.
            </p>
          )}
        </div>
      </div>

      {/* Grid layout for medium (md) screens and above */}
      <div
        className="hidden md:grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
      >
        {data.length > 0 ? (
          data.map((listing, index) => (
            <Card badge="new" timeAgo="1h ago" key={index} listing={listing} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No new listings available.
          </p>
        )}
      </div>
    </div>
  );
};

export default New;
