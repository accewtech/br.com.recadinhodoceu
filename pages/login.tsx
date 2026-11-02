"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/router";

function getReturnTo(value: string | string[] | undefined) {
  return value === "/v1" || value === "/v2" ? value : "/v2";
}

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const result: { error?: string } = await response.json();
        setErrorMessage(result.error ?? "Não foi possível iniciar a sessão.");
        return;
      }

      await router.replace(getReturnTo(router.query.returnTo));
    } catch {
      setErrorMessage("Não foi possível conectar. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <section aria-labelledby="login-title" className="auth-card">
        <p className="auth-eyebrow">RECADO DO DIA</p>
        <h1 id="login-title">Entrar</h1>
        <p className="auth-description">Acesse o editor de mensagens.</p>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Usuário
            <input
              autoComplete="username"
              onChange={(event) => setUsername(event.target.value)}
              required
              value={username}
            />
          </label>
          <label>
            Senha
            <input
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {errorMessage ? (
            <p className="auth-error" role="alert">
              {errorMessage}
            </p>
          ) : null}
          <button className="download-button" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </section>
    </main>
  );
}
