# 08 · Datos de demo que no caducan (backend)

Modelo: DeepSeek V4 Pro (opencode go), razonamiento max
Rama: `mejora/08-datos-demo`, desde `plan/mejoras`. Nunca `main`.
Depende de: 00 fusionada. Puede ir en paralelo con 01 a 07.
Skills que lee antes de empezar:
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/spec-driven-development/SKILL.md`
- `/home/ayman/Documentos/proyectos/portafolio/.claude/skills/incremental-implementation/SKILL.md`

## Contexto

Lee `plan/REGLAS.md`. En la demo (`plan/capturas/antes/admin-1440.png`) el panel de un reclutador muestra «Ingresos del mes 0,00 €» y «Reservas del mes 0»: todas las reservas de la base de demo tienen fechas antiguas. Las migraciones Flyway (`backend/src/main/resources/db/migration/V1__schema.sql`, `V2__reference_data.sql`, `V901__room_images.sql`) solo crean hoteles, habitaciones, usuarios y un cliente; las reservas de producción se crearon a mano.

Backend: Spring Boot 3.4, Java 21, package-by-feature en `backend/src/main/java/com/ayches/hotelerp/` (`booking/`, `invoice/`, `task/`, `dashboard/`…). Las reservas no se solapan gracias al servicio **y** a la restricción `EXCLUDE USING gist` de PostgreSQL. Tests de integración con Testcontainers en `backend/src/test/java/com/ayches/hotelerp/` (base: `support/AbstractIntegrationTest.java`).

**Las migraciones existentes no se tocan**: Flyway comprueba su checksum y cambiar una rompería el arranque en producción.

## Tareas

1. Escribe primero la especificación corta en `plan/specs/08-datos-demo.md` (objetivo, reglas, qué se crea, cuándo, cómo se desactiva) y sigue con ella.
2. Crea `com.ayches.hotelerp.demo.DemoDataRefresher`, un `ApplicationRunner` activo solo con la propiedad `app.demo.refresh=true` (`@ConditionalOnProperty`, por defecto `false` en `application.yml`). Al arrancar:
   - Si ya hay 15 o más reservas con `check_in` dentro de los últimos 30 días y los próximos 30, no hace nada (idempotente).
   - Si no, crea reservas para el cliente de demo (`client@hotel-erp.dev`) y para 6 clientes de demo nuevos (nombres ficticios, correos `@demo.zellige.test`, sin datos reales), repartidas en los 3 hoteles, entre hoy − 30 y hoy + 30 días, de 1 a 4 noches, **usando el servicio de reservas existente** (no SQL directo), de modo que se respetan precio, régimen y no solapamiento. Si el servicio rechaza una por solape, la salta.
   - Hace avanzar las de fechas pasadas por el ciclo de vida real (confirmar → check-in → check-out → factura emitida → pagada) con los servicios existentes, para que haya ingresos del mes, tareas de limpieza y facturas.
   - Registra en el log cuántas creó.
3. Programa además una ejecución diaria (`@Scheduled(cron = "0 15 4 * * *")`, con `@EnableScheduling` en una configuración propia condicionada a la misma propiedad) que repite el paso anterior, para que la demo no vuelva a caducar.
4. Pruebas de integración con Testcontainers en `backend/src/test/java/com/ayches/hotelerp/demo/DemoDataRefresherIntegrationTest.java`:
   - con la propiedad activa y la base vacía de reservas, tras ejecutar hay ≥ 15 reservas en la ventana y el resumen del panel del mes tiene ingresos > 0;
   - ejecutarlo dos veces seguidas no duplica (mismo recuento);
   - con la propiedad desactivada, el bean no existe.
5. Documenta en `docs/DEPLOYMENT.md` la variable `APP_DEMO_REFRESH=true` (cómo activarla en Render y qué hace).
6. Deja en `plan/AVISOS.md` un aviso con el formato de `plan/REGLAS.md`: activar `APP_DEMO_REFRESH=true` en Render es un cambio en producción que escribe en la base de Neon; recomienda activarlo tras fusionar en `main`; queda bloqueado solo el efecto en la demo.

## No hacer

- No modifiques `V1`, `V2` ni `V901`. Si necesitas una columna nueva, crea `V3__….sql` (no debería hacer falta).
- No cambies la autenticación, los roles ni la restricción `EXCLUDE`.
- No te conectes a la base de producción ni cambies variables en Render.

## Criterios de aceptación

- Las tres pruebas nuevas pasan en CI junto a las 29 existentes (`./mvnw -B verify`).
- Con la propiedad desactivada (por defecto), el comportamiento de la app no cambia.

## Verificación

- CI del PR en verde (`gh pr checks --watch`), job `backend`.
- Si la sesión 00 dejó un JDK local: `cd backend && ./mvnw -B -DskipTests compile` en local antes de subir.

## Cierre

Commit(s), push, PR hacia `plan/mejoras` con la especificación enlazada y el recuento de pruebas; fusión si está en verde; marca 08 como hecha.
