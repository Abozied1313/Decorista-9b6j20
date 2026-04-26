import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/components/features/ProductCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { SlidersHorizontal, Search } from "lucide-react";

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

const CATEGORIES = ["الكل", "تروليات راتان", "تروليات متحركة", "وحدات أدراج", "أرفف تخزين"];

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<ReturnType<typeof toProduct>[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(
    searchParams.get("category") || "الكل"
  );
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    setLoading(true);
    supabase
      .from("products")
      .select("*")
      .then(({ data }) => {
        if (data) setProducts(data.map(toProduct));
        setLoading(false);
      });
  }, []);

  const filtered = products
    .filter((p) => activeCategory === "الكل" || p.category === activeCategory)
    .filter((p) =>
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.color.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    if (cat === "الكل") setSearchParams({});
    else setSearchParams({ category: cat });
  };

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-warm-800 font-serif mb-2">المتجر</h1>
          <p className="text-warm-500">{filtered.length} منتج متاح</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث عن منتج..."
            className="w-full border border-warm-200 rounded-2xl py-3 pr-12 pl-4 text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-400 bg-white"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-warm-800 text-white shadow-sm"
                    : "bg-white border border-warm-200 text-warm-700 hover:bg-warm-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-warm-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-warm-200 rounded-xl px-3 py-2 text-sm text-warm-700 bg-white focus:outline-none focus:ring-2 focus:ring-warm-400"
            >
              <option value="default">الترتيب الافتراضي</option>
              <option value="price-asc">السعر: من الأقل للأعلى</option>
              <option value="price-desc">السعر: من الأعلى للأقل</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-warm-100 animate-pulse">
                <div className="aspect-square bg-warm-100" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-warm-100 rounded w-3/4" />
                  <div className="h-4 bg-warm-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-warm-400 text-lg">لا توجد منتجات مطابقة</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
