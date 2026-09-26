import { useState, useEffect } from "react";
import SidebarFilter from "../components/Sidebar/SidebarFilter";
import ProductGrid from "../components/product/ProductGrid";
import mockProducts from "../data/mockProducts";

export default function ProductCatalogPage() {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFilteredProducts(mockProducts);
    setLoading(false);
  }, []);

  const handleFilterChange = (filters) => {
    let result = [...mockProducts];

    if (filters.searchTerm) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(filters.searchTerm.toLowerCase()),
      );
    }
    if (filters.priceRange) {
      result = result.filter(
        (p) =>
          p.price >= filters.priceRange.min &&
          p.price <= filters.priceRange.max,
      );
    }
    if (filters.categories && filters.categories.length > 0) {
      result = result.filter((p) => filters.categories.includes(p.category));
    }
    if (filters.ratings && filters.ratings.length > 0) {
      result = result.filter((p) => filters.ratings.includes(p.rating));
    }

    setFilteredProducts(result);
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500 text-lg flex items-center justify-center min-h-screen">
        Đang tải trang sản phẩm...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-[#f8f9fa] min-h-screen">
      {/* Giao diện Web (>=lg): Thanh search/filter nằm bên cạnh trái. Giao diện Mobile (<lg): Nằm bên trên */}
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
        <SidebarFilter onFilterChange={handleFilterChange} />

        <div className="flex-1 w-full min-w-0 space-y-6">
          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-gray-100">
            <span className="text-gray-600 font-medium">
              Showing {filteredProducts.length} results
            </span>
          </div>

          <ProductGrid products={filteredProducts} />
        </div>
      </div>
    </div>
  );
}
