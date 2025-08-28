import { listing } from "@/types/listing";
import React from "react";

interface SortingDropdownProps {
  sortBy: keyof listing;
  setSortBy: (value: keyof listing) => void;
  order: "asc" | "desc";
  setOrder: (value: "asc" | "desc") => void;
}

const SortingDropdown: React.FC<SortingDropdownProps> = ({
  sortBy,
  setSortBy,
  order,
  setOrder,
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h3 className="text-xl font-bold mb-4">Sort By</h3>
      <div className="space-y-4">
        {/* Sort Criteria */}
        <div>
          <label className="block font-medium text-gray-700">Criteria</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as keyof listing)}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-2 text-gray-700"
          >
            <option value="price">Price</option>
            <option value="totalBedrooms">Bedrooms</option>
            <option value="totalBathrooms">Bathrooms</option>
            {/* Add more if needed */}
          </select>
        </div>

        {/* Order Direction */}
        <div>
          <label className="block font-medium text-gray-700">Order</label>
          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as "asc" | "desc")}
            className="w-full border border-gray-300 rounded px-3 py-2 mt-2 text-gray-700"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SortingDropdown;
