import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const emailRegex = /^\S+@\S+\.\S+$/;

export default function RegisterPage(): JSX.Element {
  const { user, loading, error, register } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  if (user) return <Navigate to="/" replace />;

  const validate = () => {
    const errs: {
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};
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

    if (!confirmPassword) {
      errs.confirmPassword = "Password confirmation is required.";
    } else if (password !== confirmPassword) {
      errs.confirmPassword = "Passwords do not match.";
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const emailTrimmed = email.trim();
    await register({ email: emailTrimmed, password });
  };

  const isValidLive =
    emailRegex.test(email.trim()) &&
    password.length >= 6 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <form
        onSubmit={handleSubmit}
        noValidate
        aria-live="polite"
        className="w-full max-w-sm bg-white p-6 rounded shadow"
      >
        <fieldset disabled={loading}>
          <legend className="text-2xl font-bold mb-4">Sign Up</legend>

          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.email)
                setFieldErrors((p) => ({ ...p, email: undefined }));
            }}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "reg-email-error" : undefined}
            className={`w-full mb-1 p-2 border rounded ${
              fieldErrors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldErrors.email && (
            <p id="reg-email-error" className="mb-3 text-sm text-red-600">
              {fieldErrors.email}
            </p>
          )}

          <label htmlFor="reg-password">Password (min. 6 characters)</label>
          <input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (fieldErrors.password)
                setFieldErrors((p) => ({ ...p, password: undefined }));
              if (
                fieldErrors.confirmPassword &&
                confirmPassword === e.target.value
              ) {
                setFieldErrors((p) => ({ ...p, confirmPassword: undefined }));
              }
            }}
            aria-invalid={!!fieldErrors.password}
            aria-describedby={
              fieldErrors.password ? "reg-password-error" : undefined
            }
            className={`w-full mb-1 p-2 border rounded ${
              fieldErrors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldErrors.password && (
            <p id="reg-password-error" className="mb-3 text-sm text-red-600">
              {fieldErrors.password}
            </p>
          )}

          <label htmlFor="reg-password-confirm">Confirm password</label>
          <input
            id="reg-password-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (fieldErrors.confirmPassword)
                setFieldErrors((p) => ({ ...p, confirmPassword: undefined }));
            }}
            aria-invalid={!!fieldErrors.confirmPassword}
            aria-describedby={
              fieldErrors.confirmPassword ? "reg-confirm-error" : undefined
            }
            className={`w-full mb-1 p-2 border rounded ${
              fieldErrors.confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
          />
          {fieldErrors.confirmPassword && (
            <p id="reg-confirm-error" className="mb-3 text-sm text-red-600">
              {fieldErrors.confirmPassword}
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
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Please wait..." : "Sign Up"}
          </button>

          <p className="mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </fieldset>
      </form>
    </div>
  );
}
