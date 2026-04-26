import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/stores/AuthContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  User,
  Package,
  LogOut,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
} from "lucide-react";
import { toast } from "sonner";

interface OrderItem {
  id: string;
  product_name: string;
  product_image: string | null;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  status: string;
  total_price: number;
  payment_method: string | null;
  payment_status: string;
  customer_name: string | null;
  shipping_address: string | null;
  created_at: string;
  order_items: OrderItem[];
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "في الانتظار", color: "text-amber-600 bg-amber-50", icon: <Clock size={14} /> },
  processing: { label: "قيد المعالجة", color: "text-blue-600 bg-blue-50", icon: <Package size={14} /> },
  shipped: { label: "تم الشحن", color: "text-purple-600 bg-purple-50", icon: <Truck size={14} /> },
  delivered: { label: "تم التسليم", color: "text-green-600 bg-green-50", icon: <CheckCircle size={14} /> },
  cancelled: { label: "ملغي", color: "text-red-600 bg-red-50", icon: <XCircle size={14} /> },
};

export default function Account() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    setOrdersLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(`*, order_items(*)`)
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setOrders(data as Order[]);
    }
    setOrdersLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    toast.info("تم تسجيل الخروج");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center" dir="rtl">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-warm-300 border-t-warm-800" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-warm-100 p-6 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-warm-100 flex items-center justify-center">
              <User size={32} className="text-warm-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-warm-900 font-serif">{user.username}</h1>
              <p className="text-warm-500 text-sm">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 px-4 py-2 rounded-xl transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            تسجيل الخروج
          </button>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-warm-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Package size={22} className="text-warm-700" />
            <h2 className="text-xl font-bold text-warm-800 font-serif">طلباتي</h2>
            <span className="bg-warm-100 text-warm-600 text-xs font-medium px-2 py-0.5 rounded-full">
              {orders.length} طلب
            </span>
          </div>

          {ordersLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-warm-200 border-t-warm-700" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag size={48} className="mx-auto text-warm-300 mb-4" />
              <p className="text-warm-500 mb-4">لا توجد طلبات بعد</p>
              <Link
                to="/shop"
                className="inline-block bg-warm-800 text-white px-6 py-3 rounded-xl font-medium hover:bg-warm-900 transition-colors"
              >
                ابدأ التسوق
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const statusInfo = statusConfig[order.status] || statusConfig.pending;
                const isExpanded = expandedOrder === order.id;
                return (
                  <div
                    key={order.id}
                    className="border border-warm-100 rounded-2xl overflow-hidden"
                  >
                    {/* Order Header */}
                    <button
                      onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                      className="w-full flex items-center justify-between p-4 hover:bg-warm-50 transition-colors text-right"
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${statusInfo.color}`}
                        >
                          {statusInfo.icon}
                          {statusInfo.label}
                        </span>
                        <div className="text-right">
                          <p className="text-xs text-warm-500">
                            {new Date(order.created_at).toLocaleDateString("ar-EG", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                          <p className="text-warm-900 font-bold text-sm">
                            {order.total_price.toLocaleString()} ج.م
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-warm-500">
                        <span className="text-xs hidden sm:block">
                          {order.order_items?.length || 0} منتج
                        </span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {/* Order Items */}
                    {isExpanded && (
                      <div className="border-t border-warm-100 p-4 bg-warm-50">
                        <div className="space-y-3 mb-4">
                          {order.order_items?.map((item) => (
                            <div key={item.id} className="flex items-center gap-3">
                              {item.product_image && (
                                <img
                                  src={item.product_image}
                                  alt={item.product_name}
                                  className="w-12 h-12 object-contain bg-white rounded-xl border border-warm-100"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-warm-800 line-clamp-1">
                                  {item.product_name}
                                </p>
                                <p className="text-xs text-warm-500">
                                  {item.quantity} × {item.price.toLocaleString()} ج.م
                                </p>
                              </div>
                              <p className="text-sm font-bold text-warm-900 whitespace-nowrap">
                                {(item.price * item.quantity).toLocaleString()} ج.م
                              </p>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-sm pt-3 border-t border-warm-200">
                          <div className="text-warm-600">
                            <span>طريقة الدفع: </span>
                            <span className="font-medium">
                              {order.payment_method === "vodafone_cash"
                                ? "فودافون كاش"
                                : order.payment_method === "visa"
                                ? "فيزا / ماستركارد"
                                : order.payment_method}
                            </span>
                          </div>
                          <div className="text-warm-900 font-bold">
                            الإجمالي: {order.total_price.toLocaleString()} ج.م
                          </div>
                        </div>
                        {order.shipping_address && (
                          <p className="text-xs text-warm-500 mt-2">
                            📍 {order.shipping_address}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
