import Link from "next/link";
import {
  ClipboardDocumentListIcon,
  HandRaisedIcon,
  ChatBubbleLeftRightIcon,
  BriefcaseIcon,
  BookOpenIcon,
  ChartBarIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const CARDS = [
  {
    href: "/admin/preguntas",
    icon: ClipboardDocumentListIcon,
    title: "Preguntas de la evaluación",
    desc: "Edita áreas, preguntas y recomendaciones del autodiagnóstico.",
  },
  {
    href: "/admin/glosario",
    icon: HandRaisedIcon,
    title: "Glosario LSCh",
    desc: "Edita rubros y términos, y sube el video de cada seña.",
  },
  {
    href: "/admin/experiencias",
    icon: ChatBubbleLeftRightIcon,
    title: "Experiencias",
    desc: "Modera las experiencias enviadas por la comunidad.",
  },
  {
    href: "/admin/empleos",
    icon: BriefcaseIcon,
    title: "Empleos externos",
    desc: "Cura vacantes inclusivas de otras empresas para la bolsa pública.",
  },
  {
    href: "/admin/recursos",
    icon: BookOpenIcon,
    title: "Biblioteca de recursos",
    desc: "Edita categorías, guías y enlaces de la sección de recursos.",
  },
  {
    href: "/admin/cuota",
    icon: ChartBarIcon,
    title: "Cumplimiento de la cuota",
    desc: "Empresas que no alcanzan la cuota del 1% (Ley 21.015), según su autoevaluación.",
  },
  {
    href: "/admin/auditoria",
    icon: ShieldCheckIcon,
    title: "Registro de auditoría",
    desc: "Traza quién creó, eliminó o exportó datos (Ley 21.719).",
  },
];

export default function AdminHome() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Administración</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Gestiona el contenido de la plataforma sin necesidad de un deploy.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CARDS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-indigo-400 dark:border-slate-800 dark:bg-slate-900"
          >
            <c.icon className="h-7 w-7 text-indigo-500" aria-hidden="true" />
            <h2 className="mt-3 font-semibold">{c.title}</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              {c.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
