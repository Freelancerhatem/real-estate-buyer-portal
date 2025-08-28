import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface CustomSelectProps {
  options: { value: string; label: React.ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  error?: string;
  color?: "primary" | "green"; // Add more themes as needed
}

const colorClassMap = {
  primary: {
    border: "hover:border-primary",
    ring: "focus-within:ring-primary",
    hover: "hover:bg-primary/10",
    selected: "bg-primary/10",
  },
  green: {
    border: "hover:border-green-500",
    ring: "focus-within:ring-green-500",
    hover: "hover:bg-green-100",
    selected: "bg-green-100",
  },
};

const Select: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  icon,
  error,
  color = "green",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const theme = colorClassMap[color];

  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-gray-700 font-semibold mb-2">
          {label}
        </label>
      )}

      {/* Select Box */}
      <div
        className={`flex items-center justify-between border bg-white rounded-md p-3 shadow-md cursor-pointer 
                   transition-all focus-within:ring-2
                   ${
                     error
                       ? "border-red-500 focus-within:ring-red-500"
                       : `border-gray-300 ${theme.border} ${theme.ring}`
                   }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-500">{icon}</span>}
          <span className={`text-gray-700 ${!value && "text-gray-400"}`}>
            {value || placeholder}
          </span>
        </div>
        <FaChevronDown
          className={`text-gray-500 transform transition-all ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-md mt-2 overflow-hidden max-h-48 overflow-y-auto">
          {options.map((option) => (
            <div
              key={option.value}
              className={`flex items-center px-4 py-3 cursor-pointer transition 
                          ${theme.hover}
                          ${
                            value === option.value
                              ? `${theme.selected} font-medium`
                              : ""
                          }`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default Select;
