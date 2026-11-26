"use client";

// global-error reemplaza al layout raíz, por eso incluye <html>/<body> y NO
// depende de Tailwind (globals.css no se carga aquí): estilos en línea.
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="es-CL">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem",
          textAlign: "center",
          backgroundColor: "#060814",
          color: "#e2e8f0",
          fontFamily:
            "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
        }}
      >
        <p style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
          incluye<span style={{ color: "#818cf8" }}>.</span>
        </p>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
          Algo salió mal
        </h1>
        <p style={{ color: "#94a3b8", maxWidth: "28rem", margin: 0 }}>
          Ocurrió un error inesperado. Intenta de nuevo; si el problema
          persiste, vuelve más tarde.
        </p>
        {error.digest && (
          <p style={{ color: "#64748b", fontSize: "0.75rem", margin: 0 }}>
            Código de referencia: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          style={{
            marginTop: "0.5rem",
            border: "none",
            cursor: "pointer",
            borderRadius: "9999px",
            backgroundColor: "#4f46e5",
            color: "#ffffff",
            padding: "0.625rem 1.25rem",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
