import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { mapSupabaseUser, useAuth } from "@/stores/AuthContext";
import { toast } from "sonner";
import { Eye, EyeOff, Home, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

type Step = "email" | "otp" | "password_login";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const checkEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    // Send OTP regardless - supabase handles new/existing users
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: false },
    });
    setLoading(false);
    if (error) {
      // User might not exist, try password login
      setStep("password_login");
    } else {
      toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
      setStep("otp");
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
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
    if (data.user) {
      login(mapSupabaseUser(data.user));
      navigate("/account");
    }
  };

  const loginWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      setLoading(false);
      return;
    }
    login(mapSupabaseUser(data.user));
    navigate("/account");
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <img src="/logo.jpg" alt="Decorista" className="h-16 w-28 object-contain" />
            <span className="text-2xl font-bold text-warm-800 font-serif">Decorista</span>
          </Link>
          <h1 className="text-xl font-bold text-warm-800 mt-4 font-serif">تسجيل الدخول</h1>
          <p className="text-warm-500 text-sm mt-1">أهلاً بك مجدداً</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-warm-100 p-8">
          {/* Step: Email */}
          {step === "email" && (
            <form onSubmit={checkEmail} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">
                  البريد الإلكتروني
                </label>
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
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-warm-800 text-white py-3 rounded-xl font-semibold hover:bg-warm-900 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                متابعة
              </button>
              <p className="text-center text-sm text-warm-500">
                ليس لديك حساب؟{" "}
                <Link to="/register" className="text-terracotta font-medium hover:underline">
                  إنشاء حساب جديد
                </Link>
              </p>
            </form>
          )}

          {/* Step: OTP */}
          {step === "otp" && (
            <form onSubmit={verifyOtp} className="space-y-5">
              <div className="text-center bg-warm-50 rounded-2xl p-4 mb-2">
                <p className="text-warm-700 text-sm">
                  تم إرسال رمز مكون من 4 أرقام إلى
                </p>
                <p className="text-warm-900 font-bold">{email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">
                  رمز التحقق
                </label>
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
                تحقق وادخل
              </button>
              <button
                type="button"
                onClick={() => setStep("email")}
                className="w-full text-warm-500 text-sm hover:text-warm-700"
              >
                تغيير البريد الإلكتروني
              </button>
            </form>
          )}

          {/* Step: Password Login */}
          {step === "password_login" && (
            <form onSubmit={loginWithPassword} className="space-y-5">
              <div className="text-center bg-amber-50 rounded-2xl p-3 mb-2 text-sm text-amber-700">
                سجّل الدخول بكلمة المرور أو{" "}
                <Link to="/register" className="font-bold underline">
                  أنشئ حساباً جديداً
                </Link>
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-700 mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="كلمة المرور"
                    required
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
                {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                دخول
              </button>
              <button
                type="button"
                onClick={() => setStep("email")}
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
