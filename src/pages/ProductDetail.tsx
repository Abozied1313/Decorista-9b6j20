import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { useCartContext } from "@/stores/CartContext";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/features/ProductCard";
import {
  ShoppingCart,
  CheckCircle,
  XCircle,
  Tag,
  Truck,
  Shield,
  MessageCircle,
} from "lucide-react";

interface DBProduct {
  id: string;
  name: string;
  price: number;
  original_price: number | null;
  image: string | null;
  category: string | null;
  color: string | null;
  dimensions: string | null;
  tiers: number | null;
  in_stock: boolean;
  description: string | null;
}

function toProduct(p: DBProduct) {
  return {
    id: p.id,
    name: p.name,
    price: p.price,
    originalPrice: p.original_price ?? undefined,
    image: p.image ?? "",
    category: p.category ?? "عام",
    color: p.color ?? "",
    dimensions: p.dimensions ?? "",
    tiers: p.tiers ?? 0,
    inStock: p.in_stock,
    description: p.description ?? "",
  };
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCartContext();
  const [product, setProduct] = useState<ReturnType<typeof toProduct> | null>(null);
  const [related, setRelated] = useState<ReturnType<typeof toProduct>[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        if (data) {
          const p = toProduct(data);
          setProduct(p);
          // Fetch related
          supabase
            .from("products")
            .select("*")
            .eq("category", data.category)
            .neq("id", id)
            .limit(4)
            .then(({ data: rel }) => {
              if (rel) setRelated(rel.map(toProduct));
            });
        }
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream" dir="rtl">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="bg-warm-100 rounded-3xl aspect-square" />
            <div className="space-y-4">
              <div className="h-6 bg-warm-100 rounded w-1/4" />
              <div className="h-8 bg-warm-100 rounded w-3/4" />
              <div className="h-10 bg-warm-100 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream" dir="rtl">
        <div className="text-center">
          <p className="text-2xl text-warm-700 mb-4">المنتج غير موجود</p>
          <button onClick={() => navigate("/shop")} className="text-terracotta underline">
            العودة للمتجر
          </button>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const whatsappMsg = encodeURIComponent(
    `مرحباً، أريد الاستفسار عن:\n${product.name}\nالسعر: ${product.price.toLocaleString()} ج.م`
  );

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-warm-500 mb-6">
          <button onClick={() => navigate("/")} className="hover:text-warm-800">الرئيسية</button>
          <span>/</span>
          <button onClick={() => navigate("/shop")} className="hover:text-warm-800">المتجر</button>
          <span>/</span>
          <span className="text-warm-800 font-medium line-clamp-1">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Image */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-warm-100 relative">
            {discount > 0 && (
              <div className="absolute top-4 right-4 bg-terracotta text-white text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Tag size={12} /> خصم {discount}%
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-h-[420px] object-contain"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between">
            <div>
              <span className="inline-block bg-warm-100 text-warm-600 text-xs font-medium px-3 py-1 rounded-full mb-3">
                {product.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-warm-900 font-serif leading-tight mb-4">
                {product.name}
              </h1>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-4xl font-bold text-warm-900">{product.price.toLocaleString()}</span>
                <span className="text-xl text-warm-600">ج.م</span>
                {product.originalPrice && (
                  <span className="text-lg text-warm-400 line-through">{product.originalPrice.toLocaleString()} ج.م</span>
                )}
              </div>
              <div className="flex items-center gap-2 mb-5">
                {product.inStock ? (
                  <><CheckCircle size={18} className="text-green-500" /><span className="text-green-600 font-medium">متوفر في المخزون</span></>
                ) : (
                  <><XCircle size={18} className="text-red-400" /><span className="text-red-500 font-medium">غير متوفر حالياً</span></>
                )}
              </div>
              <div className="bg-warm-50 rounded-2xl p-4 mb-5">
                <h3 className="font-semibold text-warm-800 mb-3">تفاصيل المنتج</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div><span className="text-warm-500">اللون:</span><span className="text-warm-800 font-medium mr-2">{product.color}</span></div>
                  <div><span className="text-warm-500">الأبعاد:</span><span className="text-warm-800 font-medium mr-2">{product.dimensions}</span></div>
                  <div><span className="text-warm-500">عدد الأدوار:</span><span className="text-warm-800 font-medium mr-2">{product.tiers} أدوار</span></div>
                </div>
              </div>
              <p className="text-warm-600 leading-relaxed mb-5">{product.description}</p>
            </div>

            {product.inStock && (
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-warm-700 font-medium">الكمية:</span>
                  <div className="flex items-center gap-2 bg-white border border-warm-200 rounded-xl overflow-hidden">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-warm-700 hover:bg-warm-100 font-bold text-lg">−</button>
                    <span className="px-4 py-2 font-semibold text-warm-900 min-w-[2.5rem] text-center">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-warm-700 hover:bg-warm-100 font-bold text-lg">+</button>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-lg transition-all ${
                    added ? "bg-green-500 text-white" : "bg-warm-800 text-white hover:bg-warm-900 shadow-lg"
                  }`}
                >
                  {added ? <><CheckCircle size={22} /> تمت الإضافة للسلة</> : <><ShoppingCart size={22} /> أضف إلى السلة</>}
                </button>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => { addToCart(product, quantity); navigate("/cart"); }}
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold border-2 border-warm-800 text-warm-800 hover:bg-warm-50 transition-all"
                  >
                    اشتري الآن
                  </button>
                  <a
                    href={`https://wa.me/201000000000?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all"
                  >
                    <MessageCircle size={18} /> واتساب
                  </a>
                </div>
              </div>
            )}

            <div className="mt-4 flex gap-4 flex-wrap">
              <div className="flex items-center gap-2 text-warm-500 text-sm"><Truck size={16} /> توصيل لجميع أنحاء مصر</div>
              <div className="flex items-center gap-2 text-warm-500 text-sm"><Shield size={16} /> دفع آمن ومضمون</div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-warm-800 font-serif mb-6">منتجات مشابهة</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
      <Footer />
    </div>
  );
}
