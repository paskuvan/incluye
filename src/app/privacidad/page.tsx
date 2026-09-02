import type { Metadata } from "next";
import PublicNav, { PublicFooter } from "@/components/public-nav";

export const metadata: Metadata = {
  title: "Política de Privacidad · Incluye",
  description:
    "Cómo Incluye trata tus datos personales conforme a la Ley 21.719 de Chile.",
};

// NOTA: completa los [COMPLETAR] con los datos de la empresa antes del
// lanzamiento real. Ver .compliance/docs/21719-politica-privacidad.md
export default function PrivacidadPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <PublicNav />

      <article className="mx-auto max-w-3xl px-6 pb-16 pt-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Política de Privacidad
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Última actualización: 1 de septiembre de 2026 · Ley 21.719 de Chile
        </p>

        <div className="prose-incluye mt-8 space-y-8 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              1. Responsable del tratamiento
            </h2>
            <p className="mt-2">
              <strong>[COMPLETAR: razón social]</strong>, RUT{" "}
              <strong>[COMPLETAR: RUT]</strong>, domicilio{" "}
              <strong>[COMPLETAR: domicilio]</strong>, operadora de la
              plataforma Incluye. Contacto para datos personales:{" "}
              <strong>[COMPLETAR: correo]</strong>.
            </p>
            <p className="mt-2 text-slate-500 dark:text-slate-400">
              Incluye es <em>responsable</em> de los datos de las cuentas de sus
              usuarios y <em>encargado</em> respecto de los datos que cada
              empresa cliente carga en la plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              2. Qué datos tratamos
            </h2>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              <li>
                <strong>Cuenta:</strong> correo y contraseña (almacenada
                cifrada/hasheada).
              </li>
              <li>
                <strong>Empresa:</strong> nombre o razón social, RUT y número de
                trabajadores.
              </li>
              <li>
                <strong>Gestor(a) de inclusión:</strong> nombre, cargo y correo.
              </li>
              <li>
                <strong>Invitaciones:</strong> correo de la persona invitada.
              </li>
              <li>
                <strong>Vacantes / postulación:</strong> correo o enlace de
                postulación.
              </li>
              <li>
                <strong>Uso:</strong> respuestas de la autoevaluación (sobre la
                empresa), fechas y registros técnicos básicos.
              </li>
            </ul>
            <p className="mt-2">
              <strong>No tratamos datos sensibles.</strong> La autoevaluación
              mide la accesibilidad de la empresa; no pedimos información sobre
              la salud ni la discapacidad de personas identificadas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              3. Finalidad y base de licitud
            </h2>
            <div className="mt-2 overflow-x-auto">
              <table className="w-full min-w-[420px] text-left">
                <thead className="text-xs uppercase tracking-wide text-slate-400">
                  <tr>
                    <th className="pb-2">Finalidad</th>
                    <th className="pb-2">Base de licitud</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    ["Crear tu cuenta y prestar el servicio", "Ejecución del contrato"],
                    ["Evaluaciones, reportes y plan de acción", "Ejecución del contrato"],
                    ["Datos de gestor y miembros (cargados por la empresa)", "Interés legítimo / contrato"],
                    ["Correos transaccionales", "Ejecución / interés legítimo"],
                    ["Vacantes y postulación", "Consentimiento / ejecución"],
                    ["Marketing (si lo hubiera)", "Consentimiento"],
                  ].map(([a, b]) => (
                    <tr key={a}>
                      <td className="py-2 pr-4">{a}</td>
                      <td className="py-2">{b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              4. Con quién compartimos los datos
            </h2>
            <p className="mt-2">
              Usamos proveedores que actúan como encargados:{" "}
              <strong>Supabase</strong> (base de datos, autenticación y
              almacenamiento — EE.UU.) y <strong>Resend</strong> (envío de
              correos — EE.UU.). Algunos procesan datos fuera de Chile; la
              transferencia se ampara en las <strong>Cláusulas Contractuales
              Modelo</strong> aprobadas por el Ministerio de Economía.{" "}
              <strong>No vendemos datos personales.</strong>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              5. Por cuánto tiempo
            </h2>
            <p className="mt-2">
              Cuenta y datos de la empresa: mientras la cuenta esté activa y
              hasta 12 meses después de darla de baja. Registros técnicos: hasta
              12 meses. Luego se eliminan o anonimizan.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              6. Tus derechos
            </h2>
            <p className="mt-2">
              Puedes ejercer <strong>acceso, rectificación, supresión,
              oposición, portabilidad y bloqueo</strong>, y retirar tu
              consentimiento cuando quieras, escribiendo a{" "}
              <strong>[COMPLETAR: correo]</strong>. Respondemos en 30 días
              corridos (prorrogables una sola vez por 30 más). La rectificación,
              supresión y oposición son siempre gratuitas; el acceso es gratuito
              al menos una vez por trimestre.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              7. Decisiones automatizadas
            </h2>
            <p className="mt-2">
              No tomamos decisiones automatizadas con efectos jurídicos o
              significativos sobre las personas. El puntaje de accesibilidad se
              calcula sobre la empresa, no perfila ni evalúa a personas.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              8. Seguridad
            </h2>
            <p className="mt-2">
              Aplicamos medidas proporcionales: HTTPS/TLS, cifrado en reposo,
              hasheo de contraseñas, control de acceso por fila que aísla los
              datos de cada empresa, y secretos fuera del código.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              9. Cambios y reclamos
            </h2>
            <p className="mt-2">
              Podemos actualizar esta política; publicaremos la versión vigente
              con su fecha. Puedes reclamar ante la{" "}
              <strong>Agencia de Protección de Datos Personales</strong> de
              Chile.
            </p>
          </section>

          <p className="border-t border-slate-200 pt-4 text-xs text-slate-400 dark:border-slate-800">
            Documento conforme a la Ley 21.719 de Protección de Datos Personales.
            No constituye asesoría legal.
          </p>
        </div>
      </article>

      <PublicFooter />
    </main>
  );
}
