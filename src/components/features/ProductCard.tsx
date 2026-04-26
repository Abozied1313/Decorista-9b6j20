import { Product } from "@/types";
import { useCartContext } from "@/stores/CartContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Tag } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCartContext();
  const navigate = useNavigate();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-warm-100 group cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-warm-50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-terracotta text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
            <Tag size={10} />
            {discount}% خصم
          </div>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-warm-800 font-bold px-4 py-2 rounded-full text-sm">
              غير متوفر
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-warm-500 mb-1">{product.category}</p>
        <h3 className="text-warm-800 font-semibold text-sm leading-snug line-clamp-2 mb-2 min-h-[2.5rem]">
          {product.name}
        </h3>
        <p className="text-xs text-warm-500 mb-3">{product.dimensions}</p>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-warm-900">{product.price.toLocaleString()} ج.م</span>
            {product.originalPrice && (
              <span className="text-xs text-warm-400 line-through mr-1">
                {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (product.inStock) addToCart(product);
            }}
            disabled={!product.inStock}
            className="flex items-center gap-1.5 bg-warm-800 text-cream text-xs px-3 py-2 rounded-xl font-medium hover:bg-warm-900 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={14} />
            أضف
          </button>
        </div>
      </div>
    </div>
  );
}
