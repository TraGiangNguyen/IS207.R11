import ProductCard from "./ProductCard";

export default function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,260px)] gap-6 justify-center md:justify-start">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
