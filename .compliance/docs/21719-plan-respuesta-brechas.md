# Plan de Respuesta a Brechas de Datos Personales — Incluye

**Empresa:** María José Paschcuan (persona natural) · **Responsable del plan:** María José Paschcuan — Fundador/a · **Contacto:** hola@codisenas.com
**Plazo legal:** notificar a la Agencia **sin dilaciones indebidas** (Art. 14 sexies; la ley NO fija 72 horas). Mantener además el **registro de vulneraciones** (ver `21719-registro-vulneraciones.md`), aunque no se notifiquen.

## Roles
- **Coordinador de incidente:** María José Paschcuan (persona fundadora).
- **Apoyo técnico:** Supabase (soporte) · **Apoyo legal:** [COMPLETAR: opcional].

## Fase 1 — Detección y contención (0–4h)
1. Registrar fecha/hora de detección y quién detecta.
2. Contener: rotar claves de Supabase/Resend, revocar tokens, revisar políticas RLS, cerrar accesos comprometidos.
3. Abrir bitácora del incidente.

## Fase 2 — Evaluación (4–24h)
1. Qué datos y de cuántos titulares (consultar tablas afectadas en Supabase).
2. Riesgo para los titulares (alto / no alto).
3. Si el origen es Supabase o Resend, exigir la información al proveedor (sub-encargado).

## Fase 3 — Notificación (sin dilaciones indebidas)
1. **A la Agencia:** naturaleza, categorías y volumen, consecuencias probables, medidas y contacto.
2. **A los titulares:** cuando haya riesgo alto, y también si afecta **datos económicos/financieros** o de **niños, niñas y adolescentes** (Incluye no trata datos sensibles ni de menores en condiciones normales).

## Fase 4 — Cierre y mejora
Causa raíz · medidas correctivas · actualizar RAT y este plan · anotar en el registro de vulneraciones.

## Plantilla de aviso (borrador)
> El [FECHA] detectamos [DESCRIPCIÓN]. Datos afectados: [CATEGORÍAS], ~[N] titulares. Medidas adoptadas: [...]. Contacto: hola@codisenas.com.

---
*Borrador generado con compliance-cl (Ley 21.719). No constituye asesoría legal; borrador para cumplir sin abogado.*
