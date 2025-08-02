import React, { useState, useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

export default function RegisterPage(): JSX.Element {
  const { user, loading, error, register } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await register({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5">
      <form
        onSubmit={handleSubmit}
        aria-live="polite"
        className="w-full max-w-sm bg-white p-6 rounded shadow"
      >
        <fieldset disabled={loading}>
          <legend className="text-2xl font-bold mb-4">Kayıt Ol</legend>

          <label htmlFor="reg-email">E-posta</label>
          <input
            id="reg-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mb-3 p-2 border rounded"
          />

          <label htmlFor="reg-password">Şifre (min. 6 karakter)</label>
          <input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full mb-3 p-2 border rounded"
          />

          {error && (
            <div role="alert" className="text-red-600 mb-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            {loading ? "Bekleyiniz..." : "Kayıt Ol"}
          </button>

          <p className="mt-4">
            Zaten hesabın var mı?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Giriş yap
            </Link>
          </p>
        </fieldset>
      </form>
    </div>
  );
}
