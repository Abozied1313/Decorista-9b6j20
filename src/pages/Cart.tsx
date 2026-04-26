import { useNavigate } from "react-router-dom";
import { useCartContext } from "@/stores/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCartContext();
  const navigate = useNavigate();

  const shipping = totalPrice > 500 ? 0 : 50;

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-warm-800 font-serif mb-8">سلة التسوق</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-warm-100">
            <ShoppingCart size={60} className="text-warm-300 mx-auto mb-4" />
            <h2 className="text-xl text-warm-600 mb-2">سلتك فارغة</h2>
            <p className="text-warm-400 mb-6">ابدأ التسوق الآن واختر منتجاتك المفضلة</p>
            <button
              onClick={() => navigate("/shop")}
              className="flex items-center gap-2 bg-warm-800 text-white px-6 py-3 rounded-full font-medium mx-auto hover:bg-warm-900 transition-colors"
            >
              <ArrowLeft size={16} />
              تسوق الآن
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl p-4 shadow-sm border border-warm-100 flex gap-4 items-center"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-20 h-20 object-contain rounded-xl bg-warm-50 p-1 flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-semibold text-warm-800 text-sm leading-snug line-clamp-2 cursor-pointer hover:text-warm-600 transition-colors"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </p>
                    <p className="text-warm-500 text-xs mt-0.5">{product.color} · {product.dimensions}</p>
                    <p className="text-warm-900 font-bold mt-1">{product.price.toLocaleString()} ج.م</p>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    {/* Quantity */}
                    <div className="flex items-center gap-1 border border-warm-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="p-1.5 hover:bg-warm-100 transition-colors"
                      >
                        <Minus size={14} className="text-warm-600" />
                      </button>
                      <span className="px-3 font-semibold text-warm-900 text-sm">{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="p-1.5 hover:bg-warm-100 transition-colors"
                      >
                        <Plus size={14} className="text-warm-600" />
                      </button>
                    </div>
                    {/* Subtotal */}
                    <p className="text-warm-700 font-bold text-sm">
                      {(product.price * quantity).toLocaleString()} ج.م
                    </p>
                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-warm-100 sticky top-24">
                <h2 className="text-xl font-bold text-warm-800 mb-6 font-serif">ملخص الطلب</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-warm-600">
                    <span>المجموع الفرعي</span>
                    <span>{totalPrice.toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between text-warm-600">
                    <span>الشحن</span>
                    <span className={shipping === 0 ? "text-green-500 font-medium" : ""}>
                      {shipping === 0 ? "مجاني" : `${shipping} ج.م`}
                    </span>
                  </div>
                  {totalPrice < 500 && (
                    <p className="text-xs text-warm-400 bg-warm-50 p-2 rounded-lg">
                      أضف منتجات بقيمة {(500 - totalPrice).toLocaleString()} ج.م للحصول على شحن مجاني
                    </p>
                  )}
                  <div className="border-t border-warm-100 pt-3 flex justify-between font-bold text-lg text-warm-900">
                    <span>الإجمالي</span>
                    <span>{(totalPrice + shipping).toLocaleString()} ج.م</span>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-warm-800 text-white py-4 rounded-2xl font-bold text-lg hover:bg-warm-900 transition-colors shadow-lg mb-3"
                >
                  إتمام الشراء
                </button>
                <button
                  onClick={() => navigate("/shop")}
                  className="w-full border border-warm-300 text-warm-700 py-3 rounded-2xl font-medium hover:bg-warm-50 transition-colors"
                >
                  متابعة التسوق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
