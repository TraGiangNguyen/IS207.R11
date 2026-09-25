import React, { useState, useEffect } from "react";
import { Search, RotateCcw, Star } from "lucide-react";

export default function SidebarFilter({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");

  const categories = [
    { name: "Thermometers", count: 29 },
    { name: "Oximeters", count: 5 },
    { name: "BP Monitors", count: 1 },
    { name: "Personal Care", count: 1 },
  ];

  const ratings = [5, 4, 3, 2, 1];
  const colors = [
    "bg-blue-600",
    "bg-blue-400",
    "bg-orange-500",
    "bg-red-500",
    "bg-pink-500",
    "bg-amber-800",
    "bg-slate-600",
  ];

  const handleCategoryToggle = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleRatingToggle = (rating) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating],
    );
  };

  const handlePriceChange = (type, value) => {
    const numValue = parseInt(value) || 0;
    setPriceRange((prev) => ({ ...prev, [type]: numValue }));
  };

  // Emit data lên component cha
  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        searchTerm,
        categories: selectedCategories,
        priceRange,
        ratings: selectedRatings,
        color: selectedColor,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchTerm,
    selectedCategories,
    priceRange,
    selectedRatings,
    selectedColor,
  ]);

  return (
    <div className="w-[300px] flex-shrink-0 bg-[#fafafa] p-6 rounded-2xl border border-gray-100 space-y-8">
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#f0f2f5] text-gray-700 rounded-full py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#008B8B] transition-shadow"
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Categories</h3>
        <div className="space-y-3">
          {categories.map((cat) => (
            <label
              key={cat.name}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.name)}
                  onChange={() => handleCategoryToggle(cat.name)}
                  className="w-5 h-5 rounded border-gray-300 text-[#008B8B] focus:ring-[#008B8B] accent-[#008B8B] cursor-pointer"
                />
                <span
                  className={`text-base ${selectedCategories.includes(cat.name) ? "text-gray-900 font-medium" : "text-gray-600"}`}
                >
                  {cat.name}
                </span>
              </div>
              <span className="text-gray-400 text-sm">({cat.count})</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Price Range</h3>
          <button
            onClick={() => setPriceRange({ min: 0, max: 100 })}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            Reset <RotateCcw size={14} />
          </button>
        </div>

        <div className="relative h-2 bg-[#d1f0f0] rounded-full mt-4 mb-6">
          <div className="absolute left-1/4 right-1/4 h-full bg-[#008B8B] rounded-full"></div>
          <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#008B8B] rounded-full shadow-md"></div>
          <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#008B8B] rounded-full shadow-md"></div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              $
            </span>
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              className="w-full bg-[#f0f2f5] rounded-full py-2.5 pl-8 pr-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#008B8B]"
            />
          </div>
          <span className="text-gray-400 font-medium">To</span>
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              $
            </span>
            <input
              type="number"
              value={priceRange.max}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              className="w-full bg-[#f0f2f5] rounded-full py-2.5 pl-8 pr-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#008B8B]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Rating</h3>
          <button
            onClick={() => setSelectedRatings([])}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            Reset <RotateCcw size={14} />
          </button>
        </div>
        <div className="space-y-3">
          {ratings.map((starCount) => (
            <label
              key={starCount}
              className="flex items-center justify-between cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedRatings.includes(starCount)}
                  onChange={() => handleRatingToggle(starCount)}
                  className="w-5 h-5 rounded border-gray-300 text-[#008B8B] focus:ring-[#008B8B] accent-[#008B8B] cursor-pointer"
                />
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      size={18}
                      className={
                        index < starCount
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-200 fill-gray-200"
                      }
                    />
                  ))}
                </div>
              </div>
              <span className="text-gray-400 text-sm">(189)</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Color</h3>
          <button
            onClick={() => setSelectedColor("")}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            Reset <RotateCcw size={14} />
          </button>
        </div>
        <div className="flex flex-wrap gap-4">
          {colors.map((colorClass) => (
            <button
              key={colorClass}
              onClick={() => setSelectedColor(colorClass)}
              className={`w-10 h-10 rounded-full ${colorClass} transition-transform hover:scale-110 
                ${selectedColor === colorClass ? "ring-2 ring-offset-2 ring-[#008B8B]" : ""}
              `}
              aria-label={`Select color ${colorClass}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
