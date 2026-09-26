import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 w-full bg-white rounded-2xl border border-gray-100">
        <p className="text-lg font-medium text-gray-700">
          Không tìm thấy sản phẩm nào phù hợp.
        </p>
        <p className="text-sm mt-1">Vui lòng thử thay đổi bộ lọc.</p>
      </div>
    );
  }

  return (
    // SỬ DỤNG AUTO-FILL MINMAX: Tối ưu hiển thị responsive đa màn hình
    <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 sm:gap-6 w-full">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
