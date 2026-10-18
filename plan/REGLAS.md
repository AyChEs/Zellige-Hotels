# Reglas comunes de todas las sesiones (Zellige Hotels)

Léelo entero antes de empezar cualquier sesión. Si una skill choca con esto, manda esto.

## Quién y para qué

- Proyecto de Ayman Charoui (GitHub `AyChEs`), desarrollador full-stack. Es un caso de su portafolio: un reclutador abrirá la demo después de leer el caso. Tiene que verse cuidado y funcionar a la primera.
- Lo que el portafolio afirma de este proyecto y **no puede dejar de ser cierto**: Spring Boot 3.4 y Java 21, React 19 con TypeScript, Tailwind 4 y TanStack Query; cuatro perfiles (admin, manager, receptionist y client) con las reglas en el backend; JWT con refresh tokens que rotan y revocan la familia si se reutilizan; `EXCLUDE USING gist` en PostgreSQL contra reservas solapadas; tests con Testcontainers; CI en cada push; demo pública. Si un cambio contradice algo de esto, para y deja un aviso.

## Reglas que no se negocian

- Prohibido el naranja (tonos entre 15° y 40° de matiz). Tampoco terracota.
- No usar nada de la marca del portafolio: azul marino `#14213D`, azul `#2563EB`/`#3B82F6`, Plus Jakarta Sans, JetBrains Mono, el símbolo λ.
- No usar elementos de otra marca ajena: verde azulado `#0F5E5A`, la combinación arena + ámbar, la tipografía Cairo.
- Sin degradados morados. Sin fotos de stock nuevas. Sin servicios de pago. No se cambia el hosting (Vercel, Render, Neon, Brevo).
- WCAG 2.2 AA. Toda animación respeta `prefers-reduced-motion`.
- Textos visibles: frases cortas, sin exclamaciones, sin rayas largas (—) y sin «robusto», «soluciones», «apasionado».
- Ningún identificador de modelo de IA en commits, PR, código ni comentarios. No firmes los commits como coautor una IA.
- Nunca se salta, desactiva ni rebaja una prueba para que pase. Si una prueba ya fallaba antes de tocar nada, se anota en el PR y no se arregla en esa sesión.
- La dirección visual está en `plan/DISENO.md`. No inventes colores, tamaños ni radios fuera de ella.

## Ramas y PR

- Rama del plan: `plan/mejoras`. Cada sesión crea su rama desde ella: `git fetch origin && git checkout plan/mejoras && git pull && git checkout -b mejora/NN-nombre`.
- Nunca trabajes en `main` ni abras PR hacia `main`.
- Commits pequeños, en español, en imperativo: «Añade los tokens de color», «Corrige el foco del modal».
- Al terminar: `git push -u origin mejora/NN-nombre` y `gh pr create --base plan/mejoras --title "NN · Título" --body-file /tmp/pr-NN.md`.
- El cuerpo del PR lleva: resumen, decisiones tomadas por tu cuenta y su porqué, capturas antes/después (rutas en `plan/capturas/NN/`), salida resumida de la verificación y lo que quedó fuera.
- Si la verificación está en verde (local y `gh pr checks --watch`), fusiona tú: `gh pr merge --squash --delete-branch`. Después marca la sesión como hecha en `plan/PLAN.md` (en `plan/mejoras`, commit «Marca la sesión NN como hecha»).

## Entorno de esta máquina

- Hay Node 22 y `gh` con sesión de `AyChEs`. **No hay Java ni Docker** (comprobado el 2026-10-18).
- Backend: la verificación de `./mvnw verify` la hace el CI de GitHub (`.github/workflows/ci.yml`, job `backend`) en cada PR. Espera a que pase con `gh pr checks --watch`. Si la sesión 00 dejó un JDK local, úsalo también; Testcontainers sin Docker no corre en local, y eso no es un fallo tuyo.
- Frontend en local: `cd frontend && npm ci && npm run dev`. Para ver datos sin backend local, arranca con `VITE_PROXY_TARGET=https://zellige-hotels.onrender.com npm run dev` (lo configura la sesión 00). La primera petición puede tardar 50 s: Render se duerme.
- **Contra la API de producción solo se navega y se inicia sesión.** No crees, edites ni borres reservas, clientes ni nada. Para probar mutaciones, usa pruebas con Vitest y dobles.
- Cuentas de demo: `admin@hotel-erp.dev` / `Admin123!`, `manager@hotel-erp.dev` / `Manager123!`, `reception@hotel-erp.dev` / `Reception123!`, `client@hotel-erp.dev` / `Client123!`.

## Verificación (obligatoria antes de cada PR)

1. `cd frontend && npm run lint && npm test -- --run && npm run build`: sin errores.
2. CI del PR en verde, incluido `backend` (`./mvnw -B verify`, 29 tests o más).
3. Capturas y axe con la herramienta del plan, a 390 y 1440 px, de cada pantalla tocada:
   ```bash
   cd /tmp && mkdir -p capt && cd capt && [ -d node_modules/playwright ] || (npm init -y >/dev/null && npm i playwright@1.56 @axe-core/playwright >/dev/null && npx playwright install chromium)
   SPA=1 node /RUTA/AL/REPO/plan/herramientas/capturas.mjs NN http://localhost:5173 '[{"id":"landing","url":"/"}]' '{"url":"/login","user":"#email","pass":"#password","submit":"button[type=submit]"}'
   ```
   Las capturas quedan en `/tmp/capt/out/NN/`; cópialas a `plan/capturas/NN/` y súbelas con el PR. El `report.json` no puede tener violaciones `serious` ni `critical` en las pantallas tocadas, ni `hscroll: true`.
   Para páginas con sesión iniciada, añade `"login":["admin@hotel-erp.dev","Admin123!"]` al objeto de la página.

## Avisos a Ayman

Para y escribe en `plan/AVISOS.md` (solo esa tarea; sigue con el resto) cuando:
- falta una credencial, clave o cuenta;
- falta acceso de escritura al repositorio;
- la acción es irreversible o hacia fuera: fusionar en `main`, desplegar, borrar datos, publicar, escribir a alguien, cambiar el hosting, contratar algo;
- un cambio choca con estas reglas o con lo que afirma el portafolio;
- la verificación falla dos veces seguidas por lo mismo y la causa no está en el código de la sesión.

Formato de cada aviso (añade al final, no borres los anteriores):

```markdown
## AAAA-MM-DD · Sesión NN · Título corto
- Qué pasa:
- Opciones: 1) … 2) …
- Recomiendo: … porque …
- Queda bloqueado: …
```

Nada más se le pregunta. Lo razonable lo decides tú y lo anotas en el PR.

## Skills

Están en el portafolio, en esta misma máquina: `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/<nombre>/SKILL.md`. Lee solo las que indique tu sesión.
