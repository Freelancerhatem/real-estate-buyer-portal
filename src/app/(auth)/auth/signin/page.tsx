"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { FaGoogle, FaFacebook } from "react-icons/fa";
import bg from "@/assets/images/auth-bg.png";
import Link from "next/link";
import { useUnifiedAuth } from "@/hooks/useUnifiedAuth";
import type { AxiosError } from "axios";
import DemoCredentials from "@/components/signin/Demo";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, socialLogin, loading } = useUnifiedAuth();

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError("");

    try {
      await login(email, password); // redirects on success
      if (rememberMe) localStorage.setItem("rememberedEmail", email);
      else localStorage.removeItem("rememberedEmail");
    } catch (err: unknown) {
      const axiosErr = err as AxiosError<{ message?: string }>;
      const msg =
        axiosErr.response?.data?.message ??
        axiosErr.message ??
        "Invalid email or password. Please try again.";
      setError(msg);
    }
  };

  const handleGoogleLogin = () => socialLogin("google");
  const handleFacebookLogin = () => socialLogin("facebook");

  // called by DemoCredentials
  const fillAndMaybeLogin = async (
    demoEmail: string,
    demoPassword: string,
    autoSubmit?: boolean
  ) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    if (autoSubmit && !loading) {
      try {
        await login(demoEmail, demoPassword);
      } catch (err) {
        const axiosErr = err as AxiosError<{ message?: string }>;
        setError(
          axiosErr.response?.data?.message ??
            axiosErr.message ??
            "Demo login failed."
        );
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={bg}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>

      {/* Login Box */}
      <div className="relative z-10 w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>
        {error && (
          <p className="text-red-500 text-sm text-center mt-2">{error}</p>
        )}

        <form className="space-y-4 mt-6" onSubmit={handleLogin}>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute inset-y-0 right-4 flex items-center text-sm text-gray-500"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {/* Remember Me and Forgot Password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 border-gray-300 rounded text-primary focus:ring-primary"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              Remember me
            </label>
            <Link
              href="/forgot-password"
              className="text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white rounded-lg shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary-dark"
            } focus:outline-none`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Social Login */}
          <div className="mt-4 text-center space-y-2">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center py-2 border border-gray-300 bg-white rounded-lg shadow-sm hover:bg-gray-100"
            >
              <FaGoogle className="mr-2" />
              Login with Google
            </button>
            <button
              type="button"
              onClick={handleFacebookLogin}
              className="w-full flex items-center justify-center py-2 border border-gray-300 bg-white rounded-lg shadow-sm hover:bg-gray-100"
            >
              <FaFacebook className="mr-2" />
              Login with Facebook
            </button>
          </div>

          {/* Demo credentials panel — appears only if enabled via env */}
          <DemoCredentials onFill={fillAndMaybeLogin} />

          {/* Register Link */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <Link href="/registration" className="text-primary hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
