import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCartContext } from "@/stores/CartContext";
import ProductCard from "@/components/features/ProductCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import heroBanner from "@/assets/hero-banner.jpg";
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  Shield,
  RefreshCcw,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export default function Index() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ReturnType<typeof toProduct>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("products")
      .select("*")
      .eq("in_stock", true)
      .limit(8)
      .then(({ data }) => {
        if (data) setProducts(data.map(toProduct));
        setLoading(false);
      });
  }, []);

  const features = [
    { icon: <Truck size={24} />, title: "توصيل لجميع المحافظات", desc: "نوصل لكل أنحاء مصر" },
    { icon: <Shield size={24} />, title: "دفع آمن ومضمون", desc: "فودافون كاش وفيزا" },
    { icon: <RefreshCcw size={24} />, title: "ضمان الجودة", desc: "منتجات أصلية معتمدة" },
    { icon: <Star size={24} />, title: "خدمة عملاء ممتازة", desc: "دعم على مدار الساعة" },
  ];

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="relative min-h-[480px] md:min-h-[560px] flex items-center bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBanner})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-l from-warm-900/80 to-warm-900/30" />
          <div className="relative max-w-7xl mx-auto px-6 py-16 w-full">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
                <ShoppingBag size={14} className="text-white" />
                <span className="text-white text-sm font-medium">ديكوريستا - منزلك أجمل</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white font-serif leading-tight mb-4">
                اكتشف جمال<br />
                <span className="text-warm-300">الديكور المنزلي</span>
              </h1>
              <p className="text-warm-200 text-lg mb-8 leading-relaxed">
                تروليات راتان فاخرة، وحدات تخزين أنيقة، وأدوات منزلية بتصاميم عصرية تناسب ذوقك
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => navigate("/shop")}
                  className="flex items-center gap-2 bg-white text-warm-900 px-6 py-3 rounded-full font-bold hover:bg-warm-100 transition-all shadow-lg"
                >
                  تسوق الآن
                  <ArrowLeft size={18} />
                </button>
                <button
                  onClick={() => navigate("/shop?category=تروليات راتان")}
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white border border-white/30 px-6 py-3 rounded-full font-medium hover:bg-white/30 transition-all"
                >
                  تروليات راتان
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-warm-800 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-3 text-white">
                <div className="text-warm-300 flex-shrink-0">{f.icon}</div>
                <div>
                  <p className="font-semibold text-sm">{f.title}</p>
                  <p className="text-warm-400 text-xs">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-warm-800 font-serif">أحدث المنتجات</h2>
            <p className="text-warm-500 text-sm mt-1">تشكيلة مختارة بعناية لمنزلك</p>
          </div>
          <button
            onClick={() => navigate("/shop")}
            className="flex items-center gap-1 text-warm-700 hover:text-warm-900 font-medium text-sm border border-warm-200 px-4 py-2 rounded-full hover:bg-warm-100 transition-colors"
          >
            عرض الكل <ArrowLeft size={14} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-warm-100 animate-pulse">
                <div className="aspect-square bg-warm-100" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-warm-100 rounded w-3/4" />
                  <div className="h-4 bg-warm-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* CTA Banner */}
        <div className="mt-12 bg-gradient-to-l from-warm-800 to-warm-700 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-white text-center sm:text-right">
            <h3 className="text-xl font-bold font-serif mb-1">شاهد المزيد من المنتجات</h3>
            <p className="text-warm-300 text-sm">أكثر من 23 منتج راتان وديكور منزلي انتظرك</p>
          </div>
          <button
            onClick={() => navigate("/shop")}
            className="flex items-center gap-2 bg-white text-warm-900 px-6 py-3 rounded-2xl font-bold hover:bg-warm-100 transition-colors whitespace-nowrap"
          >
            تصفح المتجر <ArrowLeft size={18} />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
