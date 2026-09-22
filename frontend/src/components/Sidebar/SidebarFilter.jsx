import { useState } from "react";
import { Search, RotateCcw, Star } from "lucide-react";

const categories = [
  { name: "Thermometers", count: 29 },
  { name: "Oximeters", count: 5 },
  { name: "BP Monitors", count: 1 },
  { name: "Personal Care", count: 1 },
];

const colors = [
  "#1D4ED8",
  "#93C5FD",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#8B4513",
  "#6B7280",
];

function ResetButton({ title }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-400 cursor-pointer hover:text-gray-600">
      <span>{title}</span>
      <RotateCcw size={16} />
    </div>
  );
}

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
      ))}
      {[...Array(5 - rating)].map((_, i) => (
        <Star key={i} size={16} className="text-gray-200 fill-gray-200" />
      ))}
    </div>
  );
}

export default function SidebarFilter({ setPriceRange, priceRange }) {
  const handlePriceChange = (e, type) => {
    const value = parseInt(e.target.value) || 0;
    if (type === "min") {
      setPriceRange([value, priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], value]);
    }
  };

  return (
    <div className="w-80 flex-shrink-0 bg-white p-6 border rounded-xl space-y-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          className="w-full pl-12 pr-4 py-3 bg-[#F4F6F6] border border-gray-100 rounded-full focus:ring-1 focus:ring-[#008B8B] outline-none text-sm"
        />
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900">Categories</h3>
        <ul className="space-y-3">
          {categories.map((cat, index) => (
            <li
              key={index}
              className="flex items-center justify-between text-base text-gray-700 hover:text-gray-900 cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center group-hover:border-[#008B8B]">
                  {index === 0 && (
                    <span className="w-2.5 h-2.5 bg-[#008B8B] rounded-sm"></span>
                  )}
                </span>
                {cat.name}
              </span>
              <span className="text-sm text-gray-400">({cat.count})</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Price Range</h3>
          <ResetButton title="Reset" />
        </div>
        <div className="relative pt-6">
          <div className="absolute left-0 right-0 h-1.5 bg-[#caf8e4] rounded-full"></div>
          <div className="absolute left-1/4 right-1/4 h-1.5 bg-[#008B8B] rounded-full"></div>
          <div className="absolute left-1/4 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-[#008B8B] border-[3px] border-white rounded-full shadow-md cursor-pointer"></div>
          <div className="absolute left-3/4 top-1/2 -translate-y-1/2 -translate-x-1/2 w-6 h-6 bg-[#008B8B] border-[3px] border-white rounded-full shadow-md cursor-pointer"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 p-3 bg-[#F4F6F6] rounded-full text-sm text-gray-700">
            <span className="text-gray-400">$</span>
            <input
              type="text"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange(e, "min")}
              className="w-full bg-transparent outline-none"
            />
          </div>
          <span className="text-gray-400 text-sm">To</span>
          <div className="flex-1 flex items-center gap-2 p-3 bg-[#F4F6F6] rounded-full text-sm text-gray-700">
            <span className="text-gray-400">$</span>
            <input
              type="text"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange(e, "max")}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Rating</h3>
          <ResetButton title="Reset" />
        </div>
        <ul className="space-y-3">
          {[5, 4, 3, 2, 1].map((rating, index) => (
            <li
              key={index}
              className="flex items-center justify-between text-gray-700 hover:text-gray-900 cursor-pointer group"
            >
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border border-gray-300 rounded flex items-center justify-center group-hover:border-[#008B8B]">
                  {index === 0 && (
                    <span className="w-2.5 h-2.5 bg-[#008B8B] rounded-sm"></span>
                  )}
                </span>
                <StarRating rating={rating} />
              </span>
              <span className="text-sm text-gray-400">(189)</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Color</h3>
          <ResetButton title="Reset" />
        </div>
        <div className="flex flex-wrap gap-3">
          {colors.map((color, index) => (
            <div
              key={index}
              style={{ backgroundColor: color }}
              className={`w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform ${
                index === 0
                  ? "border-[3px] border-gray-100 ring-2 ring-[#008B8B]"
                  : ""
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
