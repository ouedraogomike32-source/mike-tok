import React, { useState } from "react";
import { signUp, signIn } from "../lib/supabaseClient";

export default function AuthScreen({ onAuthenticated }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data =
        mode === "signup"
          ? await signUp(email, password, username)
          : await signIn(email, password);
      onAuthenticated(data.user);
    } catch (err) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8" style={{ background: "#0A0A0F" }}>
      <h1 className="text-white text-2xl font-bold mb-1">
        {mode === "signup" ? "Créer un compte" : "Se connecter"}
      </h1>
      <p className="text-sm mb-6" style={{ color: "#8A8A94" }}>
        {mode === "signup" ? "Rejoins la communauté" : "Content de te revoir"}
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-xs flex flex-col gap-3">
        {mode === "signup" && (
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nom d'utilisateur"
            required
            className="rounded-xl px-4 py-3 text-sm text-white outline-none"
            style={{ background: "#15151D" }}
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="rounded-xl px-4 py-3 text-sm text-white outline-none"
          style={{ background: "#15151D" }}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mot de passe"
          required
          minLength={6}
          className="rounded-xl px-4 py-3 text-sm text-white outline-none"
          style={{ background: "#15151D" }}
        />

        {error && <p className="text-xs" style={{ color: "#FF5C7C" }}>{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="py-3 rounded-full font-semibold text-white text-sm mt-2"
          style={{ background: "linear-gradient(90deg, #8B5CF6, #FF5C7C)", opacity: loading ? 0.7 : 1 }}
        >
          {loading ? "..." : mode === "signup" ? "S'inscrire" : "Se connecter"}
        </button>
      </form>

      <button
        onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
        className="text-sm mt-5"
        style={{ color: "#8A8A94" }}
      >
        {mode === "signup" ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
      </button>
    </div>
  );
    }
