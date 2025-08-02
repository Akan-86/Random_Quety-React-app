import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

export default function LoginPage(): JSX.Element {
  const { user, loading, error, login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await login({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <form
        onSubmit={handleSubmit}
        aria-live="polite"
        className="w-full max-w-sm bg-white p-6 rounded shadow"
      >
        <fieldset disabled={loading}>
          <legend className="text-2xl font-bold mb-4">Giriş Yap</legend>

          <label htmlFor="login-email">E-posta</label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-3 p-2 border rounded"
          />

          <label htmlFor="login-password">Şifre</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mb-3 p-2 border rounded"
          />

          {error && (
            <div role="alert" className="text-red-600 mb-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded"
          >
            {loading ? "Bekleyiniz..." : "Giriş Yap"}
          </button>

          <p className="mt-4">
            Hesabın yok mu?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Kayıt ol
            </Link>
          </p>
        </fieldset>
      </form>
    </div>
  );
}
