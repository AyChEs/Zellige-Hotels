# Avisos para Ayman

Aquí las sesiones dejan solo lo que necesita una decisión o una acción tuya. Formato en `plan/REGLAS.md`.

## 2026-10-19 · Sesión 08 · Activar los datos de demo en Render
- Qué pasa: la sesión 08 añade `DemoDataRefresher`, apagado por defecto. Para que el panel de la demo deje de mostrar 0 € y 0 reservas del mes hay que poner `APP_DEMO_REFRESH=true` en Render. Es un cambio en producción que escribe en la base de Neon (reservas, facturas y seis clientes ficticios sin cuenta, todo marcado con la nota `[demo]`, sin correos).
- Opciones: 1) activarlo después de fusionar `plan/mejoras` en `main` y de que Render despliegue; 2) dejarlo apagado y mantener las fechas a mano.
- Recomiendo: 1, porque es lo que hace que la demo no vuelva a caducar y pasa por los mismos servicios y reglas que una reserva real. Instrucciones en `docs/DEPLOYMENT.md`.
- Queda bloqueado: solo el efecto en la demo pública. El código y las pruebas no dependen de ello.

## 2026-10-19 · Sesión 09 · Capturas con fotos reales
- Qué pasa: desde el entorno donde se ejecutó el plan no había red hacia Render ni hacia Unsplash. Todas las capturas de `plan/capturas/01` a `final` se hicieron con la API simulada (`plan/herramientas/api-simulada.mjs`, mismos hoteles y habitaciones que la base) y fotos sustitutas en SVG. Diseño, textos y datos son los reales; las fotos no.
- Opciones: 1) tras desplegar, repetir las capturas finales contra la demo con `node plan/herramientas/capturas.mjs final https://zellige-hotels.vercel.app '<páginas>' '<login>'` (sin `SIMULAR=1`) y sustituir `docs/screenshots/landing.png` y `hotel-detail.png`; 2) dejarlas como están.
- Recomiendo: 1, porque el caso del portafolio y el README deben enseñar las fotos de los hoteles. `docs/screenshots/admin-dashboard.png` y `login.png` ya están actualizadas (no llevan fotos); `landing.png` y `hotel-detail.png` siguen siendo las antiguas a propósito.
- Queda bloqueado: solo esas dos capturas del README y las que use la sesión 04 del portafolio.

## 2026-10-19 · Sesión 09 · Ramas fusionadas sin borrar
- Qué pasa: el proxy de este entorno no permite borrar ramas remotas, así que `mejora/01-auditoria` a `mejora/09-revision` siguen en GitHub aunque sus PR están fusionados.
- Opciones: 1) borrarlas desde GitHub (Branches) o con `git push origin --delete mejora/NN-…`; 2) dejarlas.
- Recomiendo: 1, para que el repositorio quede limpio antes de enseñarlo.
- Queda bloqueado: nada.

## 2026-10-19 · Sesión 09 · Frente Zellige terminado
- Qué pasa: las sesiones 01 a 09 están fusionadas en `plan/mejoras` con su PR y el CI en verde (incluido el job nuevo `a11y`). Falta el PR `plan/mejoras → main`, que por instrucción no se ha abierto: lo abres y lo fusionas tú.
- Opciones: 1) abrir el PR `plan/mejoras → main` («Mejora de diseño, accesibilidad y frontend»), revisarlo y fusionarlo; 2) pedir cambios antes.
- Recomiendo: 1, y después activar `APP_DEMO_REFRESH` (aviso de la sesión 08) y rehacer las capturas con fotos reales (aviso anterior).
- Queda bloqueado: el despliegue en Vercel y Render, que ocurre al fusionar en `main`.
