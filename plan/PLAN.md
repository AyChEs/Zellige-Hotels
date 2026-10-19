# Plan de mejora · Zellige Hotels

Rama del plan: `plan/mejoras` (sale de `main`). Reglas comunes: `plan/REGLAS.md`. Dirección visual: `plan/DISENO.md`. Avisos para Ayman: `plan/AVISOS.md`.

## Objetivo

Que la demo esté a la altura del caso del portafolio: interfaz cálida, serena y clara, frontend ordenado y accesible (WCAG 2.2 AA), sin romper nada de lo que el caso afirma (roles en el backend, rotación de refresh tokens, `EXCLUDE USING gist`, tests con Testcontainers, CI, demo pública).

## Modelos

Todas las sesiones se ejecutan en opencode go. Se elige el modelo por tarea:

| Clave | Modelo (paseo) | Para qué |
|---|---|---|
| Flash | `opencode-go/glm-5.3-flash`, razonamiento `high` | tareas mecánicas y bien acotadas |
| GLM | `opencode-go/glm-5.3`, razonamiento `high` | cambios en muchos archivos o con criterio visual |
| Pro | `opencode-go/deepseek-v4-pro`, razonamiento `max` | backend con datos, autenticación o pagos |
| Revisión | `opencode-go/gpt-6-luna`, razonamiento `xhigh` | revisión final de todo el frente |

Después de la revisión, Opus solo revisa el resultado final (no ejecuta).

## Sesiones

| NN | Sesión | Modelo | Depende de | Estado |
|---|---|---|---|---|
| 00 | Arreglos urgentes y entorno | Flash | | hecha |
| 01 | Auditoría (solo informe) | Flash | 00 | hecha |
| 02 | Tokens de diseño y tipografía autoalojada | GLM | 01 | hecha |
| 03 | Componentes base | GLM | 02 | hecha |
| 04 | Flujo de reserva del cliente | GLM | 03 | hecha |
| 05 | Panel de gestión por rol | Flash | 03 | hecha |
| 06 | Accesibilidad | GLM | 04, 05 | hecha |
| 07 | Arquitectura del frontend | GLM | 06 | hecha |
| 08 | Datos de demo que no caducan (backend) | Pro | 00 | hecha |
| 09 | Revisión final | Revisión | 07, 08 | pendiente |

## Orden y paralelo

```
00 ─► 01 ─► 02 ─► 03 ─┬─► 04 ─┐
 │                    └─► 05 ─┴─► 06 ─► 07 ─┐
 └─► 08 ─────────────────────────────────────┴─► 09
```

- 04 y 05 pueden ir a la vez: tocan páginas distintas (`pages/public` y `pages/admin`). Si las dos tocan `i18n/locales/*.json`, la segunda en fusionar resuelve el conflicto conservando ambas claves.
- 08 solo toca el backend y puede ir en paralelo con 01 a 07.

## Terminado significa

- Las diez sesiones fusionadas en `plan/mejoras` con su PR y su verificación en verde.
- `./mvnw verify` en verde en CI (29 tests o más) y `npm run lint`, `npm test -- --run` y `npm run build` en verde.
- axe sin violaciones `serious` ni `critical` en: portada, hoteles, ficha, login, registro, área de cliente (3 pestañas) y las 10 pantallas del panel, a 390 y 1440 px.
- Ninguna ruta da 404 al abrirla directamente en Vercel.
- Capturas nuevas en `plan/capturas/final/` (mismas pantallas que `plan/capturas/antes/`).
- `docs/DESIGN.md` y el README reflejan el nuevo sistema y las capturas de `docs/screenshots/` están actualizadas.
- Ayman revisa el PR `plan/mejoras → main` y lo fusiona él. El despliegue a Vercel y Render ocurre al fusionar en `main`, no antes.

Cuando todo esté hecho, la sesión 04 del portafolio usa las capturas finales.
