import { ShoppingCart, Heart, Star } from "lucide-react";

export default function ProductCard({ product }) {
  const formattedPrice = (price) => `$${(price / 1000).toFixed(2)}`;

  return (
    <div className="border border-gray-100 rounded-2xl p-4 bg-white space-y-3 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group">
      <div className="absolute top-3 left-3 bg-[#008B8B] text-white text-xs font-bold px-3 py-1 rounded-full z-10">
        {product.discountPercentage}% OFF
      </div>

      <div className="aspect-square bg-[#F4F6F6] rounded-xl flex items-center justify-center p-6 relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
        />
      </div>

      <h3 className="text-lg font-medium text-gray-900 line-clamp-2 min-h-[56px]">
        {product.name}
      </h3>

      <div className="flex items-center gap-1">
        <Star size={16} className="text-yellow-400 fill-yellow-400" />
        <Star size={16} className="text-yellow-400 fill-yellow-400" />
        <Star size={16} className="text-yellow-400 fill-yellow-400" />
        <Star size={16} className="text-yellow-400 fill-yellow-400" />
        <Star size={16} className="text-yellow-400 fill-yellow-400" />
        <span className="text-sm text-gray-400 ml-1">
          ({product.reviewCount})
        </span>
      </div>

      <div className="flex items-end justify-between gap-2 pt-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xl font-bold text-[#008B8B]">
            {formattedPrice(product.price)}
          </span>
          <span className="text-sm text-gray-400 line-through">
            {formattedPrice(product.originalPrice)}
          </span>
          <span className="text-sm text-gray-400">
            {product.discountPercentage}% OFF
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-3">
        <button className="p-3 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors">
          <Heart size={20} />
        </button>
        <button className="flex-1 flex items-center justify-center gap-2.5 py-3.5 bg-[#008B8B] text-white rounded-lg font-medium hover:bg-[#007777] transition-colors text-base">
          <ShoppingCart size={20} />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
