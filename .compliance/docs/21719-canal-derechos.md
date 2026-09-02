# Canal de ejercicio de derechos — Incluye

> Art. 14 ter: el responsable debe ofrecer un medio para que el titular ejerza sus derechos.

## 1. Texto público ("Tus derechos", para la web/política)
> Como titular de tus datos puedes ejercer estos derechos: **acceso, rectificación, supresión, oposición, portabilidad y bloqueo**. Escríbenos a **[COMPLETAR: correo]**. Responderemos dentro de los plazos legales y sin costo en los casos que la ley establece.

## 2. Procedimiento interno (plazos verificados contra la ley)
1. **Recepción:** registra la solicitud (titular, derecho pedido, fecha) y verifica identidad.
2. **Plazo de respuesta: 30 días corridos**, prorrogable **una sola vez hasta por 30 días corridos** más, avisando al titular.
3. **Gratuidad:** rectificación, supresión y oposición son **siempre gratuitas**. El **acceso** es gratuito **al menos una vez por trimestre**.
4. **Ejecución por derecho (cómo hacerlo en Incluye / Supabase):**
   - **Acceso** → exportar los datos del titular desde Supabase (tablas `auth.users`, `members`, `inclusion_managers`, `invitations`, `jobs`) filtrando por su correo/user_id; entregar en formato comprensible.
   - **Portabilidad** → entregar esos datos en JSON/CSV.
   - **Rectificación** → corregir el dato (o el usuario mismo desde el panel: perfil, editar empresa).
   - **Supresión** → eliminar la cuenta y datos asociados (el borrado en cascada ya está: al borrar la empresa se eliminan evaluaciones, tareas, vacantes y miembros).
   - **Oposición** → dejar de tratar para ese fin (p. ej. baja de marketing).
   - **Bloqueo** → suspender temporalmente el tratamiento mientras se resuelve.
5. **Cierre:** responde por escrito y **guarda evidencia** de la respuesta.

## 3. Si no puedes cumplir
Informa el motivo legal. El titular puede reclamar ante la **Agencia de Protección de Datos**.

> **Mejora sugerida:** implementar en el panel un botón de "descargar mis datos" y "eliminar mi cuenta" para automatizar acceso/portabilidad/supresión (ver receta ARCO en el RESUMEN).

---
*Borrador generado con compliance-cl (Ley 21.719). No constituye asesoría legal; borrador para cumplir sin abogado.*
