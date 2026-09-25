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
  GitCompare,
  ChevronLeft,
} from "lucide-react";
import mockProducts from "../data/mockProducts";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  // States cho các tương tác UI
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("S");
  const [selectedColor, setSelectedColor] = useState("Green");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Mảng dữ liệu giả lập cho giao diện chuẩn thực tế
  const sizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const colors = [
    { name: "Green", class: "bg-teal-500" },
    { name: "Blue", class: "bg-blue-400" },
    { name: "Yellow", class: "bg-yellow-400" },
    { name: "Red", class: "bg-red-400" },
  ];

  useEffect(() => {
    const foundProduct = mockProducts.find((p) => p.id === parseInt(id));
    setProduct(foundProduct);
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = currentCart.findIndex(
      (item) => item.id === product.id,
    );

    if (existingItemIndex !== -1) {
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      currentCart.push({
        ...product,
        quantity: quantity,
        selectedSize,
        selectedColor,
      });
    }

    localStorage.setItem("cart", JSON.stringify(currentCart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
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
        <span className="text-gray-400">Product Details</span>
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
              <button className="absolute left-4 w-10 h-10 bg-white/70 hover:bg-white text-gray-700 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronLeft size={20} />
              </button>

              <img
                src={product.image_url}
                alt={product.name}
                className="max-w-full max-h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
              />

              <button className="absolute right-4 w-10 h-10 bg-white/70 hover:bg-white text-gray-700 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* ================= CỘT PHẢI: CHI TIẾT SẢN PHẨM ================= */}
          <div className="w-full lg:w-5/12 bg-white rounded-3xl p-8 lg:p-10 border border-gray-100 shadow-sm flex flex-col">
            {/* Tags: SALES & NEW ARRIVAL */}
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#e83e3e] text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                Sales
              </span>
              <span className="text-blue-500 text-xs font-bold uppercase tracking-wider">
                New Arrival
              </span>
            </div>

            {/* Tên sản phẩm & Nút Wishlist */}
            <div className="flex justify-between items-start gap-4 mb-3">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <button className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                <Heart size={20} />
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
                ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Giá tiền & Badge giảm giá */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-gray-900">
                ${Number(product.price).toFixed(2)}
              </span>
              <span className="text-xl text-gray-400 line-through">
                ${Number(product.originalPrice).toFixed(2)}
              </span>
              <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded">
                {product.discountPercentage}% OFF
              </span>
            </div>

            <hr className="border-gray-100 mb-6" />

            {/* Chọn Màu sắc */}
            <div className="mb-6">
              <p className="text-sm text-gray-700 mb-3">
                Color:{" "}
                <span className="font-medium text-gray-900">
                  {selectedColor}
                </span>
              </p>
              <div className="flex gap-3">
                {colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center p-0.5 transition-all ${
                      selectedColor === color.name
                        ? "border-gray-400"
                        : "border-transparent"
                    }`}
                  >
                    <div
                      className={`w-full h-full rounded-full border border-gray-200 ${color.class}`}
                    ></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chọn Kích thước */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-gray-700">
                  Size:{" "}
                  <span className="font-medium text-gray-900">
                    {selectedSize}
                  </span>
                </p>
                <button className="text-sm text-gray-500 hover:text-[#008B8B] underline decoration-gray-300 underline-offset-4">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[3rem] px-3 h-10 rounded-full text-sm font-medium border transition-colors ${
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
              <p className="text-sm font-medium text-gray-700 mb-3">
                Quantity:
              </p>
              <div className="flex flex-wrap gap-4">
                {/* Tăng giảm số lượng */}
                <div className="flex items-center justify-between border border-gray-200 rounded-full h-12 w-32 px-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black rounded-full"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-semibold text-gray-800">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black rounded-full"
                  >
                    <Plus size={18} />
                  </button>
                </div>

                {/* Nút Buy Now (Vàng) */}
                <button
                  onClick={() => alert("Chuyển đến trang thanh toán ngay!")}
                  className="flex-1 min-w-[140px] h-12 bg-[#ffb800] text-gray-900 rounded-full font-bold hover:bg-[#e5a600] transition-colors shadow-sm"
                >
                  Buy Now
                </button>

                {/* Nút Add to Cart (Xanh) */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[140px] h-12 bg-[#008B8B] text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#007777] transition-colors shadow-sm"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>
              </div>
            </div>

            <hr className="border-gray-100 mb-6" />

            {/* Các nút Share / Compare */}
            <div className="flex items-center gap-6 mb-6">
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#008B8B] transition-colors">
                <Share2 size={16} /> Share
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#008B8B] transition-colors">
                <GitCompare size={16} /> Compare
              </button>
            </div>

            {/* Thông tin Meta: Giao hàng, SKU, Categories */}
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-900">
                  Free Shipping:
                </span>{" "}
                Estimated Delivery Time 5-7 Days
              </p>
              <p>
                <span className="font-medium text-gray-900">SKU:</span> SKU-00
                {product.id}
              </p>
              <p>
                <span className="font-medium text-gray-900">Categories:</span>{" "}
                Electronics, Computers, Accessories
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
