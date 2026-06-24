import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle";


const handleGoogleLogin = () =>{
  window.location.href = "https://invoice-generator-z035.onrender.com/api/v8/auth/google";
}

const GoogleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 48 48">
    <path
      fill="#FFC107"
      d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.9z"
    />
    <path
      fill="#FF3D00"
      d="M6.3 14.7l6.6 4.8C14.6 15.8 19 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.5 6.5 29.5 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.3 0 10.1-2 13.7-5.2l-6.3-5.3C29.5 35.4 26.9 36 24 36c-5.3 0-9.7-3.3-11.3-8H6.1C9.5 35.8 16.2 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.6 20.1H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6.3 5.3C41 36 44 30.5 44 24c0-1.3-.1-2.6-.4-3.9z"
    />
  </svg>
);



const EyeOpenIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.9 17.4C16.3 18.4 14.2 19 12 19c-7 0-11-7-11-7a18.5 18.5 0 0 1 5.1-5.9" />
    <path d="M10.5 6.1A9.8 9.8 0 0 1 12 5c7 0 11 7 11 7a18.6 18.6 0 0 1-2.1 3" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const MailIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const ShieldIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    const loginData = {
      email,
      password,
    };

    try {
      setLoading(true);

      const response = await axios.post("/api/v8/login", loginData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      localStorage.setItem("token", response.data.accessToken);

      toast.success("Account Logged-In Successfully!", {
        className: "bg-green-600 text-white",
      });

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 relative
        bg-[linear-gradient(145deg,#e8edf5_0%,#dde4f0_40%,#e4eaf5_100%)]
        dark:bg-[linear-gradient(145deg,#0f172a_0%,#111827_50%,#0f172a_100%)]
        transition-colors duration-300"
    >
      {/* Theme toggle — top right corner */}
      <div className="absolute top-5 right-5">
        <ThemeToggle />
      </div>

      {/* Single centered card — everything inside */}
      <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl dark:shadow-black/40 px-8 py-8 transition-colors duration-300">
        {/* Logo + branding — centered inside card */}
        <div className="flex flex-col items-center mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3"
            style={{
              background: "linear-gradient(135deg, #22c55e, #16a34a)",
              boxShadow: "0 4px 18px rgba(34,197,94,0.3)",
            }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
              <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
              <path d="M9 21V12h6v9" fill="white" opacity="0.7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-black dark:text-white tracking-tight">
            FreelancIO
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Finance management for the modern pro
          </p>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-left text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <MailIcon />
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Password
            </label>
            <button
              type="button"
              onClick={() => navigate("/forget-password")}
              className="text-xs font-semibold text-green-700 dark:text-green-400 hover:text-green-500 transition-colors"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <LockIcon />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors p-0.5"
            >
              {showPassword ? <EyeOpenIcon /> : <EyeOffIcon />}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <div
          className="flex items-center gap-2 mb-6 cursor-pointer select-none"
          onClick={() => setRemember((p) => !p)}
        >
          <div
            className={`w-4 h-4 rounded flex items-center justify-center border transition-all flex-shrink-0 ${
              remember
                ? "bg-green-500 border-green-500"
                : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800"
            }`}
          >
            {remember && (
              <svg
                className="w-2.5 h-2.5"
                viewBox="0 0 12 10"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="1,5 4.5,9 11,1" />
              </svg>
            )}
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Remember this device
          </span>
        </div>

        {/* Login Button */}
        <button
          type="button"
          onClick={handleLogin}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3 text-white text-sm font-semibold rounded-xl transition-all shadow-sm mb-5 ${
            loading
              ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 active:scale-[0.99] hover:shadow-md hover:shadow-green-200 dark:hover:shadow-green-900/40"
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Logging in...
            </>
          ) : (
            <>
              Login <span className="text-base">→</span>
            </>
          )}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
            Or continue with
          </span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        {/* Google Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2.5 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 rounded-xl transition-all shadow-sm hover:shadow-md mb-5"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        {/* Footer link — inside card */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-semibold text-green-700 dark:text-green-400 hover:text-green-500 transition-colors"
          >
            Get started for free
          </a>
        </p>

        {/* Security badge — inside card */}
        <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-slate-400 dark:text-slate-500">
          <ShieldIcon />
          <span>AES-256 Encrypted</span>
        </div>
      </div>
    </div>
  );
}
