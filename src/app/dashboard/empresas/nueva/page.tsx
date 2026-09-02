import Link from "next/link";
import CreateOrgForm from "../../create-org-form";

export default function NuevaEmpresaPage() {
  return (
    <div className="space-y-6">
      <Link
        href="/dashboard"
        className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
      >
        ← Volver al panel
      </Link>
      <CreateOrgForm redirectTo="/dashboard" />
    </div>
  );
}
