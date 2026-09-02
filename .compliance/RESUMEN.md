# Resumen de cumplimiento — Incluye (Ley 21.719)

**Fecha:** 1 de septiembre de 2026 · **Marco:** Ley 21.719 de Protección de Datos Personales
**Vigencia de la ley:** 1 de diciembre de 2026. Tienes tiempo para prepararte, y como empresa de menor tamaño hay 12 meses de gracia (la Agencia puede amonestar en vez de multar el primer año).

> ⚖️ No constituye asesoría legal. Son borradores fundados en la Ley 21.719 para cumplir sin abogado. Revísalos y completa los `[COMPLETAR]`.

## Postura general
Incluye parte de una **buena base técnica** (TLS, cifrado en reposo, contraseñas hasheadas, aislamiento por empresa con 50 políticas RLS, secretos fuera del código, sin datos sensibles). El grueso de lo que faltaba era **documental y de gobernanza**, que ahora quedó generado. Postura estimada: **~50%**, con la mayoría de las brechas restantes fáciles de cerrar.

Decisiones resueltas:
- **DPO:** no requerido (no eres organismo público ni tratas datos sensibles a gran escala).
- **EIPD:** no obligatoria (sin perfilado, decisiones automatizadas ni datos sensibles). Documentado en `21719-eipd.md`.
- **Transferencia internacional:** sí (Supabase y Resend en EE.UU.) → cubierta con DPA + cláusulas modelo.

## Lo que quedó resuelto (documentos en `.compliance/docs/`)
- ✅ Política de privacidad
- ✅ RAT (registro de actividades de tratamiento)
- ✅ Textos de consentimiento / avisos
- ✅ Canal de ejercicio de derechos (procedimiento + plazos)
- ✅ DPA (Incluye como encargado de las empresas cliente)
- ✅ Anexo de transferencia internacional (Supabase, Resend)
- ✅ Plan de respuesta a brechas + registro de vulneraciones
- ✅ EIPD (test → no obligatoria)

## Brechas priorizadas (qué falta)
**Rápidas / documentales**
1. **Completar los `[COMPLETAR]`** cuando constituyas la sociedad (razón social, RUT, domicilio, representante, correo de contacto de datos).
2. **Publicar la política de privacidad y los términos** en la web y **enlazarlos en el registro** (checkbox "acepto…", no premarcado).
3. **Firmar/aceptar** los DPA de Supabase y Resend y adjuntar las cláusulas modelo (Anexo de transferencia).

**Requieren código (puedo construirlas)**
4. **Botón "descargar mis datos" y "eliminar mi cuenta"** en el panel → automatiza acceso, portabilidad y supresión (derechos ARCO).
5. **Registro de consentimiento** (qué aceptó cada usuario, cuándo y qué versión).
6. **MFA (doble factor)** — hoy no está. Supabase lo soporta.
7. **Registro de auditoría** (quién accede/cambia qué) — ayuda a detectar brechas (Art. 14 sexies).

## Insumos externos (no self-service)
- Constituir la sociedad (para tener razón social/RUT reales).
- Revisión legal opcional antes de publicar (no obligatoria).

## Siguiente paso
Cuando quieras, puedo **construir las remediaciones de código** (empezando por el botón de eliminar cuenta + descargar mis datos, y luego MFA y audit log), cada una en su rama y verificada. También conviene **commitear `.compliance/`** para versionar el estado.
