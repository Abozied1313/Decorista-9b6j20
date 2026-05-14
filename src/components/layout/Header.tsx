import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Home, Store, Menu, X, User, LogOut } from "lucide-react";
import { useCartContext } from "@/stores/CartContext";
import { useAuth } from "@/stores/AuthContext";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { toast } from "sonner";

export default function Header() {
  const { totalItems } = useCartContext();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    toast.info("تم تسجيل الخروج");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 bg-cream border-b border-warm-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/logo.jpg" alt="ديكوريستا" className="h-12 w-14 object-contain" />
          <span className="text-2xl font-bold text-warm-800 tracking-wide font-serif">
            Decorista
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-warm-700 hover:text-warm-900 font-medium transition-colors flex items-center gap-1.5"
          >
            <Home size={16} />
            الرئيسية
          </Link>
          <Link
            to="/shop"
            className="text-warm-700 hover:text-warm-900 font-medium transition-colors flex items-center gap-1.5"
          >
            <Store size={16} />
            المتجر
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <button
            onClick={() => navigate("/cart")}
            className="relative flex items-center gap-2 bg-warm-800 text-cream px-4 py-2 rounded-full font-medium hover:bg-warm-900 transition-colors"
          >
            <ShoppingCart size={18} />
            <span className="hidden sm:inline">السلة</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-terracotta text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </button>

          {/* User Menu */}
          {user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 border border-warm-200 rounded-full px-3 py-2 hover:bg-warm-100 transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-warm-200 flex items-center justify-center">
                  <User size={14} className="text-warm-700" />
                </div>
                <span className="text-sm font-medium text-warm-800 max-w-[80px] truncate">
                  {user.username}
                </span>
              </button>
              {userMenuOpen && (
                <div className="absolute left-0 top-12 bg-white rounded-2xl shadow-lg border border-warm-100 py-2 w-44 z-50">
                  <button
                    onClick={() => { navigate("/account"); setUserMenuOpen(false); }}
                    className="w-full text-right px-4 py-2.5 text-sm text-warm-700 hover:bg-warm-50 flex items-center gap-2"
                  >
                    <User size={15} />
                    حسابي وطلباتي
                  </button>
                  <hr className="border-warm-100 my-1" />
                  <button
                    onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                    className="w-full text-right px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut size={15} />
                    تسجيل الخروج
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1.5 text-sm font-medium text-warm-700 hover:text-warm-900 border border-warm-200 rounded-full px-4 py-2 hover:bg-warm-100 transition-colors"
            >
              <User size={15} />
              دخول
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-warm-700"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream border-t border-warm-200 px-4 py-4 flex flex-col gap-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-warm-700 hover:text-warm-900 font-medium flex items-center gap-2">
            <Home size={16} /> الرئيسية
          </Link>
          <Link to="/shop" onClick={() => setMenuOpen(false)} className="text-warm-700 hover:text-warm-900 font-medium flex items-center gap-2">
            <Store size={16} /> المتجر
          </Link>
          {user ? (
            <>
              <Link to="/account" onClick={() => setMenuOpen(false)} className="text-warm-700 hover:text-warm-900 font-medium flex items-center gap-2">
                <User size={16} /> حسابي وطلباتي
              </Link>
              <button onClick={handleLogout} className="text-red-500 font-medium flex items-center gap-2 text-right">
                <LogOut size={16} /> تسجيل الخروج
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="text-warm-700 hover:text-warm-900 font-medium flex items-center gap-2">
              <User size={16} /> دخول / تسجيل
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
