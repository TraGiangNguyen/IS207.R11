import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const formattedPrice = (price) => `$${Number(price).toFixed(2)}`;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = currentCart.findIndex(
      (item) => item.id === product.id,
    );

    if (existingItemIndex !== -1) {
      currentCart[existingItemIndex].quantity += 1;
    } else {
      currentCart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert(`Đã thêm "${product.name}" vào giỏ hàng thành công!`);
  };

  return (
    <div className="border border-gray-100 rounded-2xl p-4 bg-white space-y-3 shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden group flex flex-col h-full">
      <div className="absolute top-3 left-3 bg-[#008B8B] text-white text-xs font-bold px-3 py-1 rounded-full z-10">
        {product.discountPercentage}% OFF
      </div>

      <div
        className="aspect-square bg-[#F4F6F6] rounded-xl flex items-center justify-center p-4 sm:p-6 relative cursor-pointer"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <img
          src={product.image_url}
          alt={product.name}
          className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
        />
      </div>

      {/* Tự động đẩy nội dung xuống dưới để các card cao bằng nhau */}
      <div className="flex flex-col flex-1">
        <h3
          className="text-base sm:text-lg font-medium text-gray-900 line-clamp-2 min-h-[48px] sm:min-h-[56px] cursor-pointer hover:text-[#008B8B] transition-colors mb-2"
          onClick={() => navigate(`/products/${product.id}`)}
          title={product.name}
        >
          {product.name}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < product.rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-200 fill-gray-200"
              }
            />
          ))}
          <span className="text-xs sm:text-sm text-gray-400 ml-1">
            ({product.reviewCount})
          </span>
        </div>

        <div className="flex items-end gap-1.5 flex-wrap mt-auto">
          <span className="text-lg sm:text-xl font-bold text-[#008B8B]">
            {formattedPrice(product.price)}
          </span>
          <span className="text-xs sm:text-sm text-gray-400 line-through mb-0.5">
            {formattedPrice(product.originalPrice)}
          </span>
        </div>
      </div>

      {/* Cấu hình lại nhóm nút bấm để không bao giờ bị vỡ nát */}
      <div className="flex items-center gap-2 pt-3 mt-auto">
        <button className="p-2.5 sm:p-3 bg-white border border-gray-100 rounded-lg text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors shrink-0">
          <Heart size={18} />
        </button>
        <button
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-2 bg-[#008B8B] text-white rounded-lg font-medium hover:bg-[#007777] transition-colors text-sm sm:text-base whitespace-nowrap overflow-hidden"
        >
          <ShoppingCart size={18} className="shrink-0" />
          <span className="truncate">Add to Cart</span>
        </button>
      </div>
    </div>
  );
}
