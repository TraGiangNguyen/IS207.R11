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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
