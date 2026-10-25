# Especificación · 08 Datos de demo que no caducan

## Objetivo

Que el panel de la demo pública nunca muestre «Ingresos del mes 0,00 €» ni «Reservas del mes 0». Hoy las reservas de producción tienen fechas antiguas y nada las renueva.

## Reglas

- Desactivado por defecto: solo actúa con `app.demo.refresh=true` (variable `APP_DEMO_REFRESH`). Sin ella, el bean no existe y la aplicación se comporta igual que hoy.
- No toca las migraciones `V1`, `V2`, `V901` ni la restricción `EXCLUDE USING gist`.
- Todo pasa por los servicios existentes (`BookingService`, `InvoiceService`, `TaskService`): precio, régimen, ciclo de vida y no solapamiento son los de siempre. Si el servicio rechaza una reserva (solape, capacidad), se salta.
- Idempotente: si ya hay 15 o más reservas activas (no canceladas) con entrada entre hoy − 30 y hoy + 30 días, no crea ninguna.
- Sin datos reales: los clientes de demo son ficticios y **no tienen cuenta de usuario** (como un cliente de mostrador), así no hay contraseñas nuevas ni correos que enviar.
- Sin correos: las reservas de demo llevan la nota `[demo]` y el servicio de correo no envía nada para ellas (tampoco al cliente de demo `client@hotel-erp.dev`).

## Qué se crea

1. Seis clientes de demo (documentos `DEMO-0001` a `DEMO-0006`) si no existen.
2. Reservas repartidas en las habitaciones de los tres hoteles, con entrada entre hoy − 30 y hoy + 29, de 1 a 4 noches, para el cliente de demo y los seis clientes, hasta llegar a 24 reservas activas en la ventana (máximo 60 intentos por ejecución).
3. Avance del ciclo de vida de **todas** las reservas `[demo]` según su fecha:
   - salida anterior o igual a hoy: confirmar, check-in, check-out, factura emitida y pagada; la tarea de limpieza automática se marca hecha y la habitación vuelve a `AVAILABLE` si nadie la ocupa;
   - en curso (entrada ≤ hoy < salida): confirmar, check-in y factura emitida (sin pagar);
   - entrada en los próximos 7 días: confirmar;
   - el resto queda pendiente.
4. Registra en el log cuántas reservas creó y cuántas avanzó.

## Cuándo

- Al arrancar (`ApplicationRunner`).
- Cada día a las 04:15 (hora del servidor, `@Scheduled(cron = "0 15 4 * * *")`), con `@EnableScheduling` en una configuración condicionada a la misma propiedad.

## Cómo se desactiva

Quitando `APP_DEMO_REFRESH` (o poniéndola a `false`) y reiniciando. Los datos ya creados se quedan; son reservas normales marcadas con `[demo]`.

## Pruebas

`DemoDataRefresherIntegrationTest` (Testcontainers, base propia sin los datos de `db/dev`, es decir sin reservas):
- con la propiedad activa, tras el arranque hay ≥ 15 reservas activas en la ventana y el resumen del panel tiene ingresos del mes > 0;
- ejecutarlo otra vez no cambia el recuento.

`DemoDataDisabledIntegrationTest`: con la propiedad por defecto, el bean `DemoDataRefresher` no existe.
