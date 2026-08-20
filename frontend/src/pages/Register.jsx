import { useState } from "react";
import axiosInstance from "../util/axiosInstance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle";

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

const UserIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
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

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = {
        name: `${firstName} ${lastName}`,
        email: email,
        password: password,
      };

      await axiosInstance.post("/api/v8/signup", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Account Created Successfully!");

      navigate("/login");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen min-w-screen flex items-center justify-center px-4 py-10 relative
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
            FreelanceIO
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Finance management for the modern pro
          </p>
        </div>

        {/* Card title */}
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-300 text-center mb-5">
          Create your account
        </h2>

        {/* First + Last name */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
              First Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                <UserIcon />
              </span>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jane"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
              Last Name
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                <UserIcon />
              </span>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
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
              className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800"
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <LockIcon />
            </span>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOpenIcon /> : <EyeOffIcon />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1.5">
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <LockIcon />
            </span>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all focus:border-green-400 dark:focus:border-green-500 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900/40 focus:bg-white dark:focus:bg-slate-800"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((p) => !p)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              {showConfirm ? <EyeOpenIcon /> : <EyeOffIcon />}
            </button>
          </div>
        </div>

        {/* Terms checkbox */}
        <div
          className="flex items-start gap-2.5 mb-5 cursor-pointer select-none"
          onClick={() => setAgreed((p) => !p)}
        >
          <div
            className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center border transition-all flex-shrink-0 ${
              agreed
                ? "bg-green-500 border-green-500"
                : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800"
            }`}
          >
            {agreed && (
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
          <span className="text-sm text-slate-500 dark:text-slate-400 leading-snug">
            I agree to the{" "}
            <a
              href="#"
              className="text-green-700 dark:text-green-400 font-semibold hover:text-green-500 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-green-700 dark:text-green-400 font-semibold hover:text-green-500 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Privacy Policy
            </a>
          </span>
        </div>

        {/* Create Account Button */}
        <button
          type="button"
          onClick={handleRegister}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3 text-white text-sm font-semibold rounded-xl transition-all shadow-sm mb-5 ${
            loading
              ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 active:scale-[0.99] hover:shadow-md hover:shadow-green-200 dark:hover:shadow-green-900/40"
          }`}
        >
          {loading ? "Creating Account..." : "Create Account"}
          {!loading && <span className="text-base">→</span>}
        </button>

        {/* Footer link — inside card */}
        <p className="text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-green-700 dark:text-green-400 hover:text-green-500 transition-colors"
          >
            Sign in
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
