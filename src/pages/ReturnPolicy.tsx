import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Phone,
  ArrowRight,
} from "lucide-react";

export default function ReturnPolicy() {
  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      <Header />

      {/* Hero */}
      <div className="bg-warm-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <RefreshCw size={32} className="text-warm-200" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-3">
            سياسة الاستبدال والاسترجاع
          </h1>
          <p className="text-warm-300 text-lg">
            رضاك غايتنا — نضمن لك تجربة تسوق آمنة ومريحة
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">

        {/* Overview */}
        <div className="bg-white rounded-3xl shadow-sm border border-warm-100 p-8">
          <h2 className="text-xl font-bold text-warm-800 font-serif mb-4 flex items-center gap-2">
            <AlertCircle size={22} className="text-terracotta" />
            نظرة عامة
          </h2>
          <p className="text-warm-600 leading-relaxed">
            في <span className="font-bold text-warm-800">ديكوريستا</span>، نحرص على رضا عملائنا بالكامل. إذا لم تكن راضياً عن منتجك لأي سبب، فنحن هنا لمساعدتك. يُرجى قراءة سياسة الاستبدال والاسترجاع التالية بعناية.
          </p>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-3xl shadow-sm border border-warm-100 p-8">
          <h2 className="text-xl font-bold text-warm-800 font-serif mb-6 flex items-center gap-2">
            <Clock size={22} className="text-terracotta" />
            مدة الاسترجاع والاستبدال
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw size={18} className="text-green-600" />
                <h3 className="font-bold text-green-800">الاستبدال</h3>
              </div>
              <p className="text-green-700 text-sm leading-relaxed">
                يمكن استبدال المنتج خلال <span className="font-bold">7 أيام</span> من تاريخ الاستلام، بشرط أن يكون في حالته الأصلية وغير مستخدم.
              </p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <ArrowRight size={18} className="text-blue-600" />
                <h3 className="font-bold text-blue-800">الاسترجاع</h3>
              </div>
              <p className="text-blue-700 text-sm leading-relaxed">
                يمكن استرجاع المنتج واسترداد قيمته خلال <span className="font-bold">14 يوماً</span> من تاريخ الاستلام في الحالات المؤهلة.
              </p>
            </div>
          </div>
        </div>

        {/* Conditions for Return */}
        <div className="bg-white rounded-3xl shadow-sm border border-warm-100 p-8">
          <h2 className="text-xl font-bold text-warm-800 font-serif mb-6 flex items-center gap-2">
            <CheckCircle size={22} className="text-green-500" />
            شروط قبول الاسترجاع والاستبدال
          </h2>
          <div className="space-y-3">
            {[
              "المنتج في حالته الأصلية وغير مستخدم",
              "العبوة الأصلية سليمة ومحتوياتها كاملة",
              "وجود فاتورة الشراء أو رقم الطلب",
              "إبلاغنا خلال المدة المحددة عبر واتساب أو البريد الإلكتروني",
              "المنتج به عيب مصنعي موثق بصور أو فيديو",
              "المنتج المُستلم مختلف عن المطلوب أو به خلل واضح",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <CheckCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
                <p className="text-warm-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Non-returnable */}
        <div className="bg-white rounded-3xl shadow-sm border border-warm-100 p-8">
          <h2 className="text-xl font-bold text-warm-800 font-serif mb-6 flex items-center gap-2">
            <XCircle size={22} className="text-red-500" />
            حالات لا يُقبل فيها الاسترجاع
          </h2>
          <div className="space-y-3">
            {[
              "المنتجات المستخدمة أو التي بها آثار استخدام",
              "المنتجات التالفة بسبب سوء الاستخدام من قِبل العميل",
              "مرور أكثر من 14 يوماً على تاريخ الاستلام",
              "المنتجات التي فُقدت عبوتها الأصلية أو ملحقاتها",
              "الطلبات المخصصة أو المُصنّعة حسب الطلب",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <XCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-warm-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Process */}
        <div className="bg-white rounded-3xl shadow-sm border border-warm-100 p-8">
          <h2 className="text-xl font-bold text-warm-800 font-serif mb-6 flex items-center gap-2">
            <ArrowRight size={22} className="text-terracotta" />
            خطوات طلب الاسترجاع أو الاستبدال
          </h2>
          <div className="space-y-4">
            {[
              { step: "١", title: "تواصل معنا", desc: "أرسل لنا رقم طلبك وسبب الاسترجاع/الاستبدال عبر واتساب أو البريد الإلكتروني مع صور المنتج." },
              { step: "٢", title: "المراجعة والموافقة", desc: "يقوم فريقنا بمراجعة طلبك خلال 24-48 ساعة والرد عليك بالموافقة أو طلب مزيد من التفاصيل." },
              { step: "٣", title: "إعادة المنتج", desc: "بعد الموافقة، يتم تحديد موعد لاستلام المنتج من عنوانك أو إرشادك لإعادته." },
              { step: "٤", title: "الاسترداد أو الاستبدال", desc: "يتم إتمام الاستبدال أو رد المبلغ خلال 5-7 أيام عمل بعد استلام المنتج المُعاد وفحصه." },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-warm-800 text-white flex items-center justify-center font-bold text-lg shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-bold text-warm-800 mb-1">{item.title}</h3>
                  <p className="text-warm-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Methods */}
        <div className="bg-warm-50 rounded-3xl border border-warm-200 p-8">
          <h2 className="text-xl font-bold text-warm-800 font-serif mb-4">طرق رد المبلغ</h2>
          <div className="space-y-3 text-warm-700 text-sm">
            <p>• <span className="font-bold">فودافون كاش:</span> يُرد المبلغ على نفس رقم الهاتف المستخدم في الدفع خلال 3-5 أيام عمل.</p>
            <p>• <span className="font-bold">فيزا / ماستركارد:</span> يُرد المبلغ على البطاقة المستخدمة خلال 7-10 أيام عمل حسب البنك.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-warm-800 rounded-3xl p-8 text-center text-white">
          <Phone size={32} className="mx-auto mb-3 text-warm-300" />
          <h2 className="text-xl font-bold font-serif mb-2">هل لديك استفسار؟</h2>
          <p className="text-warm-300 mb-6 text-sm">فريقنا جاهز لمساعدتك في أي وقت</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/201069787615"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
            >
              تواصل عبر واتساب
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-colors"
            >
              صفحة التواصل
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
