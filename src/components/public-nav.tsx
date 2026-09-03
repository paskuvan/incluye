"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/empleos", label: "Empleos" },
  { href: "/experiencias", label: "Experiencias" },
  { href: "/empresas", label: "Empresas" },
  { href: "/gestores", label: "Gestores" },
  { href: "/interpretes", label: "Intérpretes" },
  { href: "/recursos", label: "Recursos" },
  { href: "/glosario", label: "Glosario LSCh" },
];

export default function PublicNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight"
          onClick={() => setOpen(false)}
        >
          incluye<span className="text-indigo-500">.</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(l.href)
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="ml-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Ingresar
          </Link>
        </nav>

        {/* Mobile: botón + Ingresar */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/login"
            className="rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-500"
          >
            Ingresar
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="rounded-lg border border-slate-300 p-2 dark:border-slate-700"
          >
            <span aria-hidden="true" className="block text-lg leading-none">
              {open ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </div>

      {/* Panel móvil */}
      {open && (
        <nav className="border-t border-slate-200 bg-white px-6 py-3 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <ul className="space-y-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                    isActive(l.href)
                      ? "bg-indigo-600 text-white"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-6">
        <span>Incluye · Portal de accesibilidad para empresas</span>
        <Link href="/privacidad" className="hover:text-indigo-500">
          Privacidad
        </Link>
        <Link href="/verificar" className="hover:text-indigo-500">
          Verificar certificado
        </Link>
      </div>
    </footer>
  );
}
