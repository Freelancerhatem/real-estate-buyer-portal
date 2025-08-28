"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { FiSearch } from "react-icons/fi";

interface Suggestion {
  display_name: string;
}

const SearchBar = () => {
  const [searchType, setSearchType] = useState("buy");
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const suggestionBoxRef = useRef<HTMLDivElement | null>(null);

  const fetchSuggestions = async () => {
    try {
      const response = await axios.get<Suggestion[]>(
        `https://nominatim.openstreetmap.org/search`,
        { params: { format: "json", q: query } }
      );
      setSuggestions(response.data.map((item) => item.display_name));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleSearch = () => {
    router.push(`/search?type=${searchType}&query=${query}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setSuggestions([]);
    router.push(`/search?type=${searchType}&query=${suggestion}`);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) =>
        prev > 0 ? prev - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      handleSuggestionClick(suggestions[selectedIndex]);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionBoxRef.current &&
        !suggestionBoxRef.current.contains(event.target as Node) &&
        inputRef.current !== event.target
      ) {
        setSuggestions([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length > 2) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [query]);

  return (
    <div className="w-full max-w-full md:max-w-xl mx-auto relative px-3">
      {/* Input Box with Tabs Inside */}
      <div className="flex items-center w-full border border-gray-300 rounded-full px-3 py-2 shadow-sm bg-white focus-within:ring-2 focus-within:ring-primary">
        {/* Toggle Buttons Inside Input */}
        <div className="flex space-x-2 border-r pr-2">
          <button
            className={`px-3 py-1 text-xs md:text-sm font-medium rounded-full ${
              searchType === "buy"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setSearchType("buy")}
          >
            Buy
          </button>
          <button
            className={`px-3 py-1 text-xs md:text-sm font-medium rounded-full ${
              searchType === "rent"
                ? "bg-primary text-white"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setSearchType("rent")}
          >
            Rent
          </button>
        </div>

        {/* Search Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search properties..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full px-3 py-2 text-xs md:text-lg border-none focus:ring-0 focus:outline-none text-gray-800"
        />

        {/* Search Button */}
        <button
          className="text-gray-600 hover:text-primary"
          onClick={handleSearch}
        >
          <FiSearch size={22} />
        </button>
      </div>

      {/* Auto Suggestions */}
      {suggestions.length > 0 && (
        <div
          ref={suggestionBoxRef}
          className="absolute z-20 top-full left-0 w-full mt-2 scrollbar-none bg-white border border-gray-300 shadow-xl rounded-xl max-h-48 overflow-y-auto transition-all ease-in-out duration-300 transform opacity-100"
        >
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`p-4 z-20  text-gray-800 cursor-pointer transition-all duration-300 rounded-xl ${
                index === selectedIndex
                  ? "bg-primary text-white scale-105 shadow-lg"
                  : "hover:bg-gray-200 hover:scale-105"
              }`}
              onMouseDown={() => handleSuggestionClick(suggestion)}
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
