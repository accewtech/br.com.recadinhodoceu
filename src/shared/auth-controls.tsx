"use client";

import { useState } from "react";
import { useRouter } from "next/router";

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) {
        setErrorMessage("Não foi possível encerrar a sessão.");
        return;
      }

      await router.replace("/");
    } catch {
      setErrorMessage("Não foi possível conectar. Tente novamente.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <span className="auth-controls">
      <button
        className="logout-control"
        disabled={isLoggingOut}
        onClick={handleLogout}
        type="button"
      >
        {isLoggingOut ? "Saindo..." : "Sair"}
      </button>
      {errorMessage ? (
        <span className="auth-error" role="alert">
          {errorMessage}
        </span>
      ) : null}
    </span>
  );
}
