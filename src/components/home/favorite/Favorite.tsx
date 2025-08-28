"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import Card from "@/components/listings/Card";
import { listing } from "@/types/listing";
import SelectForm from "./SelectForm";
import Skeleton from "@/components/listings/Skelton";

interface FilterOptions {
  location?: string;
  priceMin?: number;
  priceMax?: number;
  propertyType?: string;
}

const Favorite = () => {
  const [filteredFavorites, setFilteredFavorites] = useState<listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setError] = useState<string | null>(null);
  const [sort, setSort] = useState<string>("createdAt:desc");

  const fetchFilteredFavorites = async (
    filters: FilterOptions,
    sortBy: string
  ) => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {
        ...(filters.location && { city: filters.location }),
        ...(filters.propertyType && { propertyType: filters.propertyType }),
        ...(filters.priceMax && { priceMax: filters.priceMax }),
        sort: sortBy,
      };

      const response = await axiosInstance.get("/properties/favorites/find", {
        params,
      });
      setFilteredFavorites(response.data.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load favorites."
      );
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (selectedFilters: FilterOptions) => {
    fetchFilteredFavorites(selectedFilters, sort);
  };

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    fetchFilteredFavorites({}, newSort);
  };

  useEffect(() => {
    fetchFilteredFavorites({}, sort);
  }, [sort]);

  return (
    <div className="px-4 sm:px-6 lg:px-20 pt-10  md:py-10  min-h-screen bg-white">
      <h1 className="pb-4 text-2xl sm:text-3xl font-bold text-gray-800">
        Find Your Favorites
      </h1>

      {/* Filters + Sorting Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SelectForm onSubmit={applyFilters} />

        {/* Sort Dropdown */}
        <div className="w-full sm:w-64">
          <select
            value={sort}
            onChange={(e) => handleSortChange(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="createdAt:desc">Newest</option>
            <option value="price:asc">Price Low to High</option>
            <option value="price:desc">Price High to Low</option>
          </select>
        </div>
      </div>

      {/* Listings */}
      <div className="pt-8">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} />
            ))}
          </div>
        ) : filteredFavorites.length > 0 ? (
          <>
            {/* Mobile View: Horizontal Scroll – all cards */}
            <div className="flex gap-4 overflow-x-auto scroll-smooth sm:hidden pb-4">
              {filteredFavorites.map((listing) => (
                <div key={listing._id} className="min-w-[85%] flex-shrink-0">
                  <Card listing={listing} />
                </div>
              ))}
            </div>

            {/* Desktop View: Grid with max 3 cards */}
            <div className="hidden sm:grid sm:grid-cols-3 gap-6">
              {filteredFavorites.slice(0, 3).map((listing) => (
                <Card key={listing._id} listing={listing} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center mt-10 text-gray-500 text-lg">
            No matching favorite properties found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorite;
