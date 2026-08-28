import { Phone, CreditCard, MapPin, Clock, MessageCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-warm-900 text-warm-100 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.jpg" alt="ديكوريستا" className="h-12 w-20 object-contain" />
              <span className="text-xl font-bold font-serif text-warm-50">Decorista</span>
            </div>
            <p className="text-warm-300 leading-relaxed text-sm">
              متجرك الأول للمنتجات المنزلية والديكورات الأنيقة. نقدم لك أجمل قطع التخزين والراتان لتحويل منزلك إلى مكان أكثر جمالاً وتنظيماً.
            </p>
          </div>

          {/* Payment */}
          <div>
            <h3 className="font-semibold text-warm-50 mb-4 text-lg">طرق الدفع</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-warm-300">
                <Phone size={18} className="text-terracotta-light" />
                <div>
                  <p className="font-medium text-warm-100">فودافون كاش</p>
                  <p className="text-xs text-warm-400">دفع سريع وآمن عبر الهاتف</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-warm-300">
                <CreditCard size={18} className="text-terracotta-light" />
                <div>
                  <p className="font-medium text-warm-100">بطاقة فيزا / ماستركارد</p>
                  <p className="text-xs text-warm-400">دفع إلكتروني آمن ومشفر</p>
                </div>
              </div>
            </div>
          </div>

          {/* Info & Links */}
          <div>
            <h3 className="font-semibold text-warm-50 mb-4 text-lg">روابط مهمة</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-warm-300">
                <MapPin size={18} className="text-terracotta-light shrink-0" />
                <span className="text-sm">الشروق – خلف كومباوند حسن علام، المنطقة السابعة</span>
              </div>
              <div className="flex items-center gap-3 text-warm-300">
                <Clock size={18} className="text-terracotta-light shrink-0" />
                <span className="text-sm">التوصيل خلال 3-5 أيام عمل</span>
              </div>
              <div className="flex items-center gap-3 text-warm-300">
                <Phone size={18} className="text-terracotta-light shrink-0" />
                <a href="https://wa.me/201069787615" target="_blank" rel="noopener noreferrer" className="text-sm hover:text-white transition-colors" dir="ltr">01069787615</a>
              </div>
              <div className="flex items-center gap-3 text-warm-300">
                <Mail size={18} className="text-terracotta-light shrink-0" />
                <a href="mailto:Mohamedabozieed@gmail.com" className="text-sm hover:text-white transition-colors break-all">Mohamedabozieed@gmail.com</a>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <Link to="/return-policy" className="text-sm text-warm-400 hover:text-warm-200 transition-colors">سياسة الاستبدال والاسترجاع</Link>
                <Link to="/contact" className="text-sm text-warm-400 hover:text-warm-200 transition-colors">اتصل بنا</Link>
                <Link to="/seller-profile" className="text-sm text-warm-400 hover:text-warm-200 transition-colors">ملف المتجر</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-warm-700 mt-10 pt-6 text-center text-warm-400 text-sm">
          <p>© 2024 Decorista - جميع الحقوق محفوظة</p>
        </div>
      </div>
    </footer>
  );
}
