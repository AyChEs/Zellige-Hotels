# 00 · Arreglos urgentes y entorno

Modelo: GLM 5.3 Flash (opencode go)
Rama: `mejora/00-arreglos-urgentes`, desde `plan/mejoras`. Nunca `main`.
Depende de: nada.
Skills que lee antes de empezar:
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/verification-before-completion/SKILL.md`

## Contexto

Lee `plan/REGLAS.md`. La demo pública (`https://zellige-hotels.vercel.app`) tiene tres fallos que ve cualquiera que la abra, y esta máquina no tiene lo necesario para probar en local sin tocar producción.

1. Abrir directamente `https://zellige-hotels.vercel.app/login` (o `/hotels`, `/admin`…) da **404 de Vercel**: `frontend/vercel.json` no tiene reescritura para una SPA.
2. En la barra lateral del panel, debajo del correo, aparece el texto crudo `labels.employeePosition.ADMIN`. `components/layout/AdminShell.tsx:60` llama a `tLabel('employeePosition', user.role)`, pero `labels.employeePosition` en `i18n/locales/es.json` y `en.json` solo tiene `MANAGER`, `RECEPTIONIST`, `HOUSEKEEPER` y `MAINTENANCE`. Falta `ADMIN` (y `CLIENT` por si acaso).
3. En `components/layout/PublicShell.tsx` el texto «Panel ERP» está escrito a mano y el enlace de inicio se decide con `t('public.nav.hotels') === 'Hotels' ? 'Home' : 'Inicio'`.

## Tareas

1. En `frontend/vercel.json`, añade al objeto existente (sin quitar `env` ni `build`):
   ```json
   "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   ```
   Vercel sirve primero los archivos estáticos que existen, así que `/assets/*` y `/favicon.svg` siguen funcionando.
2. En `i18n/locales/es.json`, dentro de `labels.employeePosition`, añade `"ADMIN": "Administración"` y `"CLIENT": "Cliente"`. En `en.json`: `"ADMIN": "Administration"` y `"CLIENT": "Guest"`.
3. En ambos JSON, dentro de `public.nav`, añade `"home"` (`"Inicio"` / `"Home"`) y `"staffPanel"` (`"Panel de gestión"` / `"Staff panel"`). En `PublicShell.tsx` borra la constante `home` y usa `t('public.nav.home')`; sustituye los dos `'Panel ERP'` por `t('public.nav.staffPanel')`.
4. En `frontend/vite.config.ts`, cambia el destino del proxy `/api` a `process.env.VITE_PROXY_TARGET ?? 'http://localhost:8080'` y añade `secure: true`. Así se puede arrancar el frontend contra la API pública solo para mirar pantallas.
5. Añade a `frontend/README.md` una sección «Probar sin backend local» con el comando `VITE_PROXY_TARGET=https://zellige-hotels.onrender.com npm run dev` y la advertencia: «Solo para navegar. No crees ni borres datos: es la base de datos de la demo».
6. Añade una prueba en `frontend/src/lib/__tests__/labels.test.ts` que recorra todos los valores del tipo `Role` (`ADMIN`, `MANAGER`, `RECEPTIONIST`, `CLIENT`) y compruebe que `es.json` y `en.json` tienen `labels.employeePosition.<rol>`. Importa los JSON directamente.
7. Intenta dejar un JDK 21 local sin `sudo`, para que las siguientes sesiones puedan compilar el backend:
   ```bash
   mkdir -p ~/.local/jdk && cd ~/.local/jdk
   curl -fsSL -o jdk.tgz "https://api.adoptium.net/v3/binary/latest/21/ga/linux/x64/jdk/hotspot/normal/eclipse"
   tar xzf jdk.tgz && rm jdk.tgz && ls
   ```
   Comprueba `~/.local/jdk/jdk-21*/bin/java -version`. Si funciona, añade a `plan/REGLAS.md`, en «Entorno de esta máquina», la línea: «JDK 21 en `~/.local/jdk/jdk-21…`: `export JAVA_HOME=$(echo ~/.local/jdk/jdk-21*) PATH=$JAVA_HOME/bin:$PATH`. Con él, `./mvnw -B -DskipTests compile` funciona en local; los tests de Testcontainers siguen necesitando Docker y se verifican en CI». Si la descarga falla, no es un aviso: anótalo en el PR y sigue.

## No hacer

- No cambies colores, tipografía ni componentes: eso es de las sesiones 02 y 03.
- No toques el backend.
- No cambies la configuración del proyecto en el panel de Vercel ni las variables de entorno.

## Criterios de aceptación

- `frontend/vercel.json` es JSON válido y contiene `rewrites`.
- `grep -rn "Panel ERP\|=== 'Hotels'" frontend/src` no devuelve nada.
- La prueba nueva pasa y fallaría si se borrara `ADMIN` de `es.json` (compruébalo una vez y deshazlo).

## Verificación

```bash
cd frontend && npm ci && npm run lint && npm test -- --run && npm run build
node -e "JSON.parse(require('fs').readFileSync('vercel.json','utf8'))"
```

CI del PR en verde (`gh pr checks --watch`). La comprobación del 404 en producción solo se puede hacer cuando Ayman fusione en `main`; indícalo en el PR.

## Cierre

Commit «Corrige rutas directas en Vercel y textos sin traducir», push, PR hacia `plan/mejoras` con el resumen, fusión si está en verde y marca 00 como hecha en `plan/PLAN.md`.
