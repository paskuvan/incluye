# Instructivo — qué hacer en cada situación (Ley 21.719)

Runbooks operativos. Guarda evidencia de todo (correos, fechas, respuestas).

## Llega una solicitud de derechos (acceso, rectificación, supresión, etc.)
1. Registra: quién, qué derecho, fecha. Verifica identidad.
2. Responde en **30 días corridos** (prorrogable una sola vez por 30 más, avisando).
3. Ejecuta según el derecho (ver `docs/21719-canal-derechos.md`, sección 2.4).
4. Responde por escrito y guarda evidencia.
- Gratis siempre: rectificación, supresión, oposición. Acceso gratis al menos 1 vez por trimestre.

## Sospecha o confirmación de una brecha
1. Sigue `docs/21719-plan-respuesta-brechas.md`: contener (rotar claves Supabase/Resend), evaluar, notificar.
2. Notifica a la Agencia **sin dilaciones indebidas** (no hay plazo de 72h en Chile).
3. Anota SIEMPRE en `docs/21719-registro-vulneraciones.md`, se notifique o no.

## Agregas un proveedor nuevo (otro SaaS que ve datos)
1. Añádelo al **RAT** (fila nueva).
2. Firma/acepta su DPA. Si procesa fuera de Chile, agrégalo al **Anexo de transferencia**.
3. Actualiza la política de privacidad ("Con quién compartimos los datos").

## Cambias el producto (cámara/señas, candidatos, scoring de personas)
- Rehacer el **test de EIPD** (`docs/21719-eipd.md`): probablemente pase a ser obligatoria.

## Calendario
- **Revisar el RAT y esta carpeta cada 12 meses** o ante cambios de infraestructura.
- Ley vigente desde **dic-2026**; gracia MIPYME el primer año.
