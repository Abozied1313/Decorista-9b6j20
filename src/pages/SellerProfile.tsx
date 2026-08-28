import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  User,
  Building2,
  Phone,
  Mail,
  MapPin,
  Globe,
  ShoppingBag,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

export default function SellerProfile() {
  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      <Header />

      {/* Hero */}
      <div className="bg-warm-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <User size={32} className="text-warm-200" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-2">ملف صاحب المتجر</h1>
          <p className="text-warm-300">معلومات البائع والمتجر الرسمية</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">

        {/* Profile Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-warm-100 overflow-hidden">
          {/* Top banner */}
          <div className="h-24 bg-gradient-to-l from-warm-700 to-warm-900" />

          {/* Avatar + Name */}
          <div className="px-8 pb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 -mt-12 mb-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden shrink-0">
                <img src="/owner-photo.jpg" alt="Mohamed Abozieed" className="w-full h-full object-cover object-top" />
              </div>
              <div className="text-center sm:text-right pb-1">
                <h2 className="text-2xl font-bold text-warm-900 font-serif">Mohamed Abozieed</h2>
                <p className="text-warm-500 text-sm">محمد أبوزيد</p>
                <div className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full mt-1.5 font-medium">
                  <CheckCircle size={12} />
                  بائع موثوق
                </div>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <InfoRow
                icon={<User size={18} className="text-terracotta" />}
                label="الاسم الأول"
                value="Mohamed"
              />
              <InfoRow
                icon={<User size={18} className="text-terracotta" />}
                label="اسم العائلة"
                value="Abozieed"
              />
              <InfoRow
                icon={<Building2 size={18} className="text-terracotta" />}
                label="اسم الشركة / المتجر"
                value="Decorista — ديكوريستا"
              />
              <InfoRow
                icon={<Globe size={18} className="text-terracotta" />}
                label="موقع الويب"
                value="decorista.onspace.app"
                isLink
                href="https://decorista.onspace.app"
              />
              <InfoRow
                icon={<Phone size={18} className="text-terracotta" />}
                label="رقم الهاتف"
                value="+20 10 6978 7615"
                dir="ltr"
              />
              <InfoRow
                icon={<Mail size={18} className="text-terracotta" />}
                label="البريد الإلكتروني الأول"
                value="Mohamedabozieed@gmail.com"
                dir="ltr"
              />
              <InfoRow
                icon={<Mail size={18} className="text-terracotta" />}
                label="البريد الإلكتروني الثاني"
                value="mohamedabozieed@gmail.com"
                dir="ltr"
              />
              <div className="sm:col-span-2">
                <InfoRow
                  icon={<MapPin size={18} className="text-terracotta" />}
                  label="العنوان الأساسي"
                  value="مدينة الشروق، خلف كومباوند حسن علام، المنطقة السابعة، القاهرة، مصر"
                />
              </div>

            </div>
          </div>
        </div>

        {/* Store Description */}
        <div className="bg-white rounded-3xl shadow-sm border border-warm-100 p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-warm-100 rounded-xl flex items-center justify-center">
              <ShoppingBag size={20} className="text-warm-700" />
            </div>
            <h2 className="text-xl font-bold text-warm-800 font-serif">عن المتجر</h2>
          </div>
          <p className="text-warm-600 leading-relaxed text-sm">
            <span className="font-bold text-warm-800">ديكوريستا (Decorista)</span> هو متجر إلكتروني مصري متخصص في بيع المنتجات المنزلية والديكورات الأنيقة، يقدم تشكيلة واسعة من تروليات الراتان، وحدات التخزين، والأرفف العصرية.
          </p>
          <p className="text-warm-600 leading-relaxed text-sm mt-3">
            يهدف المتجر إلى مساعدة العملاء على تنظيم منازلهم بأسلوب عصري وعملي، مع ضمان جودة المنتجات وتوفير تجربة تسوق سلسة وآمنة عبر الإنترنت.
          </p>
        </div>

        {/* Store Link for Payoneer */}
        <div className="bg-warm-50 border border-warm-200 rounded-3xl p-6">
          <h3 className="font-bold text-warm-800 mb-3 text-lg">رابط المتجر الإلكتروني</h3>
          <a
            href="https://decorista.onspace.app"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-terracotta font-semibold hover:underline text-lg break-all"
          >
            <ExternalLink size={18} />
            https://decorista.onspace.app
          </a>
          <p className="text-warm-500 text-sm mt-2">
            الموقع الرسمي لمتجر ديكوريستا — يعرض المنتجات ويتيح الشراء مباشرة
          </p>
        </div>

      </div>

      <Footer />
    </div>
  );
}

// Helper component
function InfoRow({
  icon,
  label,
  value,
  dir: d,
  isLink,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  dir?: string;
  isLink?: boolean;
  href?: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-warm-50 rounded-2xl p-4">
      <div className="mt-0.5 shrink-0">{icon}</div>
      <div>
        <p className="text-warm-400 text-xs mb-0.5">{label}</p>
        {isLink ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-warm-800 font-semibold text-sm hover:text-terracotta break-all"
            dir={d as any}
          >
            {value}
          </a>
        ) : (
          <p className="text-warm-800 font-semibold text-sm break-all" dir={d as any}>
            {value}
          </p>
        )}
      </div>
    </div>
  );
}
