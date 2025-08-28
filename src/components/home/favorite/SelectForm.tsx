"use client";
import Select from "@/components/ui/customSelect/Select";
import React, { useState } from "react";

interface SelectFormProps {
  onSubmit: (filters: {
    location?: string;
    priceMin?: number;
    priceMax?: number;
    propertyType?: string;
  }) => void;
}

const propertyTypes = [
  { label: "Apartment", value: "Apartment" },
  { label: "House", value: "House" },
  { label: "Condo", value: "Condo" },
  { label: "Villa", value: "Villa" },
  { label: "Commercial", value: "Commercial" },
];

const budgets = [
  { label: "Under $1000", value: "0-1000" },
  { label: "$1000 - $3000", value: "1000-3000" },
  { label: "$3000 - $5000", value: "3000-5000" },
  { label: "Over $5000", value: "5000-100000" },
];

const locations = [
  { label: "New York", value: "New York" },
  { label: "Los Angeles", value: "Los Angeles" },
  { label: "Chicago", value: "Chicago" },
  { label: "Houston", value: "Houston" },
];

const SelectForm: React.FC<SelectFormProps> = ({ onSubmit }) => {
  const [propertyType, setPropertyType] = useState("");
  const [budget, setBudget] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    const [min, max] = budget
      ? budget.split("-").map(Number)
      : [undefined, undefined];

    onSubmit({
      propertyType: propertyType || undefined,
      location: location || undefined,
      priceMin: min,
      priceMax: max,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Select
        label="Property Type"
        options={propertyTypes}
        value={propertyType}
        onChange={setPropertyType}
        placeholder="Select Property Type"
        color="primary"
      />

      <Select
        label="Budget"
        options={budgets}
        value={budget}
        onChange={setBudget}
        placeholder="Select Budget"
        color="primary"
      />

      <Select
        label="Location"
        options={locations}
        value={location}
        onChange={setLocation}
        placeholder="Select Location"
        color="primary"
      />

      <button
        onClick={handleSubmit}
        className="md:col-span-3 bg-primary text-white px-6 py-3 rounded-md font-semibold hover:bg-hover transition"
      >
        Submit
      </button>
    </div>
  );
};

export default SelectForm;
