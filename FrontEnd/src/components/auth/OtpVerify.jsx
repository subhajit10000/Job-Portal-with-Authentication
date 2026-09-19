import { useEffect, useRef, useState } from "react";
import { verifyOtp, resendOtp } from "../../api/authApi";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 45;

/**
 * Six-digit email OTP step. Shown once, right after registration (or if a
 * login attempt reports the account is still unverified) — never again
 * after the account's email is verified.
 */
export default function OtpVerify({ email, onVerified, onBack }) {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const focusInput = (index) => {
    inputRefs.current[index]?.focus();
    inputRefs.current[index]?.select();
  };

  const handleChange = (index, value) => {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    setDigits((prev) => {
      const next = [...prev];
      // Handles pasting a full code into a single box too.
      clean
        .split("")
        .slice(0, OTP_LENGTH - index)
        .forEach((d, i) => {
          next[index + i] = d;
        });
      return next;
    });

    const nextIndex = Math.min(index + clean.length, OTP_LENGTH - 1);
    focusInput(nextIndex);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const code = digits.join("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== OTP_LENGTH) {
      setError("Enter the full 6-digit code");
      return;
    }

    setError("");
    setLoading(true);
    try {
      const res = await verifyOtp({ email, otp: code });
      const { user, accessToken } = res.data;
      onVerified(user, accessToken);
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
      setDigits(Array(OTP_LENGTH).fill(""));
      focusInput(0);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setInfo("");
    setResending(true);
    try {
      await resendOtp({ email });
      setInfo("A new code has been sent to your email.");
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't resend the code.");
      if (err.response?.data?.retryAfter) {
        setCooldown(err.response.data.retryAfter);
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md card-surface rounded-2xl p-8 animate-fade-in">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 via-purple-500 to-fuchsia-500 text-2xl text-white shadow-lg shadow-indigo-500/30">
        ✉️
      </div>

      <h1 className="text-center text-2xl font-black text-(--color-text)">
        Check your email
      </h1>
      <p className="mt-2 text-center text-sm text-(--color-text-muted)">
        We sent a 6-digit verification code to
        <br />
        <span className="font-semibold text-(--color-text)">{email}</span>
      </p>

      {error && (
        <div className="mt-5 rounded-md bg-red-100 dark:bg-red-950/40 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-2 text-sm text-center">
          {error}
        </div>
      )}
      {info && !error && (
        <div className="mt-5 rounded-md bg-emerald-100 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-4 py-2 text-sm text-center">
          {info}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="flex justify-center gap-2 sm:gap-3">
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength={OTP_LENGTH}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="h-12 w-10 sm:h-14 sm:w-12 rounded-xl border border-(--color-border) bg-(--color-bg) text-center text-xl font-bold text-(--color-text) outline-none focus:border-(--color-navy) focus:ring-2 focus:ring-(--color-navy)/40"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-7 w-full rounded-xl bg-linear-to-r from-indigo-600 via-purple-600 to-fuchsia-600 text-white py-3 font-bold shadow-lg shadow-indigo-500/30 transition hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Email"}
        </button>
      </form>

      <div className="mt-5 flex items-center justify-between text-sm">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="text-(--color-text-muted) hover:text-(--color-text) transition"
          >
            ← Back
          </button>
        )}

        <button
          type="button"
          onClick={handleResend}
          disabled={resending || cooldown > 0}
          className="ml-auto font-semibold text-(--color-navy) hover:text-(--color-amber) transition disabled:opacity-50 disabled:hover:text-(--color-navy)"
        >
          {cooldown > 0 ? `Resend code in ${cooldown}s` : resending ? "Sending..." : "Resend code"}
        </button>
      </div>
    </div>
  );
}
