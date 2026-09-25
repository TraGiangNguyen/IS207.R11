import { useState, useEffect } from "react";
import { Trash2, ArrowLeft, Plus, Minus, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  const updateLocalStorage = (newCart) => {
    setCartItems(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleQuantityChange = (id, delta) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateLocalStorage(updatedCart);
  };

  const handleRemoveItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id);
    updateLocalStorage(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    );
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <ShoppingCart size={40} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-700">
          Giỏ hàng của bạn đang trống
        </h2>
        <button
          onClick={() => navigate("/products")}
          className="mt-4 px-6 py-3 bg-[#008B8B] text-white rounded-full font-medium hover:bg-[#007777] flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={20} /> Tiếp tục mua sắm
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-full p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Giỏ hàng</h1>
          <button
            onClick={() => navigate("/products")}
            className="text-[#008B8B] font-medium flex items-center gap-1 hover:underline"
          >
            <ArrowLeft size={18} /> Mua thêm sản phẩm
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-center py-6 border-b border-gray-100 last:border-0 gap-6"
              >
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="w-24 h-24 object-contain bg-[#F4F6F6] rounded-xl p-2 flex-shrink-0"
                />

                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <h3 className="text-lg font-medium text-gray-900">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Danh mục: {item.category}
                  </p>
                  <p className="text-lg font-bold text-[#008B8B]">
                    ${Number(item.price).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-3 bg-gray-50 p-1 rounded-lg border border-gray-200">
                  <button
                    onClick={() => handleQuantityChange(item.id, -1)}
                    className="p-1 hover:bg-white rounded text-gray-600 shadow-sm transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(item.id, 1)}
                    className="p-1 hover:bg-white rounded text-gray-600 shadow-sm transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="w-24 text-right hidden sm:block">
                  <p className="font-bold text-gray-900 text-lg">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors ml-2"
                  title="Xóa khỏi giỏ hàng"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 p-6 flex flex-col items-end gap-4 border-t border-gray-100">
            <div className="text-xl text-gray-700 flex items-center gap-4">
              <span>Tổng thanh toán:</span>
              <span className="text-3xl font-bold text-[#008B8B]">
                ${calculateTotal().toFixed(2)}
              </span>
            </div>
            <button
              className="px-8 py-3 bg-[#008B8B] text-white rounded-lg font-bold text-lg hover:bg-[#007777] transition-colors shadow-md w-full sm:w-auto"
              onClick={() => alert("Tính năng Checkout đang được phát triển!")}
            >
              Tiến hành thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
