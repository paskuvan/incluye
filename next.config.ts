import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Oculta el indicador de desarrollo de Next (badge flotante) para capturas limpias.
  devIndicators: false,
  // Fija la raíz del proyecto para Turbopack e ignora lockfiles fuera de la carpeta.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
