import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Star,
  Heart,
  Minus,
  Plus,
  ChevronRight,
  Home,
  Share2,
  ChevronLeft,
  Check,
} from "lucide-react";
import mockProducts from "../data/mockProducts";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  // States cho các tương tác UI
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("30ml");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Wishlist state — persist to localStorage
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Toast notification state
  const [toast, setToast] = useState(null); // { msg, type }

  // Danh sách dung tích (ml) thay cho size quần áo
  const sizes = ["15ml", "30ml", "50ml", "100ml", "150ml", "200ml"];

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const base = mockProducts.find((p) => p.id === parseInt(id));
    if (!base) return;

    // Merge với override của admin (nếu có) để đồng bộ chỉnh sửa
    try {
      const overrides = JSON.parse(localStorage.getItem("productOverrides")) || {};
      setProduct({ ...base, ...(overrides[base.id] || {}) });
    } catch {
      setProduct(base);
    }

    // Load wishlist state từ localStorage
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setIsWishlisted(wishlist.includes(base.id));
  }, [id]);

  // ── Wishlist toggle ──
  const handleToggleWishlist = () => {
    if (!product) return;
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    let updated;
    if (isWishlisted) {
      updated = wishlist.filter((wid) => wid !== product.id);
      showToast("Đã xóa khỏi danh sách yêu thích.");
    } else {
      updated = [...wishlist, product.id];
      showToast("Đã thêm vào danh sách yêu thích! ♥");
    }
    localStorage.setItem("wishlist", JSON.stringify(updated));
    setIsWishlisted(!isWishlisted);
  };

  // ── Add to Cart — dùng key "cartItems" để đồng bộ với CartPage & Header ──
  const handleAddToCart = () => {
    if (!product) return;
    const currentCart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const existingItemIndex = currentCart.findIndex(
      (item) => item.id === product.id && item.selectedSize === selectedSize,
    );

    if (existingItemIndex !== -1) {
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      currentCart.push({
        ...product,
        quantity: quantity,
        selectedSize,
      });
    }

    localStorage.setItem("cartItems", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdated"));
    showToast(`Đã thêm ${quantity} sản phẩm (${selectedSize}) vào giỏ hàng!`);
  };

  // ── Share — copy URL to clipboard ──
  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("Đã sao chép liên kết sản phẩm!");
    } catch {
      showToast("Không thể sao chép liên kết.", "error");
    }
  };

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-xl text-gray-500">Đang tải thông tin sản phẩm...</p>
      </div>
    );
  }

  // Mảng ảnh thumbnail giả lập (do dữ liệu gốc chỉ có 1 ảnh)
  const galleryImages = Array(5).fill(product.image_url);

  const formatPrice = (n) => `$${Number(n).toFixed(2)}`;

  return (
    <div className="bg-[#fafafa] min-h-screen pb-16 font-sans">
      {/* 1. Breadcrumb */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-5 flex items-center gap-2 text-sm text-gray-500">
        <button
          onClick={() => navigate("/")}
          className="hover:text-[#008B8B] flex items-center gap-1"
        >
          <Home size={16} /> Home
        </button>
        <ChevronRight size={14} className="text-gray-400" />
        <span
          className="hover:text-[#008B8B] cursor-pointer"
          onClick={() => navigate("/products")}
        >
          {product.category}
        </span>
        <ChevronRight size={14} className="text-gray-400" />
        <span className="text-gray-800 font-medium truncate max-w-[200px]">{product.name}</span>
      </div>

      {/* 2. Main Content Grid */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* ================= CỘT TRÁI: GALLERY ================= */}
          <div className="w-full lg:w-7/12 flex gap-4 h-[600px]">
            {/* Cột Thumbnails (Ẩn trên mobile) */}
            <div className="hidden md:flex flex-col gap-3 w-24 overflow-y-auto pr-1 custom-scrollbar">
              {galleryImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-full aspect-square rounded-xl border-2 p-1 bg-white overflow-hidden transition-all ${
                    activeImageIndex === index
                      ? "border-[#008B8B]"
                      : "border-transparent hover:border-gray-200"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumb ${index}`}
                    className="w-full h-full object-contain"
                  />
                </button>
              ))}
            </div>

            {/* Ảnh chính to */}
            <div className="flex-1 bg-[#C3ADA1] rounded-[2rem] relative flex items-center justify-center p-8 overflow-hidden group shadow-inner">
              <button
                onClick={() => setActiveImageIndex((i) => Math.max(0, i - 1))}
                className="absolute left-4 w-10 h-10 bg-white/70 hover:bg-white text-gray-700 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={20} />
              </button>

              <img
                src={product.image_url}
                alt={product.name}
                className="max-w-full max-h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />

              <button
                onClick={() => setActiveImageIndex((i) => Math.min(galleryImages.length - 1, i + 1))}
                className="absolute right-4 w-10 h-10 bg-white/70 hover:bg-white text-gray-700 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* ================= CỘT PHẢI: CHI TIẾT SẢN PHẨM ================= */}
          <div className="w-full lg:w-5/12 bg-white rounded-3xl p-8 lg:p-10 border border-gray-100 shadow-sm flex flex-col">
            {/* Tags: SALES & NEW ARRIVAL */}
            <div className="flex items-center gap-3 mb-4">
              {product.discountPercentage > 0 && (
                <span className="bg-[#e83e3e] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  Sale -{product.discountPercentage}%
                </span>
              )}
              <span className="text-blue-500 text-xs font-bold uppercase tracking-wider">
                New Arrival
              </span>
            </div>

            {/* Tên sản phẩm & Nút Wishlist */}
            <div className="flex justify-between items-start gap-4 mb-3">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <button
                onClick={handleToggleWishlist}
                title={isWishlisted ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
                className={`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full border transition-all ${
                  isWishlisted
                    ? "border-red-400 bg-red-50 text-red-500"
                    : "border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-300"
                }`}
              >
                <Heart
                  size={20}
                  className={isWishlisted ? "fill-red-500" : ""}
                />
              </button>
            </div>

            {/* Đánh giá */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={
                      i < product.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200 fill-gray-200"
                    }
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({product.reviewCount} đánh giá)
              </span>
            </div>

            {/* Giá tiền & Badge giảm giá */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <hr className="border-gray-100 mb-6" />

            {/* Chọn dung tích (ml) */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-gray-700">
                  Dung tích:{" "}
                  <span className="font-semibold text-gray-900">{selectedSize}</span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[4rem] px-3 h-10 rounded-full text-sm font-medium border transition-colors ${
                      selectedSize === size
                        ? "bg-[#008B8B] border-[#008B8B] text-white"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Chọn số lượng & Nút Mua */}
            <div className="mb-8">
              <p className="text-sm font-medium text-gray-700 mb-3">Số lượng:</p>
              <div className="flex flex-wrap gap-4">
                {/* Tăng giảm số lượng */}
                <div className="flex items-center justify-between border border-gray-200 rounded-full h-12 w-32 px-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black rounded-full"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-semibold text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black rounded-full"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Nút Buy Now (Vàng) */}
                <button
                  onClick={() => {
                    handleAddToCart();
                    navigate("/cart");
                  }}
                  className="flex-1 min-w-[140px] h-12 bg-[#ffb800] text-gray-900 rounded-full font-bold hover:bg-[#e5a600] transition-colors shadow-sm"
                >
                  Mua ngay
                </button>

                {/* Nút Add to Cart (Xanh) */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[140px] h-12 bg-[#008B8B] text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#007777] transition-colors shadow-sm"
                >
                  <ShoppingCart size={18} />
                  Thêm vào giỏ
                </button>
              </div>
            </div>

            <hr className="border-gray-100 mb-6" />

            {/* Nút Share */}
            <div className="flex items-center gap-6 mb-6">
              <button
                onClick={handleShare}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#008B8B] transition-colors"
              >
                <Share2 size={16} /> Chia sẻ
              </button>
            </div>

            {/* Thông tin Meta */}
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-900">Giao hàng miễn phí:</span>{" "}
                Dự kiến 3–5 ngày làm việc
              </p>
              <p>
                <span className="font-medium text-gray-900">SKU:</span> BP-
                {String(product.id).padStart(4, "0")}
              </p>
              <p>
                <span className="font-medium text-gray-900">Danh mục:</span>{" "}
                {product.category}
              </p>
              <p>
                <span className="font-medium text-gray-900">Tình trạng:</span>{" "}
                {product.inStock ? (
                  <span className="text-green-600 font-semibold">✓ Còn hàng</span>
                ) : (
                  <span className="text-red-500 font-semibold">Hết hàng</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium transition-all ${
            toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-gray-900 text-white"
          }`}
        >
          <Check size={16} className={toast.type === "error" ? "text-red-200" : "text-green-400"} />
          {toast.msg}
        </div>
      )}
    </div>
  );
}
