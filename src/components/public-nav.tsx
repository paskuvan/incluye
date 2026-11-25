"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";

// Enlace directo (acción principal).
const DIRECT = { href: "/empleos", label: "Empleos" };

// Menús agrupados por tema (Opción A).
const GROUPS = [
  {
    id: "comunidad",
    label: "Comunidad",
    items: [
      { href: "/empresas", label: "Empresas valoradas" },
      { href: "/experiencias", label: "Experiencias reales" },
    ],
  },
  {
    id: "apoyo",
    label: "Apoyo",
    items: [
      { href: "/gestores", label: "Gestores de inclusión" },
      { href: "/interpretes", label: "Intérpretes LSCh" },
    ],
  },
  {
    id: "recursos",
    label: "Recursos",
    items: [
      { href: "/recursos", label: "Guías y marco legal" },
      { href: "/glosario", label: "Glosario LSCh" },
    ],
  },
];

export default function PublicNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // menú móvil
  const [openGroup, setOpenGroup] = useState<string | null>(null); // desplegable escritorio
  const navRef = useRef<HTMLElement>(null);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const groupActive = (items: { href: string }[]) =>
    items.some((i) => isActive(i.href));

  // Cerrar los desplegables al hacer clic fuera o presionar Escape.
  useEffect(() => {
    if (!openGroup) return;
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenGroup(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenGroup(null);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [openGroup]);

  const itemClass = (href: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive(href)
        ? "bg-indigo-600 text-white"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
    }`;

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
        <nav ref={navRef} className="hidden items-center gap-1 md:flex">
          <Link href={DIRECT.href} className={itemClass(DIRECT.href)}>
            {DIRECT.label}
          </Link>

          {GROUPS.map((g) => {
            const isOpen = openGroup === g.id;
            const active = groupActive(g.items);
            return (
              <div key={g.id} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? null : g.id)}
                  aria-expanded={isOpen}
                  aria-haspopup="menu"
                  className={`flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active || isOpen
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
                >
                  {g.label}
                  <ChevronDownIcon
                    aria-hidden="true"
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-800 dark:bg-slate-900"
                  >
                    {g.items.map((l) => (
                      <Link
                        key={l.href}
                        href={l.href}
                        role="menuitem"
                        onClick={() => setOpenGroup(null)}
                        className={`block px-4 py-2 text-sm font-medium transition-colors ${
                          isActive(l.href)
                            ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300"
                            : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                        }`}
                      >
                        {l.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

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
            {open ? (
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Bars3Icon className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Panel móvil */}
      {open && (
        <nav className="border-t border-slate-200 bg-white px-6 py-3 md:hidden dark:border-slate-800 dark:bg-slate-950">
          <ul className="space-y-1">
            <li>
              <Link
                href={DIRECT.href}
                onClick={() => setOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive(DIRECT.href)
                    ? "bg-indigo-600 text-white"
                    : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                {DIRECT.label}
              </Link>
            </li>

            {GROUPS.map((g) => (
              <li key={g.id}>
                <div className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {g.label}
                </div>
                <ul className="space-y-1">
                  {g.items.map((l) => (
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
