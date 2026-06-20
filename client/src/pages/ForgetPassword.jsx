import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

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

const ArrowLeftIcon = () => (
  <svg
    className="w-3.5 h-3.5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="9 12 11 14 16 9" />
  </svg>
);

const LogoMark = () => (
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
);

const SecurityBadge = ({ label = "AES-256 Encrypted" }) => (
  <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-slate-400">
    <ShieldIcon />
    <span>{label}</span>
  </div>
);

/* -------------------------------------------------------
   STEP 1 — Forgot Password (email entry)
------------------------------------------------------- */
function ForgotPasswordStep({ email, setEmail, onSubmit , loading }) {
  
  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-8">
      <div className="flex flex-col items-center mb-6">
        <LogoMark />
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          FreelancIO
        </h1>
      </div>

      <h2 className="text-lg font-bold text-slate-800 text-center mb-1.5">
        Forgot Password
      </h2>
      <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
        Enter the email address associated with your account and we'll send you
        a reset code.
      </p>

      <div className="mb-5">
        <label className="block text-sm font-medium text-slate-600 mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <MailIcon />
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@company.com"
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className={`w-full flex items-center justify-center gap-2 py-3 text-white text-sm font-semibold rounded-xl transition-all shadow-sm ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
        disabled={loading}
      >
        {loading ? "Processing..." : "Send Reset Code"}{" "}
        <span className="text-base">→</span>
      </button>

      <a
        href="/login"
        className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeftIcon /> Back to Login
      </a>
    </div>
  );
}

/* -------------------------------------------------------
   STEP 2 — Verify Email (6-digit code)
------------------------------------------------------- */
function VerifyEmailStep({ email, code, setCode, onSubmit, onResend, loading }) {
  const inputsRef = useRef([]);

  const maskedEmail = (() => {
    const [user, domain] = (email || "j.smith@freelancemail.com").split("@");
    if (!domain) return email;
    const visible = user.slice(0, 1);
    return `${visible}${"*".repeat(Math.max(user.length - 1, 3))}@${domain}`;
  })();

  const handleChange = (idx, val) => {
    if (!/^[0-9]?$/.test(val)) return;
    const next = [...code];
    next[idx] = val;
    setCode(next);
    if (val && idx < 5) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = text.split("");
    while (next.length < 6) next.push("");
    setCode(next);
    const lastIdx = Math.min(text.length, 6) - 1;
    inputsRef.current[lastIdx]?.focus();
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-8">
      <div className="flex flex-col items-center mb-6">
        <LogoMark />
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          FreelancIO
        </h1>
      </div>

      <h2 className="text-lg font-bold text-slate-800 text-center mb-1.5">
        Verify Email
      </h2>
      <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
        We've sent a 6-digit verification code to{" "}
        <span className="font-semibold text-slate-700">{maskedEmail}</span>.
        Please enter it below.
      </p>

      <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
        {code.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputsRef.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            className="w-11 h-12 text-center text-lg font-semibold bg-white border border-slate-200 rounded-xl text-slate-800 outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100"
          />
        ))}
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className={`w-full flex items-center justify-center gap-2 py-3 text-white text-sm font-semibold rounded-xl transition-all shadow-sm ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
        disabled={loading}
      >
        {loading ? "Verifying..." : "Verify Code"} <CheckCircleIcon />
      </button>

      <p className="text-center text-sm text-slate-500 mb-5">
        Didn't receive the code?{" "}
        <button
          type="button"
          onClick={onResend}
          className="font-semibold text-green-700 hover:text-green-500 transition-colors"
        >
          Resend Code
        </button>
      </p>

      <a
        href="/login"
        className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeftIcon /> Back to Sign in
      </a>
    </div>
  );
}

/* -------------------------------------------------------
   STEP 3 — Reset Password (new password)
------------------------------------------------------- */
function ResetPasswordStep({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
  loading
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const hasMinLength = password.length >= 8;
  const hasUpperAndNumber = /[A-Z]/.test(password) && /[0-9]/.test(password);

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-xl px-8 py-8">
      <div className="flex flex-col items-center mb-6">
        <LogoMark />
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          FreelancIO
        </h1>
      </div>

      <h2 className="text-lg font-bold text-slate-800 text-center mb-1.5">
        Reset Password
      </h2>
      <p className="text-sm text-slate-500 text-center mb-6 leading-relaxed">
        Choose a strong, secure password for your FreelancIO account.
      </p>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-600 mb-1.5">
          New Password
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <LockIcon />
          </span>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100"
          />
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <EyeOpenIcon /> : <EyeOffIcon />}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-600 mb-1.5">
          Confirm New Password
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <LockIcon />
          </span>
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            className="w-full pl-9 pr-10 py-2.5 text-sm bg-white border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-green-400 focus:ring-2 focus:ring-green-100"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showConfirm ? <EyeOpenIcon /> : <EyeOffIcon />}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-1.5 mb-6">
        <div
          className={`flex items-center gap-1.5 text-xs ${hasMinLength ? "text-green-600" : "text-slate-400"}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${hasMinLength ? "bg-green-500" : "bg-slate-300"}`}
          />
          At least 8 characters long
        </div>
        <div
          className={`flex items-center gap-1.5 text-xs ${hasUpperAndNumber ? "text-green-600" : "text-slate-400"}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${hasUpperAndNumber ? "bg-green-500" : "bg-slate-300"}`}
          />
          Includes uppercase and numbers
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className={`w-full flex items-center justify-center gap-2 py-3 text-white text-sm font-semibold rounded-xl transition-all shadow-sm ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-500 hover:bg-green-600"
        }`}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update Password"}{" "}
        <span className="text-base">→</span>
      </button>

      <a
        href="/login"
        className="flex items-center justify-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeftIcon /> Back to Sign in
      </a>
    </div>
  );
}

/* -------------------------------------------------------
   MAIN COMPONENT — manages the 3-step flow
------------------------------------------------------- */
export default function ForgotPasswordFlow() {
  const [step, setStep] = useState(1); // 1 = email, 2 = verify, 3 = reset
  const [email, setEmail] = useState("");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "/api/v8/forgetpassword",
        { email },
        {
          withCredentials: true,
        },
      );

      toast.success(response.data.message);
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    const otp = code.join("");

    if (otp.length !== 6) {
      toast.error("Enter complete OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "/api/v8/verify_otp",
        { otp },
        {
          withCredentials: true,
        },
      );

      toast.success(response.data.message);
      setStep(3);
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };
  const handleResendCode = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "/api/v8/forgetpassword",
        { email },
        {
          withCredentials: true,
        },
      );

      setCode(["", "", "", "", "", ""]);

      toast.success("OTP resent successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!password) {
      toast.error("Password is required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "/api/v8/setNewPassword",
        {
          newpassword: password,
        },
        {
          withCredentials: true,
        },
      );

      toast.success(response.data.message);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        background:
          "linear-gradient(145deg, #e8edf5 0%, #dde4f0 40%, #e4eaf5 100%)",
      }}
    >
      {step === 1 && (
        <ForgotPasswordStep
          email={email}
          setEmail={setEmail}
          onSubmit={handleSendCode}
          loading={loading}
        />
      )}
      {step === 2 && (
        <VerifyEmailStep
          email={email}
          code={code}
          setCode={setCode}
          onSubmit={handleVerifyCode}
          onResend={handleResendCode}
          loading={loading}
        />
      )}
      {step === 3 && (
        <ResetPasswordStep
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          onSubmit={handleResetPassword}
          loading={loading}
        />
      )}
    </div>
  );
}
