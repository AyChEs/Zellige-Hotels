# 09 · Revisión final

Modelo: GPT-6 Luna (opencode go), razonamiento xhigh. Después, Opus solo revisa el resultado.
Rama: `mejora/09-revision`, desde `plan/mejoras`. Nunca `main`.
Depende de: 00 a 08 fusionadas.
Skills que lee antes de empezar:
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/code-review-and-quality/SKILL.md`
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/verification-before-completion/SKILL.md`

## Contexto

Lee `plan/REGLAS.md`, `plan/DISENO.md`, `plan/PLAN.md` y `plan/AUDITORIA.md`. Revisa todo lo que cambió entre `main` y `plan/mejoras` (`git diff main...plan/mejoras`).

## Tareas

1. Revisión en cinco ejes de la skill (corrección, legibilidad, arquitectura, seguridad, rendimiento) sobre el diff completo. Escribe los hallazgos en `plan/REVISION.md`, cada uno con archivo, línea, gravedad (bloqueante, importante, menor) y arreglo.
2. Comprueba de forma explícita:
   - Nada contradice lo que afirma el portafolio (lista en `plan/REGLAS.md`, «Quién y para qué»).
   - No hay naranja ni tokens viejos: `grep -rnE "(glaze|teal|gold|terra)-[0-9]|#c19540|#06282b|#a4552f" frontend/src`.
   - Las reglas de rol siguen en el backend; ningún cambio en `auth/`, `api/client.ts`, `ProtectedRoute.tsx` o en `backend/src/main/java/**/auth/` sin justificar.
   - No hay identificadores de modelos de IA en commits (`git log main..plan/mejoras --format=%B | grep -iE "claude|opus|gpt|glm|deepseek|co-authored"`), código ni PR.
   - Los textos visibles nuevos tienen versión `es` y `en`.
3. Arregla tú los hallazgos **menores e importantes** en esta rama. Los bloqueantes que no puedas arreglar sin cambiar el alcance, déjalos en `plan/AVISOS.md`.
4. Pasa la verificación completa: lint, tests, build, `test:a11y`, CI con `backend`, y capturas finales de las mismas pantallas que `plan/capturas/antes/` en `plan/capturas/final/` (390 y 1440 px, todas, también las del panel y la cuenta a 390).
5. Actualiza `docs/screenshots/landing.png`, `admin-dashboard.png`, `hotel-detail.png` y `login.png` con las capturas finales a 1440 px, y revisa que el README no diga nada que ya no sea cierto (paleta, «arabesque», número de tests).
6. Abre además el PR `plan/mejoras → main` **sin fusionarlo**, titulado «Mejora de diseño, accesibilidad y frontend», con el resumen de las diez sesiones, enlaces a sus PR, capturas antes/después y la lista de avisos pendientes. Fusionar en `main` lo hace Ayman.

## No hacer

- No fusiones en `main` ni despliegues.
- No reescribas sesiones enteras: solo arreglos de revisión.

## Criterios de aceptación

- `plan/REVISION.md` sin bloqueantes abiertos (o con su aviso).
- Todo en verde y el PR hacia `main` abierto.

## Verificación

Ver `plan/REGLAS.md`, completa y en todas las pantallas.

## Cierre

PR `mejora/09-revision → plan/mejoras` fusionado si está en verde; marca 09 como hecha; PR `plan/mejoras → main` abierto y sin fusionar. Escribe una entrada final en `plan/AVISOS.md`: «Frente Zellige terminado: PR #N listo para revisar y fusionar».
