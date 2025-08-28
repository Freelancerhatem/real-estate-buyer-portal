"use client";

import Image from "next/image";
import bg from "@/assets/images/search-bg.png";
import useProperties from "@/hooks/useProperties";
import { ClipLoader } from "react-spinners";
import { useState, useEffect } from "react";
import Card from "@/components/listings/Card";
import { listing } from "@/types/listing";
import FilterPanel from "@/components/listings/FilterPanel";
import SortingDropdown from "@/components/listings/SortingDropDown";

export interface Property {
  price: number;
  totalBedrooms: number;
  totalBathrooms: number;
  propertyType: string;
  amenities: string[];
  thumbnail: string;
  title: string;
  location: { city: string; country: string };
  [key: string]: number | string | string[] | { city: string; country: string };
}

interface FiltersType {
  priceMin: number;
  priceMax: number;
  bedrooms: number | null;
  bathrooms: number | null;
  propertyType: string;
  amenities: string[];
  searchTerm: string;
}

const Listings: React.FC = () => {
  const { properties: listings, loading, error } = useProperties();

  const [filters, setFilters] = useState<FiltersType>({
    priceMin: 0,
    priceMax: 1000000000000,
    bedrooms: null,
    bathrooms: null,
    propertyType: "",
    amenities: [],
    searchTerm: "",
  });

  const [sortBy, setSortBy] = useState<Extract<keyof listing, string>>("price");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const [filteredListings, setFilteredListings] = useState<listing[]>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter and sort listings
  useEffect(() => {
    if (listings) {
      let filtered = [...listings];

      // Apply filters
      filtered = filtered.filter((listing) => {
        const matchPrice =
          listing.price >= filters.priceMin &&
          listing.price <= filters.priceMax;
        const matchBedrooms =
          !filters.bedrooms || listing.totalBedrooms === filters.bedrooms;
        const matchBathrooms =
          !filters.bathrooms || listing.totalBathrooms === filters.bathrooms;
        const matchType =
          !filters.propertyType ||
          listing.propertyType === filters.propertyType;
        const matchAmenities =
          !filters.amenities.length ||
          filters.amenities.every((amenity) =>
            listing.amenities.includes(amenity)
          );

        const matches =
          matchPrice &&
          matchBedrooms &&
          matchBathrooms &&
          matchType &&
          matchAmenities;

        return matches;
      });

      // Apply sorting
      filtered.sort((a, b) => {
        const aValue = a[sortBy as keyof listing] as number | string;
        const bValue = b[sortBy as keyof listing] as number | string;

        if (order === "asc") {
          return typeof aValue === "number" && typeof bValue === "number"
            ? aValue - bValue
            : aValue.toString().localeCompare(bValue.toString());
        } else {
          return typeof aValue === "number" && typeof bValue === "number"
            ? bValue - aValue
            : bValue.toString().localeCompare(aValue.toString());
        }
      });

      setFilteredListings(() => filtered);

      setCurrentPage(1);
    }
  }, [filters, listings, sortBy, order]);

  // Get paginated listings
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredListings.length / itemsPerPage);

  return (
    <div className="min-h-screen p-5">
      {/* Banner */}
      <div className="relative h-[calc(100vh-40px)]">
        <div className="absolute bg-[#0000004f] rounded-lg inset-0"></div>
        <Image
          src={bg}
          alt="listing-bg"
          className="h-full w-full object-cover lg:object-fill rounded-lg"
        />
        <h2 className="lg:text-5xl text-2xl w-full text-center font-bold text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          Property Listings
        </h2>
      </div>

      {/* Main Content with Sidebar */}
      <div className="lg:py-20 px-4 pt-12 flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-1/4 bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-bold mb-4">Filters & Sorting</h3>
          {/* Filter Panel */}
          <FilterPanel filters={filters} setFilters={setFilters} />
          <hr className="my-4" />
          {/* Sorting Dropdown */}
          <SortingDropdown
            sortBy={sortBy}
            setSortBy={setSortBy}
            order={order}
            setOrder={setOrder}
          />
        </div>

        {/* Listings Content */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center min-h-screen">
              <ClipLoader size={50} color="#3498db" loading={loading} />
            </div>
          ) : error ? (
            <div className="text-center text-red-600">
              <p>Error: {error}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedListings.map((listing, index) => (
                  <Card key={index} listing={listing} />
                ))}
              </div>

              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-6">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;
