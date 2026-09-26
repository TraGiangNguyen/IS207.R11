import React, { useState, useEffect } from "react";
import { Search, RotateCcw, Star } from "lucide-react";

export default function SidebarFilter({ onFilterChange }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Khởi tạo state cho thanh trượt giá (Giá tối đa giả định là 150)
  const MAX_PRICE = 150;
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 });
  const [selectedRatings, setSelectedRatings] = useState([]);

  const categories = [
    { name: "Thermometers", count: 29 },
    { name: "Oximeters", count: 5 },
    { name: "BP Monitors", count: 1 },
    { name: "Personal Care", count: 1 },
  ];

  const ratings = [5, 4, 3, 2, 1];

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

  // Xử lý khi thay đổi ô nhập số
  const handlePriceInputChange = (type, value) => {
    const numValue = parseInt(value) || 0;
    setPriceRange((prev) => ({ ...prev, [type]: numValue }));
  };

  // Xử lý khi kéo thanh trượt
  const handleSliderChange = (e, type) => {
    const value = parseInt(e.target.value);
    if (type === "min") {
      // Giới hạn không cho thumb min vượt quá thumb max
      setPriceRange((prev) => ({
        ...prev,
        min: Math.min(value, prev.max - 1),
      }));
    } else {
      // Giới hạn không cho thumb max nhỏ hơn thumb min
      setPriceRange((prev) => ({
        ...prev,
        max: Math.max(value, prev.min + 1),
      }));
    }
  };

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({
        searchTerm,
        categories: selectedCategories,
        priceRange,
        ratings: selectedRatings,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedCategories, priceRange, selectedRatings]);

  return (
    <div className="w-full lg:w-[300px] flex-shrink-0 bg-[#fafafa] p-6 rounded-2xl border border-gray-100 space-y-8">
      {/* CSS tùy chỉnh cho thanh trượt giá dạng kép */}
      <style>{`
        .range-slider input[type="range"] {
          position: absolute;
          width: 100%;
          height: 8px;
          background: transparent;
          pointer-events: none;
          -webkit-appearance: none;
          top: 0;
          margin: 0;
          outline: none;
        }
        .range-slider input[type="range"]::-webkit-slider-thumb {
          pointer-events: all;
          width: 20px;
          height: 20px;
          background-color: #008B8B;
          border-radius: 50%;
          cursor: pointer;
          -webkit-appearance: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>

      {/* 1. Ô Tìm kiếm */}
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
          className="w-full bg-[#f0f2f5] text-gray-700 rounded-full py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-[#008B8B]"
        />
      </div>

      {/* 2. Categories */}
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

      {/* 3. Price Range (Đã hoàn thiện chức năng kéo) */}
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

        {/* Khối thanh trượt */}
        <div className="relative h-2 bg-[#d1f0f0] rounded-full mt-4 mb-8 range-slider">
          {/* Vùng track màu xanh đậm thể hiện khoảng được chọn */}
          <div
            className="absolute h-full bg-[#008B8B] rounded-full pointer-events-none"
            style={{
              left: `${(priceRange.min / MAX_PRICE) * 100}%`,
              right: `${100 - (priceRange.max / MAX_PRICE) * 100}%`,
            }}
          ></div>

          {/* Thumb kéo Giá trị nhỏ nhất (Min) */}
          <input
            type="range"
            min="0"
            max={MAX_PRICE}
            value={priceRange.min}
            onChange={(e) => handleSliderChange(e, "min")}
            style={{ zIndex: priceRange.min > MAX_PRICE - 10 ? "5" : "3" }}
          />

          {/* Thumb kéo Giá trị lớn nhất (Max) */}
          <input
            type="range"
            min="0"
            max={MAX_PRICE}
            value={priceRange.max}
            onChange={(e) => handleSliderChange(e, "max")}
            style={{ zIndex: "4" }}
          />
        </div>

        {/* Khối nhập số */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              $
            </span>
            <input
              type="number"
              value={priceRange.min}
              onChange={(e) => handlePriceInputChange("min", e.target.value)}
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
              onChange={(e) => handlePriceInputChange("max", e.target.value)}
              className="w-full bg-[#f0f2f5] rounded-full py-2.5 pl-8 pr-4 text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#008B8B]"
            />
          </div>
        </div>
      </div>

      {/* 4. Rating */}
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
    </div>
  );
}
