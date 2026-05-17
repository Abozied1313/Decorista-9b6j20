import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
} from "lucide-react";

export default function Contact() {
  const whatsappLink = "https://wa.me/201069787615?text=مرحباً، أريد الاستفسار عن...";

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      <Header />

      {/* Hero */}
      <div className="bg-warm-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <MessageCircle size={32} className="text-warm-200" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-serif mb-3">اتصل بنا</h1>
          <p className="text-warm-300 text-lg">نحن هنا لمساعدتك — تواصل معنا بأي طريقة تناسبك</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          {/* Phone / WhatsApp */}
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-3xl shadow-sm border border-warm-100 p-6 text-center hover:border-green-300 hover:shadow-md transition-all"
          >
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-100 transition-colors">
              <Phone size={26} className="text-green-600" />
            </div>
            <h3 className="font-bold text-warm-800 text-lg mb-1">رقم الهاتف</h3>
            <p className="text-warm-500 text-sm mb-3">واتساب ومكالمات</p>
            <p className="text-warm-900 font-bold text-lg tracking-wide" dir="ltr">
              01069787615
            </p>
            <span className="inline-block mt-3 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
              اضغط للتواصل عبر واتساب
            </span>
          </a>

          {/* Email */}
          <a
            href="mailto:Mohamedabozieed@gmail.com"
            className="group bg-white rounded-3xl shadow-sm border border-warm-100 p-6 text-center hover:border-blue-300 hover:shadow-md transition-all"
          >
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-100 transition-colors">
              <Mail size={26} className="text-blue-600" />
            </div>
            <h3 className="font-bold text-warm-800 text-lg mb-1">البريد الإلكتروني</h3>
            <p className="text-warm-500 text-sm mb-3">نرد خلال 24 ساعة</p>
            <p className="text-warm-900 font-medium text-sm break-all" dir="ltr">
              Mohamedabozieed@gmail.com
            </p>
            <span className="inline-block mt-3 text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
              اضغط لإرسال بريد
            </span>
          </a>

          {/* Address */}
          <div className="bg-white rounded-3xl shadow-sm border border-warm-100 p-6 text-center">
            <div className="w-14 h-14 bg-terracotta/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <MapPin size={26} className="text-terracotta" />
            </div>
            <h3 className="font-bold text-warm-800 text-lg mb-1">العنوان</h3>
            <p className="text-warm-500 text-sm mb-3">موقعنا</p>
            <p className="text-warm-800 font-medium text-sm leading-relaxed">
              مدينة الشروق
              <br />
              خلف كومباوند حسن علام
              <br />
              المنطقة السابعة
            </p>
          </div>
        </div>

        {/* Working Hours */}
        <div className="bg-white rounded-3xl shadow-sm border border-warm-100 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-warm-100 rounded-xl flex items-center justify-center">
              <Clock size={20} className="text-warm-700" />
            </div>
            <h2 className="text-xl font-bold text-warm-800 font-serif">ساعات العمل</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { days: "السبت – الخميس", hours: "9:00 ص – 10:00 م", available: true },
              { days: "الجمعة", hours: "12:00 م – 8:00 م", available: true },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-warm-50 rounded-2xl px-5 py-4"
              >
                <div>
                  <p className="font-semibold text-warm-800">{item.days}</p>
                  <p className="text-warm-500 text-sm mt-0.5">{item.hours}</p>
                </div>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-medium ${
                    item.available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {item.available ? "متاح" : "مغلق"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Message via WhatsApp */}
        <div className="bg-gradient-to-br from-warm-800 to-warm-900 rounded-3xl p-8 text-white text-center">
          <MessageCircle size={36} className="mx-auto mb-4 text-green-400" />
          <h2 className="text-2xl font-bold font-serif mb-2">تحتاج مساعدة سريعة؟</h2>
          <p className="text-warm-300 mb-6 text-sm leading-relaxed">
            تواصل معنا عبر واتساب وسيرد عليك فريقنا في أقرب وقت ممكن
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-400 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg"
          >
            <MessageCircle size={22} />
            ابدأ المحادثة على واتساب
          </a>
          <p className="text-warm-400 text-xs mt-4" dir="ltr">+20 10 6978 7615</p>
        </div>

      </div>

      <Footer />
    </div>
  );
}
