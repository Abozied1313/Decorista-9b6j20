import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartContext } from "@/stores/CartContext";
import { useAuth } from "@/stores/AuthContext";
import { supabase } from "@/lib/supabase";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  CreditCard,
  Smartphone,
  MapPin,
  User,
  Phone,
  Mail,
  ChevronLeft,
  CheckCircle,
  Loader2,
  MessageCircle,
  FileText,
} from "lucide-react";
import { toast } from "sonner";

type PaymentMethod = "vodafone_cash" | "visa";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCartContext();
  const { user } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("vodafone_cash");
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: user?.username || "",
    phone: "",
    email: user?.email || "",
    address: "",
    city: "",
    notes: "",
  });

  if (cartItems.length === 0 && !orderSuccess) {
    navigate("/cart");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const shippingCost = 50;
  const grandTotal = totalPrice + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      toast.error("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    setLoading(true);

    // Insert order
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id || null,
        total_price: grandTotal,
        payment_method: paymentMethod,
        payment_status: paymentMethod === "vodafone_cash" ? "pending" : "pending",
        customer_name: form.name,
        customer_phone: form.phone,
        customer_email: form.email,
        shipping_address: `${form.address}، ${form.city}`,
        notes: form.notes,
        status: "pending",
      })
      .select()
      .single();

    if (orderError || !orderData) {
      toast.error("حدث خطأ أثناء إنشاء الطلب");
      setLoading(false);
      return;
    }

    // Insert order items
    const orderItems = cartItems.map((item) => ({
      order_id: orderData.id,
      product_id: item.product.id,
      product_name: item.product.name,
      product_image: item.product.image,
      price: item.product.price,
      quantity: item.quantity,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

    if (itemsError) {
      toast.error("حدث خطأ أثناء حفظ المنتجات");
      setLoading(false);
      return;
    }

    // Send WhatsApp notification
    const whatsappMsg = encodeURIComponent(
      `🛍️ طلب جديد من ديكوريستا!\n\n` +
      `👤 الاسم: ${form.name}\n` +
      `📞 الهاتف: ${form.phone}\n` +
      `📍 العنوان: ${form.address}، ${form.city}\n\n` +
      `📦 المنتجات:\n` +
      cartItems.map((i) => `• ${i.product.name} × ${i.quantity} = ${(i.product.price * i.quantity).toLocaleString()} ج.م`).join("\n") +
      `\n\n💰 المجموع: ${grandTotal.toLocaleString()} ج.م\n` +
      `💳 طريقة الدفع: ${paymentMethod === "vodafone_cash" ? "فودافون كاش" : "فيزا"}\n` +
      `🔢 رقم الطلب: ${orderData.id.slice(0, 8).toUpperCase()}`
    );
    // Open WhatsApp with order details (store owner number - placeholder)
    window.open(`https://wa.me/201000000000?text=${whatsappMsg}`, "_blank");

    clearCart();
    setOrderId(orderData.id);
    setOrderSuccess(true);
    setLoading(false);
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-cream" dir="rtl">
        <Header />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-3xl p-10 shadow-sm border border-warm-100">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-warm-900 font-serif mb-3">
              تم استلام طلبك!
            </h2>
            <p className="text-warm-600 mb-2">شكراً لتسوقك من ديكوريستا</p>
            <div className="bg-warm-50 rounded-2xl p-4 my-6">
              <p className="text-sm text-warm-500 mb-1">رقم الطلب</p>
              <p className="font-bold text-warm-900 text-lg tracking-wider">
                #{orderId?.slice(0, 8).toUpperCase()}
              </p>
            </div>

            {paymentMethod === "vodafone_cash" && (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 text-right">
                <p className="font-bold text-red-700 mb-2 flex items-center gap-2">
                  <Smartphone size={18} />
                  تعليمات الدفع بفودافون كاش
                </p>
                <p className="text-sm text-red-600">
                  يرجى تحويل مبلغ <strong>{grandTotal.toLocaleString()} ج.م</strong> إلى الرقم:
                </p>
                <p className="text-xl font-bold text-red-800 my-2">010XXXXXXXX</p>
                <p className="text-xs text-red-500">
                  ثم أرسل صورة من الإيصال عبر واتساب لتأكيد الطلب
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  const msg = encodeURIComponent(`مرحباً، أريد متابعة الطلب رقم: #${orderId?.slice(0, 8).toUpperCase()}`);
                  window.open(`https://wa.me/201000000000?text=${msg}`, "_blank");
                }}
                className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                <MessageCircle size={18} />
                تواصل معنا عبر واتساب
              </button>
              {user && (
                <button
                  onClick={() => navigate("/account")}
                  className="flex items-center justify-center gap-2 bg-warm-800 text-white py-3 rounded-xl font-medium hover:bg-warm-900 transition-colors"
                >
                  <FileText size={18} />
                  تتبع طلباتي
                </button>
              )}
              <button
                onClick={() => navigate("/shop")}
                className="text-warm-600 hover:text-warm-800 py-2 text-sm"
              >
                متابعة التسوق
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-warm-800 font-serif mb-6">إتمام الطلب</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Info */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-warm-100">
                <h2 className="font-bold text-warm-800 mb-4 flex items-center gap-2">
                  <User size={18} />
                  البيانات الشخصية
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">
                      الاسم الكامل *
                    </label>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="اسمك الكريم"
                      className="w-full border border-warm-200 rounded-xl py-2.5 px-4 text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-400 bg-warm-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">
                      رقم الهاتف *
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400" />
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="01XXXXXXXXX"
                        className="w-full border border-warm-200 rounded-xl py-2.5 pr-9 pl-4 text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-400 bg-warm-50"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">
                      البريد الإلكتروني
                    </label>
                    <div className="relative">
                      <Mail size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400" />
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        className="w-full border border-warm-200 rounded-xl py-2.5 pr-9 pl-4 text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-400 bg-warm-50"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-warm-100">
                <h2 className="font-bold text-warm-800 mb-4 flex items-center gap-2">
                  <MapPin size={18} />
                  عنوان التوصيل
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">
                      العنوان التفصيلي *
                    </label>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      required
                      placeholder="الشارع، رقم المبنى، الشقة"
                      className="w-full border border-warm-200 rounded-xl py-2.5 px-4 text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-400 bg-warm-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">
                      المدينة / المنطقة
                    </label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="القاهرة، الجيزة، الإسكندرية..."
                      className="w-full border border-warm-200 rounded-xl py-2.5 px-4 text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-400 bg-warm-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-warm-700 mb-1.5">
                      ملاحظات إضافية
                    </label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      rows={3}
                      placeholder="أي تعليمات خاصة للتوصيل..."
                      className="w-full border border-warm-200 rounded-xl py-2.5 px-4 text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-400 bg-warm-50 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-warm-100">
                <h2 className="font-bold text-warm-800 mb-4 flex items-center gap-2">
                  <CreditCard size={18} />
                  طريقة الدفع
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("vodafone_cash")}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-right ${
                      paymentMethod === "vodafone_cash"
                        ? "border-red-400 bg-red-50"
                        : "border-warm-200 hover:border-warm-300"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      paymentMethod === "vodafone_cash" ? "border-red-500" : "border-warm-300"
                    }`}>
                      {paymentMethod === "vodafone_cash" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <Smartphone size={18} className="text-red-500" />
                        <span className="font-semibold text-warm-800">فودافون كاش</span>
                      </div>
                      <p className="text-xs text-warm-500 mt-0.5">دفع عند الاستلام بالمحفظة</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("visa")}
                    className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-right ${
                      paymentMethod === "visa"
                        ? "border-blue-400 bg-blue-50"
                        : "border-warm-200 hover:border-warm-300"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      paymentMethod === "visa" ? "border-blue-500" : "border-warm-300"
                    }`}>
                      {paymentMethod === "visa" && (
                        <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <CreditCard size={18} className="text-blue-500" />
                        <span className="font-semibold text-warm-800">فيزا / ماستركارد</span>
                      </div>
                      <p className="text-xs text-warm-500 mt-0.5">دفع إلكتروني آمن</p>
                    </div>
                  </button>
                </div>

                {paymentMethod === "vodafone_cash" && (
                  <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700">
                    سيتم إرسال رقم فودافون كاش الخاص بنا بعد تأكيد الطلب
                  </div>
                )}
                {paymentMethod === "visa" && (
                  <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
                    ستتلقى رابط دفع آمن على رقم هاتفك بعد تأكيد الطلب
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-warm-100 sticky top-20">
                <h2 className="font-bold text-warm-800 mb-4 font-serif">ملخص الطلب</h2>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-2">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-10 h-10 object-contain bg-warm-50 rounded-lg border border-warm-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-warm-800 font-medium line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-xs text-warm-500">× {item.quantity}</p>
                      </div>
                      <p className="text-xs font-bold text-warm-900 whitespace-nowrap">
                        {(item.product.price * item.quantity).toLocaleString()} ج.م
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-warm-100 pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-warm-600">
                    <span>المجموع الفرعي</span>
                    <span>{totalPrice.toLocaleString()} ج.م</span>
                  </div>
                  <div className="flex justify-between text-sm text-warm-600">
                    <span>الشحن</span>
                    <span>{shippingCost} ج.م</span>
                  </div>
                  <div className="flex justify-between font-bold text-warm-900 text-base pt-2 border-t border-warm-100">
                    <span>الإجمالي</span>
                    <span>{grandTotal.toLocaleString()} ج.م</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-5 bg-warm-800 text-white py-4 rounded-2xl font-bold text-base hover:bg-warm-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <ChevronLeft size={20} />
                  )}
                  تأكيد الطلب
                </button>
                <p className="text-xs text-center text-warm-400 mt-3">
                  بالضغط فوق، أنت توافق على شروط الخدمة
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
