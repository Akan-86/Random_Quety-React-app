// src/pages/LoginPage.tsx
import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const emailRegex = /^\S+@\S+\.\S+$/;

export default function LoginPage(): JSX.Element {
  const { user, loading, error, login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  if (user) return <Navigate to="/" replace />;

  const validate = () => {
    const errs: { email?: string; password?: string } = {};
    const emailTrimmed = email.trim();

    if (!emailTrimmed) {
      errs.email = "Email is required.";
    } else if (!emailRegex.test(emailTrimmed)) {
      errs.email = "Please enter a valid email address.";
    }

    if (!password) {
      errs.password = "Password is required.";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters.";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const emailTrimmed = email.trim();
    await login({ email: emailTrimmed, password });
  };

  const isValidLive = emailRegex.test(email.trim()) && password.length >= 6;

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-live="polite"
        className="w-full max-w-sm bg-white p-6 rounded shadow"
      >
        <fieldset disabled={loading}>
          <legend className="text-2xl font-bold mb-4">Sign In</legend>

          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email)
                setFieldErrors((p) => ({ ...p, email: undefined }));
            }}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={
              fieldErrors.email ? "login-email-error" : undefined
            }
            className={`w-full mb-1 p-2 border rounded ${
              fieldErrors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldErrors.email && (
            <p id="login-email-error" className="mb-3 text-sm text-red-600">
              {fieldErrors.email}
            </p>
          )}

          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password)
                setFieldErrors((p) => ({ ...p, password: undefined }));
            }}
            aria-invalid={!!fieldErrors.password}
            aria-describedby={
              fieldErrors.password ? "login-password-error" : undefined
            }
            className={`w-full mb-1 p-2 border rounded ${
              fieldErrors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldErrors.password && (
            <p id="login-password-error" className="mb-3 text-sm text-red-600">
              {fieldErrors.password}
            </p>
          )}

          {error && (
            <div role="alert" className="text-red-600 mb-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={!isValidLive || loading}
            className={`w-full py-2 rounded text-white ${
              !isValidLive || loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Please wait..." : "Sign In"}
          </button>

          <p className="mt-4">
            Don’t have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </fieldset>
      </form>
    </div>
  );
}
