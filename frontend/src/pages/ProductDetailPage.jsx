import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Star,
  StarHalf,
  TrendingUp,
  Package,
  BarChart2,
  Award,
  Download,
  Edit3,
  ThumbsUp,
  ThumbsDown,
  Share2,
  ShieldCheck,
  Tag,
  Check,
  X,
} from "lucide-react";
import mockProducts from "../data/mockProducts";

/* ─── Mock analytics data ─── */
const mockReviews = [
  {
    id: 1,
    author: "Nguyễn Minh Anh",
    avatar: "NM",
    rating: 5,
    date: "20/09/2026",
    content: "Sản phẩm tuyệt vời, dùng rất hiệu quả! Da sáng lên rõ rệt sau 3 tuần.",
    helpful: 24,
    verified: true,
  },
  {
    id: 2,
    author: "Trần Thị Bảo Châu",
    avatar: "TB",
    rating: 5,
    date: "15/09/2026",
    content: "Hàng đúng như mô tả, đóng gói cẩn thận. Giao hàng nhanh hơn dự kiến.",
    helpful: 18,
    verified: true,
  },
  {
    id: 3,
    author: "Lê Hoàng Nam",
    avatar: "LH",
    rating: 4,
    date: "10/09/2026",
    content: "Chưa thấy rõ hiệu quả sau 1 tuần nhưng da không bị kích ứng. Sẽ cập nhật thêm.",
    helpful: 9,
    verified: false,
  },
  {
    id: 4,
    author: "Phạm Quỳnh Như",
    avatar: "PQ",
    rating: 5,
    date: "05/09/2026",
    content: "Lần thứ 3 mua rồi. Da dầu nhạy cảm dùng không bị nổi mụn hay kích ứng gì.",
    helpful: 41,
    verified: true,
  },
];

const avatarColors = ["#008B8B", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ec4899"];

const ratingDist = [
  { star: 5, pct: 68, count: 1285 },
  { star: 4, pct: 20, count: 379 },
  { star: 3, pct: 7,  count: 132 },
  { star: 2, pct: 3,  count: 57  },
  { star: 1, pct: 2,  count: 38  },
];

/* ─── Helpers ─── */
function RatingStars({ rating, size = 14 }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={`f${i}`} size={size} className="text-yellow-400 fill-yellow-400" />
      ))}
      {half && <StarHalf size={size} className="text-yellow-400 fill-yellow-400" />}
      {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => (
        <Star key={`e${i}`} size={size} className="text-gray-200 fill-gray-200" />
      ))}
    </div>
  );
}

function Avatar({ initials, color }) {
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, sub, color = "bg-teal-50", iconColor = "text-[#008B8B]" }) {
  return (
    <div className={`${color} rounded-2xl p-4 flex items-start gap-3`}>
      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
        <Icon size={20} className={iconColor} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-xl font-extrabold text-gray-900 leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

/* ─── Main Component ─── */
export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find((p) => p.id === Number(id));

  const [activeTab, setActiveTab] = useState("overview");
  const [helpfulMap, setHelpfulMap] = useState({});
  const [toast, setToast] = useState(null);       // { msg, type }
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState(null);  // populated on open

  /* ── Helpers ── */
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Share handler ── */
  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Đã sao chép liên kết vào clipboard!");
    } catch {
      showToast("Không thể sao chép liên kết.", "error");
    }
  };

  /* ── Export CSV handler ── */
  const handleExport = () => {
    if (!product) return;
    const totalSoldLocal = product.reviewCount * 8;
    const totalRevenueLocal = totalSoldLocal * product.price;
    const rows = [
      ["Trường", "Giá trị"],
      ["Tên sản phẩm", product.name],
      ["Mã SKU", `BP-${String(product.id).padStart(4, "0")}`],
      ["Danh mục", product.category],
      ["Giá bán (VND)", product.price],
      ["Giá gốc (VND)", product.originalPrice],
      ["Giảm giá (%)", product.discountPercentage],
      ["Rating", `${product.rating}/5`],
      ["Số đánh giá", product.reviewCount],
      ["Tổng đã bán", totalSoldLocal],
      ["Tổng doanh thu (VND)", totalRevenueLocal],
      ["Trạng thái", product.inStock ? "Còn hàng" : "Hết hàng"],
      ["Màu sắc", product.color || "—"],
      ["Ngày xuất báo cáo", new Date().toLocaleDateString("vi-VN")],
    ];
    const csv = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `baocao_${product.name.replace(/\s+/g, "_")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Đã xuất báo cáo CSV thành công!");
  };

  /* ── Open edit modal ── */
  const handleOpenEdit = () => {
    setEditForm({
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discountPercentage: product.discountPercentage,
      category: product.category,
      inStock: product.inStock,
    });
    setShowEdit(true);
  };

  const handleSaveEdit = () => {
    // In a real app this would call an API. For now just show toast.
    setShowEdit(false);
    showToast("Đã lưu thay đổi thành công! (mock)");
  };

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-gray-400">
        <Package size={64} className="mb-4 opacity-30" />
        <p className="text-xl font-medium">Không tìm thấy sản phẩm</p>
        <button
          onClick={() => navigate("/products")}
          className="mt-6 px-6 py-2.5 bg-[#008B8B] text-white rounded-xl font-medium hover:bg-[#007777] transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const formatVND = (n) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(n);

  const related = mockProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const tabs = [
    { key: "overview", label: "Tổng quan" },
    { key: "ingredients", label: "Thành phần" },
    { key: "reviews", label: `Đánh giá (${product.reviewCount})` },
  ];

  /* mock sales numbers derived from price & reviewCount */
  const totalSold   = product.reviewCount * 8;
  const totalRevenue = totalSold * product.price;
  const rankInCat   = Math.ceil(Math.random() * 5) || 2; // stable-ish mock

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* ── Breadcrumb / Top bar ── */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <button
              onClick={() => navigate("/products")}
              className="flex items-center gap-1.5 hover:text-[#008B8B] transition-colors font-medium"
            >
              <ChevronLeft size={16} />
              Danh sách sản phẩm
            </button>
            <span>/</span>
            <span className="text-gray-400">{product.category}</span>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate max-w-xs">{product.name}</span>
          </div>

          {/* Admin action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:border-[#008B8B] hover:text-[#008B8B] transition-colors bg-white"
            >
              <Share2 size={15} />
              Chia sẻ
            </button>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:border-[#008B8B] hover:text-[#008B8B] transition-colors bg-white"
            >
              <Download size={15} />
              Xuất báo cáo
            </button>
            <button
              onClick={handleOpenEdit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#008B8B] text-white text-sm font-semibold hover:bg-[#007777] transition-colors shadow-sm"
            >
              <Edit3 size={15} />
              Chỉnh sửa
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">

        {/* ── Hero section ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Image (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-white rounded-2xl p-8 flex items-center justify-center aspect-square border border-gray-100 shadow-sm relative overflow-hidden group">
              {product.discountPercentage > 0 && (
                <span className="absolute top-4 left-4 bg-[#008B8B] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  -{product.discountPercentage}% OFF
                </span>
              )}
              {product.inStock ? (
                <span className="absolute top-4 right-4 bg-green-50 text-green-600 border border-green-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                  ✓ Còn hàng
                </span>
              ) : (
                <span className="absolute top-4 right-4 bg-red-50 text-red-500 border border-red-200 text-xs font-semibold px-2.5 py-1 rounded-full">
                  Hết hàng
                </span>
              )}
              <img
                src={product.image_url}
                alt={product.name}
                className="max-w-full max-h-[320px] object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Thumbnail strip */}
            <div className="flex gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-[23%] aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-colors ${
                    i === 0 ? "border-[#008B8B]" : "border-gray-100 hover:border-[#008B8B]"
                  } bg-white flex items-center justify-center p-1`}
                >
                  <img src={product.image_url} alt="" className="max-w-full max-h-full object-contain" />
                </div>
              ))}
            </div>
          </div>

          {/* Info panel (3 cols) */}
          <div className="lg:col-span-3 space-y-5">
            {/* Badges row */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold bg-[#e0f7f5] text-[#008B8B] px-3 py-1.5 rounded-full uppercase tracking-wide">
                {product.category}
              </span>
              {product.discountPercentage > 0 && (
                <span className="text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full">
                  <Tag size={11} className="inline mr-1" />
                  Đang giảm giá {product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Name */}
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">CHI TIẾT SẢN PHẨM</p>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 leading-snug">
                {product.name}
              </h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3 flex-wrap">
              <RatingStars rating={product.rating} size={18} />
              <span className="font-bold text-gray-800">{product.rating}.0 / 5.0</span>
              <span className="text-gray-400 text-sm">({product.reviewCount} đánh giá)</span>
            </div>

            {/* Price block */}
            <div className="bg-gradient-to-r from-[#e0f7f5] to-white rounded-2xl p-5 border border-[#008B8B]/10">
              <div className="flex items-end gap-3 flex-wrap">
                <span className="text-3xl font-extrabold text-[#008B8B]">
                  {formatVND(product.price)}
                </span>
                {product.originalPrice !== product.price && (
                  <span className="text-base text-gray-400 line-through">
                    {formatVND(product.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1.5">
                Giá niêm yết · Cập nhật lần cuối: 01/09/2026
              </p>
            </div>

            {/* KPI row */}
            <div className="grid grid-cols-3 gap-3">
              <KpiCard
                icon={TrendingUp}
                label="Đã bán"
                value={totalSold.toLocaleString("vi-VN")}
                sub="sản phẩm"
                color="bg-teal-50"
                iconColor="text-[#008B8B]"
              />
              <KpiCard
                icon={BarChart2}
                label="Doanh thu"
                value={`${(totalRevenue / 1_000_000).toFixed(0)}M ₫`}
                sub="tổng tích lũy"
                color="bg-blue-50"
                iconColor="text-blue-500"
              />
              <KpiCard
                icon={Award}
                label="Xếp hạng"
                value={`#${rankInCat}`}
                sub={`trong ${product.category}`}
                color="bg-amber-50"
                iconColor="text-amber-500"
              />
            </div>

            {/* SKU / Meta info */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: "Mã SKU", value: `BP-${String(product.id).padStart(4, "0")}` },
                { label: "Danh mục", value: product.category },
                { label: "Trạng thái", value: product.inStock ? "Còn hàng" : "Hết hàng" },
                { label: "Màu sắc", value: product.color || "—" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-gray-100">
                  <span className="text-gray-400 text-xs font-medium w-20 flex-shrink-0">{label}</span>
                  <span className="font-semibold text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex border-b border-gray-100 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === t.key
                    ? "border-[#008B8B] text-[#008B8B]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-6">

            {/* Tab: Tổng quan */}
            {activeTab === "overview" && (
              <div className="space-y-8">

                {/* Description */}
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-3">Mô tả sản phẩm</h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    <strong>{product.name}</strong> là sản phẩm thuộc danh mục {product.category},
                    được phân phối chính thức qua kênh BeautyPals. Sản phẩm nhận được phản hồi tích
                    cực từ khách hàng với điểm đánh giá trung bình {product.rating}.0/5.0 từ{" "}
                    {product.reviewCount} lượt review xác thực. Công thức được kiểm định bởi
                    chuyên gia da liễu, an toàn cho da nhạy cảm.
                  </p>
                </div>

                {/* Sales performance */}
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-3">Hiệu suất bán hàng</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Doanh số tháng này", value: Math.floor(totalSold * 0.12).toLocaleString("vi-VN"), unit: "sản phẩm", trend: "+12%" },
                      { label: "Doanh thu tháng này", value: `${(totalRevenue * 0.12 / 1_000_000).toFixed(0)}M`, unit: "₫", trend: "+8%" },
                      { label: "Tỷ lệ hài lòng", value: "94%", unit: "", trend: "+2%" },
                      { label: "Tỷ lệ mua lại", value: "67%", unit: "", trend: "+5%" },
                    ].map(({ label, value, unit, trend }) => (
                      <div key={label} className="bg-gray-50 rounded-xl p-4 space-y-1">
                        <p className="text-xs text-gray-500">{label}</p>
                        <p className="text-xl font-extrabold text-gray-900">
                          {value}<span className="text-sm font-medium text-gray-400 ml-1">{unit}</span>
                        </p>
                        <p className="text-xs text-green-500 font-semibold">{trend} so với tháng trước</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating snapshot */}
                <div>
                  <h3 className="font-bold text-gray-900 text-base mb-3">Phân bổ đánh giá</h3>
                  <div className="flex flex-col sm:flex-row gap-6 items-start">
                    <div className="flex flex-col items-center gap-1 min-w-[100px]">
                      <span className="text-5xl font-extrabold text-gray-900">{product.rating}.0</span>
                      <RatingStars rating={product.rating} size={18} />
                      <span className="text-xs text-gray-400">{product.reviewCount} đánh giá</span>
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                      {ratingDist.map(({ star, pct, count }) => (
                        <div key={star} className="flex items-center gap-3 text-sm">
                          <span className="text-gray-600 w-6 text-right font-medium">{star}★</span>
                          <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-yellow-400 transition-all duration-700"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-gray-500 w-24 text-right">
                            {pct}% <span className="text-gray-300">({count})</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Thành phần */}
            {activeTab === "ingredients" && (
              <div className="space-y-5">
                <h3 className="font-bold text-gray-900 text-base">Thành phần (Full Ingredients List)</h3>
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-left">
                        <th className="px-4 py-3 font-semibold text-gray-600">Thành phần</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Tên INCI</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Vai trò</th>
                        <th className="px-4 py-3 font-semibold text-gray-600">Phân loại</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {[
                        { name: "Nước", inci: "Aqua (Water)", role: "Dung môi nền cấp ẩm", badge: "Nền", color: "bg-gray-100 text-gray-600" },
                        { name: "Vitamin C 15%", inci: "Ascorbic Acid", role: "Chống oxy hóa, làm sáng da", badge: "Hoạt chất chính", color: "bg-amber-100 text-amber-700" },
                        { name: "Niacinamide", inci: "Niacinamide (Vit B3)", role: "Thu nhỏ lỗ chân lông, mờ thâm", badge: "Dưỡng sáng", color: "bg-teal-100 text-teal-700" },
                        { name: "Hyaluronic Acid", inci: "Sodium Hyaluronate", role: "Cấp ẩm đa tầng chuyên sâu", badge: "Cấp ẩm", color: "bg-blue-100 text-blue-700" },
                        { name: "Glycerin", inci: "Glycerin", role: "Giữ ẩm, làm mềm da", badge: "Cấp ẩm", color: "bg-blue-100 text-blue-700" },
                        { name: "Vitamin E", inci: "Tocopherol", role: "Chống oxy hóa, bảo vệ tế bào", badge: "Bảo vệ", color: "bg-green-100 text-green-700" },
                        { name: "Ferulic Acid", inci: "Ferulic Acid", role: "Tăng cường hiệu quả Vitamin C+E", badge: "Bảo vệ", color: "bg-green-100 text-green-700" },
                      ].map((item) => (
                        <tr key={item.name} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900">{item.name}</td>
                          <td className="px-4 py-3 text-gray-500 italic text-xs">{item.inci}</td>
                          <td className="px-4 py-3 text-gray-500 text-xs">{item.role}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${item.color}`}>
                              {item.badge}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl p-4 text-sm">
                  <ShieldCheck size={18} className="text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="text-green-700">
                    <strong>Cam kết an toàn:</strong> Không Paraben · Không Sulfate · Không cồn khô ·
                    Không hương liệu nhân tạo · Dermatologist tested
                  </p>
                </div>
              </div>
            )}

            {/* Tab: Đánh giá */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 text-base">Tổng hợp đánh giá từ khách hàng</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span className="text-green-500 font-semibold">
                      {ratingDist[0].pct + ratingDist[1].pct}% hài lòng
                    </span>
                    · {product.reviewCount} đánh giá
                  </div>
                </div>

                <div className="space-y-4">
                  {mockReviews.map((review, idx) => (
                    <div
                      key={review.id}
                      className="border border-gray-100 rounded-xl p-5 space-y-2.5 bg-white hover:border-[#008B8B]/20 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar
                          initials={review.avatar}
                          color={avatarColors[idx % avatarColors.length]}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-900 text-sm">{review.author}</span>
                            {review.verified && (
                              <span className="text-xs bg-green-50 text-green-600 border border-green-200 px-2 py-0.5 rounded-full">
                                ✓ Đã mua hàng
                              </span>
                            )}
                            <span className="text-xs text-gray-400 ml-auto">{review.date}</span>
                          </div>
                          <RatingStars rating={review.rating} size={13} />
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed pl-12">{review.content}</p>
                      <div className="flex items-center gap-3 pl-12 text-xs text-gray-400">
                        <button
                          onClick={() =>
                            setHelpfulMap((p) => ({ ...p, [review.id]: !p[review.id] }))
                          }
                          className={`flex items-center gap-1 transition-colors ${
                            helpfulMap[review.id] ? "text-[#008B8B]" : "hover:text-gray-600"
                          }`}
                        >
                          <ThumbsUp size={13} />
                          Hữu ích ({review.helpful + (helpfulMap[review.id] ? 1 : 0)})
                        </button>
                        <button className="flex items-center gap-1 hover:text-gray-600 transition-colors">
                          <ThumbsDown size={13} />
                          Không hữu ích
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Related products (same category) ── */}
        {related.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">
                Sản phẩm cùng danh mục — <span className="text-[#008B8B]">{product.category}</span>
              </h2>
              <button
                onClick={() => navigate("/products")}
                className="text-sm text-[#008B8B] hover:underline font-medium"
              >
                Xem tất cả →
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/products/${p.id}`)}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                >
                  <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center p-4 mb-3 overflow-hidden">
                    <img
                      src={p.image_url}
                      alt={p.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="text-sm font-semibold text-gray-800 line-clamp-2 min-h-[40px] group-hover:text-[#008B8B] transition-colors">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-500">
                      {p.rating}.0 · {p.reviewCount} đánh giá
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#008B8B] mt-1">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(p.price)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Toast notification ── */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-medium transition-all ${
            toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-gray-900 text-white"
          }`}
        >
          {toast.type === "error" ? (
            <X size={16} className="text-red-200" />
          ) : (
            <Check size={16} className="text-green-400" />
          )}
          {toast.msg}
        </div>
      )}

      {/* ── Edit Modal ── */}
      {showEdit && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowEdit(false)}
          />
          {/* Modal box */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <Edit3 size={18} className="text-[#008B8B]" />
                <h2 className="font-bold text-gray-900">Chỉnh sửa sản phẩm</h2>
              </div>
              <button
                onClick={() => setShowEdit(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form body */}
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {/* Tên sản phẩm */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#008B8B] focus:ring-2 focus:ring-[#008B8B]/10 transition-colors"
                />
              </div>

              {/* Giá bán + Giá gốc */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Giá bán (VND)
                  </label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#008B8B] focus:ring-2 focus:ring-[#008B8B]/10 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Giá gốc (VND)
                  </label>
                  <input
                    type="number"
                    value={editForm.originalPrice}
                    onChange={(e) =>
                      setEditForm({ ...editForm, originalPrice: Number(e.target.value) })
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#008B8B] focus:ring-2 focus:ring-[#008B8B]/10 transition-colors"
                  />
                </div>
              </div>

              {/* Giảm giá + Danh mục */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Giảm giá (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editForm.discountPercentage}
                    onChange={(e) =>
                      setEditForm({ ...editForm, discountPercentage: Number(e.target.value) })
                    }
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#008B8B] focus:ring-2 focus:ring-[#008B8B]/10 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                    Danh mục
                  </label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#008B8B] focus:ring-2 focus:ring-[#008B8B]/10 transition-colors"
                  />
                </div>
              </div>

              {/* Trạng thái tồn kho */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Trạng thái tồn kho
                </label>
                <div className="flex gap-3">
                  {[true, false].map((val) => (
                    <button
                      key={String(val)}
                      onClick={() => setEditForm({ ...editForm, inStock: val })}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${
                        editForm.inStock === val
                          ? val
                            ? "border-green-500 bg-green-50 text-green-700"
                            : "border-red-400 bg-red-50 text-red-600"
                          : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200"
                      }`}
                    >
                      {val ? "✓ Còn hàng" : "✕ Hết hàng"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={() => setShowEdit(false)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-100 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex-1 py-2.5 rounded-xl bg-[#008B8B] text-white text-sm font-semibold hover:bg-[#007777] transition-colors shadow-sm"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
