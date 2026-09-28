import React, { useState } from "react";
import SidebarFilter from "../components/Sidebar/SidebarFilter";
import ProductCard from "../components/product/ProductCard";
import mockProducts from "../data/mockProducts";
import { useAuth } from "../context/AuthContext";

// Merge mockProducts với overrides của admin (nếu có) từ localStorage
function getMergedProducts() {
  try {
    const overrides = JSON.parse(localStorage.getItem("productOverrides")) || {};
    return mockProducts.map((p) =>
      overrides[p.id] ? { ...p, ...overrides[p.id] } : p
    );
  } catch {
    return mockProducts;
  }
}

export default function ProductCatalogPage() {
  const [filteredProducts, setFilteredProducts] = useState(() => getMergedProducts());
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "staff";

  const handleResetAll = () => {
    if (window.confirm("Bạn có chắc muốn khôi phục tất cả sản phẩm về mặc định không?")) {
      localStorage.removeItem("productOverrides");
      setFilteredProducts(mockProducts);
      window.location.reload();
    }
  };

  const handleFilterChange = (filters) => {
    const { searchTerm, categories, priceRange, ratings } = filters;
    // Lọc trên danh sách đã merge override
    const merged = getMergedProducts();
    const result = merged.filter((product) => {
      const matchSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchCategory =
        categories.length === 0 || categories.includes(product.category);

      const matchPrice =
        product.price >= priceRange.min && product.price <= priceRange.max;

      const matchRating =
        ratings.length === 0 || ratings.includes(product.rating);

      return matchSearch && matchCategory && matchPrice && matchRating;
    });

    setFilteredProducts(result);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
      <SidebarFilter onFilterChange={handleFilterChange} />

      <div className="flex-1">
        <div className="mb-6 bg-white p-4 rounded-xl border border-gray-100 flex justify-between items-center">
          <h2 className="text-gray-600 font-medium text-sm">
            Showing{" "}
            <span className="font-bold text-[#008B8B]">
              {filteredProducts.length}
            </span>{" "}
            results
          </h2>
          {isAdmin && (
            <button
              onClick={handleResetAll}
              className="text-sm px-4 py-2 bg-red-50 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors"
            >
              Khôi phục tất cả sản phẩm
            </button>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {/* Ghi chú phải được đặt bên trong thẻ div mới hợp lệ cú pháp */}
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
            <div className="w-24 h-24 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Không tìm thấy sản phẩm nào!
            </h3>
            <p className="text-gray-500">
              Vui lòng thử thay đổi bộ lọc, khoảng giá hoặc từ khóa tìm kiếm.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
