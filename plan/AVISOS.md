# Avisos para Ayman

Aquí las sesiones dejan solo lo que necesita una decisión o una acción tuya. Formato en `plan/REGLAS.md`.

## 2026-10-19 · Sesión 08 · Activar los datos de demo en Render
- Qué pasa: la sesión 08 añade `DemoDataRefresher`, apagado por defecto. Para que el panel de la demo deje de mostrar 0 € y 0 reservas del mes hay que poner `APP_DEMO_REFRESH=true` en Render. Es un cambio en producción que escribe en la base de Neon (reservas, facturas y seis clientes ficticios sin cuenta, todo marcado con la nota `[demo]`, sin correos).
- Opciones: 1) activarlo después de fusionar `plan/mejoras` en `main` y de que Render despliegue; 2) dejarlo apagado y mantener las fechas a mano.
- Recomiendo: 1, porque es lo que hace que la demo no vuelva a caducar y pasa por los mismos servicios y reglas que una reserva real. Instrucciones en `docs/DEPLOYMENT.md`.
- Queda bloqueado: solo el efecto en la demo pública. El código y las pruebas no dependen de ello.
