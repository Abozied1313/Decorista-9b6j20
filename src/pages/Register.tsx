import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { mapSupabaseUser, useAuth } from "@/stores/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff, Home, Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";

type Step = "form" | "otp";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username || !password) return;
    if (password.length < 6) {
      toast.error("كلمة المرور يجب أن تكون 6 أحرف على الأقل");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
    setStep("otp");
  };

  const verifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    setLoading(true);
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    if (error) {
      toast.error("رمز التحقق غير صحيح أو منتهي الصلاحية");
      setLoading(false);
      return;
    }
    // Set password and username
    const { data: updateData, error: updateError } = await supabase.auth.updateUser({
      password,
      data: { username },
    });
    if (updateError) {
      toast.error(updateError.message);
      setLoading(false);
      return;
    }
    if (updateData.user) {
      login(mapSupabaseUser(updateData.user));
      toast.success("تم إنشاء حسابك بنجاح! مرحباً بك في ديكوريستا");
      navigate("/account");
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src="/logo.jpg" alt="Decorista" className="h-14 w-20 object-contain" />
            <span className="text-2xl font-bold text-warm-800 font-serif">Decorista</span>
          </Link>
          <h1 className="text-xl font-bold text-warm-800 mt-4 font-serif">إنشاء حساب جديد</h1>
          <p className="text-warm-500 text-sm mt-1">انضم إلى عائلة ديكوريستا</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-warm-100 p-8">
          {step === "form" && (
            <form onSubmit={sendOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">الاسم</label>
                <div className="relative">
                  <User size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="اسمك الكريم"
                    required
                    className="w-full border border-warm-200 rounded-xl py-3 pr-10 pl-4 text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-400 bg-warm-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">البريد الإلكتروني</label>
                <div className="relative">
                  <Mail size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    required
                    className="w-full border border-warm-200 rounded-xl py-3 pr-10 pl-4 text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-400 bg-warm-50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">كلمة المرور</label>
                <div className="relative">
                  <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="6 أحرف على الأقل"
                    required
                    minLength={6}
                    className="w-full border border-warm-200 rounded-xl py-3 pr-10 pl-10 text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-400 bg-warm-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-warm-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-warm-800 text-white py-3 rounded-xl font-semibold hover:bg-warm-900 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                إرسال رمز التحقق
              </button>
              <p className="text-center text-sm text-warm-500">
                لديك حساب؟{" "}
                <Link to="/login" className="text-terracotta font-medium hover:underline">
                  تسجيل الدخول
                </Link>
              </p>
            </form>
          )}

          {step === "otp" && (
            <form onSubmit={verifyAndRegister} className="space-y-5">
              <div className="text-center bg-warm-50 rounded-2xl p-4 mb-2">
                <p className="text-warm-700 text-sm">تم إرسال رمز مكون من 4 أرقام إلى</p>
                <p className="text-warm-900 font-bold">{email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">رمز التحقق</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="0000"
                  maxLength={4}
                  required
                  className="w-full border border-warm-200 rounded-xl py-3 px-4 text-warm-800 focus:outline-none focus:ring-2 focus:ring-warm-400 bg-warm-50 text-center text-2xl tracking-widest font-bold"
                />
              </div>
              <button
                type="submit"
                disabled={loading || otp.length < 4}
                className="w-full bg-warm-800 text-white py-3 rounded-xl font-semibold hover:bg-warm-900 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                إنشاء الحساب
              </button>
              <button
                type="button"
                onClick={() => setStep("form")}
                className="w-full text-warm-500 text-sm hover:text-warm-700"
              >
                رجوع
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-warm-500 hover:text-warm-700 text-sm">
            <Home size={14} />
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  );
}
