import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fija la raíz del proyecto para Turbopack e ignora lockfiles fuera de la carpeta.
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
