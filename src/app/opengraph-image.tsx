import { ImageResponse } from "next/og";

export const alt =
  "Incluye — Inclusión laboral que se mide y se hace realidad";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Tarjeta social de Incluye (dark, identidad de la marca).
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(1200px 600px at 80% -10%, #312e81 0%, #0b1020 45%, #060814 100%)",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Marca */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span
              style={{
                fontSize: 44,
                fontWeight: 800,
                color: "#ffffff",
                letterSpacing: -1,
              }}
            >
              incluye
            </span>
            <span style={{ fontSize: 44, fontWeight: 800, color: "#818cf8" }}>
              .
            </span>
          </div>
        </div>

        {/* Titular */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignSelf: "flex-start",
              padding: "8px 20px",
              borderRadius: 999,
              background: "rgba(129,140,248,0.15)",
              border: "1px solid rgba(129,140,248,0.35)",
              color: "#c7d2fe",
              fontSize: 24,
              fontWeight: 600,
              marginBottom: 28,
            }}
          >
            Ley 21.015 · Inclusión Laboral · Chile
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.05,
              letterSpacing: -2,
              maxWidth: 1000,
            }}
          >
            Inclusión laboral que se mide y se hace realidad.
          </div>
        </div>

        {/* Pie: propuesta de valor */}
        <div style={{ display: "flex", gap: 16 }}>
          {["🤟 Comunidad sorda", "Glosario LSCh", "Experiencias reales"].map(
            (chip) => (
              <div
                key={chip}
                style={{
                  display: "flex",
                  padding: "10px 22px",
                  borderRadius: 14,
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#e2e8f0",
                  fontSize: 26,
                  fontWeight: 600,
                }}
              >
                {chip}
              </div>
            ),
          )}
        </div>
      </div>
    ),
    { ...size },
  );
}
