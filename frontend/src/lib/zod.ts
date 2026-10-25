import { z } from 'zod'

// zod compila sus validadores con `new Function` si el navegador lo permite. La CSP de la web
// (frontend/vercel.json) no admite `unsafe-eval`, así que se desactiva y valida sin compilar.
z.config({ jitless: true })

export { z }
