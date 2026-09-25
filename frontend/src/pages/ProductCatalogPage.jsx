import { useState, useEffect } from "react";
import SidebarFilter from "../components/Sidebar/SidebarFilter";
import ProductGrid from "../components/product/ProductGrid";
import mockProducts from "../data/mockProducts";

export default function ProductCatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState([0, 100]);

  useEffect(() => {
    setProducts(mockProducts);
    setLoading(false);
  }, []);

  if (loading)
    return (
      <div className="p-8 text-center text-gray-500 text-lg">
        Đang tải trang sản phẩm...
      </div>
    );

  return (
    <div className="p-8">
      <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-8">
        {/* Bộ lọc bên trái */}
        <SidebarFilter setPriceRange={setPriceRange} priceRange={priceRange} />

        {/* Lưới sản phẩm bên phải chiếm phần không gian còn lại */}
        <div className="flex-1 w-full">
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
