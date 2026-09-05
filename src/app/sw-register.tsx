"use client";

import { useEffect } from "react";

/** Registra el service worker para habilitar la instalación como PWA. */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Silencioso: si falla, la app sigue funcionando como web normal.
      });
    };
    // Si la página ya cargó (el efecto corre después del evento 'load'),
    // registrar de inmediato; si no, esperar a 'load' para no competir con el arranque.
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register);
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
