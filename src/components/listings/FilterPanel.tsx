import { FiltersType } from "@/types/listing";
import React, { Dispatch, SetStateAction } from "react";
import { Tooltip } from "react-tooltip";

interface FilterProps {
  filters: FiltersType;
  setFilters: Dispatch<SetStateAction<FiltersType>>;
}

const FilterPanel: React.FC<FilterProps> = ({ filters, setFilters }) => {
  const handleChange = <K extends keyof FiltersType>(
    key: K,
    value: FiltersType[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg transition-all hover:shadow-xl">
      <h3 className="text-2xl font-bold mb-6 text-gray-800">Filters</h3>
      <div className="space-y-6">
        {/* 🔍 Search Box */}
        <div>
          <label
            className="block font-medium text-gray-700"
            htmlFor="searchTerm"
          >
            Search
          </label>
          <input
            type="text"
            id="searchTerm"
            value={filters.searchTerm}
            onChange={(e) => handleChange("searchTerm", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Search by city, country, or title"
          />
        </div>

        {/* 💰 Price Range */}
        <div>
          <label
            className="block font-medium text-gray-700"
            htmlFor="price-range"
          >
            Price Range
          </label>
          <div className="flex space-x-3 mt-2" id="price-range">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceMin}
              min={0}
              onChange={(e) => handleChange("priceMin", Number(e.target.value))}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.priceMax}
              min={1}
              onChange={(e) => handleChange("priceMax", Number(e.target.value))}
              className="w-1/2 border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <Tooltip
            id="price-tooltip"
            content="Enter your preferred price range."
          />
        </div>

        {/* 🛏 Bedrooms */}
        <div>
          <label className="block font-medium text-gray-700" htmlFor="bedrooms">
            Bedrooms
          </label>
          <input
            type="number"
            id="bedrooms"
            value={filters.bedrooms || ""}
            min={0}
            onChange={(e) =>
              handleChange(
                "bedrooms",
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Number of bedrooms"
          />
        </div>

        {/* 🚿 Bathrooms */}
        <div>
          <label
            className="block font-medium text-gray-700"
            htmlFor="bathrooms"
          >
            Bathrooms
          </label>
          <input
            type="number"
            id="bathrooms"
            value={filters.bathrooms || ""}
            min={0}
            onChange={(e) =>
              handleChange(
                "bathrooms",
                e.target.value ? Number(e.target.value) : null
              )
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="Number of bathrooms"
          />
        </div>

        {/* 🏠 Property Type */}
        <div>
          <label
            className="block font-medium text-gray-700"
            htmlFor="property-type"
          >
            Property Type
          </label>
          <select
            id="property-type"
            value={filters.propertyType}
            onChange={(e) => handleChange("propertyType", e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-2 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="">Any</option>
            <option value="Villa">Villa</option>
            <option value="Apartment">Apartment</option>
          </select>
        </div>

        {/* 🧩 Amenities */}
        <div>
          <label className="block font-medium text-gray-700">Amenities</label>
          <div className="flex flex-wrap gap-3 mt-2">
            {["Garden", "Storage", "Gym"].map((amenity) => (
              <label
                key={amenity}
                className="flex items-center space-x-2 cursor-pointer hover:text-blue-600"
              >
                <input
                  type="checkbox"
                  checked={filters.amenities.includes(amenity)}
                  onChange={(e) => {
                    const updatedAmenities = e.target.checked
                      ? [...filters.amenities, amenity]
                      : filters.amenities.filter((a) => a !== amenity);
                    handleChange("amenities", updatedAmenities);
                  }}
                  className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </div>

        {/* 🔄 Reset Filters */}
        <div>
          <button
            onClick={() =>
              setFilters({
                priceMin: 0,
                priceMax: Infinity,
                bedrooms: null,
                bathrooms: null,
                propertyType: "",
                amenities: [],
                searchTerm: "",
              })
            }
            className="w-full bg-primary text-white font-semibold py-2 rounded-lg shadow-lg hover:bg-hover transition-all"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
