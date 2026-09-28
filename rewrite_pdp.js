const fs = require('fs');
const path = require('path');

const adminPath = path.join(__dirname, 'frontend/src/pages/AdminProductDetailPage.jsx');
const userPath = path.join(__dirname, 'frontend/src/pages/ProductDetailPage.jsx');

let content = fs.readFileSync(adminPath, 'utf8');

// 1. Rename component
content = content.replace(/export default function AdminProductDetailPage\(\) \{/g, 'export default function ProductDetailPage() {');

// 2. Add imports
content = content.replace(/import \{/g, 'import {\n  ShoppingCart,\n  Heart,\n  Minus,\n  Plus,\n  Home,');

// 3. Add customer states
content = content.replace(/const \[activeTab, setActiveTab\] = useState\("overview"\);/, `const [activeTab, setActiveTab] = useState("overview");
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("30ml");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [newComment, setNewComment] = useState("");
  const sizes = ["15ml", "30ml", "50ml", "100ml"];`);

// 4. Remove editForm, showEdit, handleSaveEdit, handleResetEdit, handleExport
content = content.replace(/const \[showEdit, setShowEdit\] = useState\(false\);\s*const \[editForm, setEditForm\] = useState\(null\);/, '');

// 5. Replace actions in top bar
content = content.replace(/<button\s*onClick=\{handleExport\}[\s\S]*?<\/button>/, '');
content = content.replace(/<button\s*onClick=\{handleOpenEdit\}[\s\S]*?<\/button>/, '');

// 6. Replace handleToggleWishlist, handleAddToCart, handleAddComment
const newHandlers = `
  const handleToggleWishlist = () => {
    if (!product) return;
    setIsWishlisted(!isWishlisted);
    showToast(isWishlisted ? "Đã xóa khỏi danh sách yêu thích." : "Đã thêm vào danh sách yêu thích! ♥");
  };

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
    showToast(\`Đã thêm \${quantity} sản phẩm (\${selectedSize}) vào giỏ hàng!\`);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const allComments = JSON.parse(localStorage.getItem("productComments")) || {};
    const productComments = allComments[id] || [];
    const commentObj = {
      id: Date.now(),
      author: "Bạn", // or getting from AuthContext if we use it
      avatar: "U",
      rating: 5,
      date: new Date().toLocaleDateString("vi-VN"),
      content: newComment,
      helpful: 0,
      verified: true
    };
    const updatedProductComments = [commentObj, ...productComments];
    allComments[id] = updatedProductComments;
    localStorage.setItem("productComments", JSON.stringify(allComments));
    setLocalComments(updatedProductComments);
    setNewComment("");
    showToast("Đã thêm bình luận!");
  };
`;
content = content.replace(/const showToast = \(msg, type = "success"\) => \{[\s\S]*?\};/, `const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };
  ${newHandlers}
`);

// 7. Add Wishlist button next to product name
content = content.replace(/<h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 leading-snug">\s*\{product\.name\}\s*<\/h1>/, `<div className="flex justify-between items-start gap-4">
              <h1 className="text-2xl lg:text-3xl font-extrabold text-gray-900 leading-snug">
                {product.name}
              </h1>
              <button
                onClick={handleToggleWishlist}
                className={\`w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-full border transition-all \${
                  isWishlisted
                    ? "border-red-400 bg-red-50 text-red-500"
                    : "border-gray-200 text-gray-400 hover:text-red-500 hover:bg-red-50 hover:border-red-300"
                }\`}
              >
                <Heart size={20} className={isWishlisted ? "fill-red-500" : ""} />
              </button>
            </div>`);

// 8. Replace KPI block with Size and Quantity selectors + Buy buttons
content = content.replace(/\{\/\*\s*KPI row\s*\*\/\}(.|\n)*?\{\/\*\s*SKU \/ Meta info\s*\*\/\}/, `{/* Size Selector */}
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-700 mb-3">Dung tích:</p>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={\`min-w-[4rem] px-3 h-10 rounded-full text-sm font-medium border transition-colors \${
                      selectedSize === size
                        ? "bg-[#008B8B] border-[#008B8B] text-white"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                    }\`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Buy */}
            <div className="mb-2">
              <p className="text-sm font-medium text-gray-700 mb-3">Số lượng:</p>
              <div className="flex flex-wrap gap-4">
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
                <button
                  onClick={() => {
                    handleAddToCart();
                    navigate("/cart");
                  }}
                  className="flex-1 min-w-[140px] h-12 bg-[#ffb800] text-gray-900 rounded-full font-bold hover:bg-[#e5a600] transition-colors shadow-sm"
                >
                  Mua ngay
                </button>
                <button
                  onClick={handleAddToCart}
                  className="flex-1 min-w-[140px] h-12 bg-[#008B8B] text-white rounded-full font-bold flex items-center justify-center gap-2 hover:bg-[#007777] transition-colors shadow-sm"
                >
                  <ShoppingCart size={18} />
                  Thêm vào giỏ
                </button>
              </div>
            </div>
            
            {/* SKU / Meta info */}`);

// 9. Add Comment form in Reviews Tab
content = content.replace(/<div className="space-y-4">/, `<div className="bg-white border border-gray-100 rounded-xl p-5 mb-6 shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-3">Viết bình luận của bạn</h4>
                  <textarea
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#008B8B] mb-3"
                    rows="3"
                    placeholder="Sản phẩm này thế nào? Chia sẻ trải nghiệm của bạn nhé..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  ></textarea>
                  <button
                    onClick={handleAddComment}
                    className="px-6 py-2.5 bg-[#008B8B] text-white rounded-lg text-sm font-semibold hover:bg-[#007777] transition-colors"
                  >
                    Gửi bình luận
                  </button>
                </div>
                <div className="space-y-4">`);

// 10. Remove Edit Modal
content = content.replace(/\{\/\* ── Edit Modal ── \*\/\}[\s\S]*$/, '    </div>\n  );\n}\n');

fs.writeFileSync(userPath, content, 'utf8');
console.log('ProductDetailPage.jsx rewritten successfully.');
