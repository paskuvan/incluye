import "server-only";

// Envío de email vía la API HTTP de Resend (sin SDK, para no sumar dependencias).
export async function sendEmail(opts: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "onboarding@resend.dev";

  if (!apiKey) {
    return { ok: false, error: "Falta RESEND_API_KEY en el servidor." };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Incluye <${from}>`,
      to: [opts.to],
      subject: opts.subject,
      html: opts.html,
    }),
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body?.message ?? detail;
    } catch {
      // sin cuerpo JSON
    }
    return { ok: false, error: detail };
  }

  return { ok: true };
}
