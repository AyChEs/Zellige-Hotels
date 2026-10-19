import type { SVGProps } from 'react'

/**
 * Line icons drawn for this app (1.5 stroke, currentColor, 24 grid). Decorative by default:
 * the label next to them carries the meaning, so they are hidden from assistive tech.
 */
function Icon({ size = 18, children, ...props }: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {children}
    </svg>
  )
}

type P = SVGProps<SVGSVGElement> & { size?: number }

/** Dashboard: four tiles, one of them tall. */
export const IconPanel = (p: P) => (
  <Icon {...p}>
    <rect x="3.5" y="3.5" width="7" height="9" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="5" rx="1.5" />
    <rect x="13.5" y="11.5" width="7" height="9" rx="1.5" />
    <rect x="3.5" y="15.5" width="7" height="5" rx="1.5" />
  </Icon>
)

/** Booking: a bed seen from the side. */
export const IconReserva = (p: P) => (
  <Icon {...p}>
    <path d="M3 18.5V6.5" />
    <path d="M3 14.5h18v4" />
    <path d="M3 11.5h7.5v3" />
    <path d="M10.5 11.5h7a3.5 3.5 0 0 1 3.5 3.5" />
    <circle cx="6.5" cy="9" r="1.5" />
  </Icon>
)

export const IconCalendario = (p: P) => (
  <Icon {...p}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 9.5h17M8 3v4M16 3v4" />
    <path d="M7.5 13h2M11 13h2M14.5 13h2M7.5 16.5h2M11 16.5h2" />
  </Icon>
)

/** Invoice: a receipt with a torn bottom edge. */
export const IconFactura = (p: P) => (
  <Icon {...p}>
    <path d="M5.5 3.5h13v17l-2.2-1.5-2.1 1.5-2.2-1.5-2.2 1.5-2.1-1.5-2.2 1.5z" />
    <path d="M8.5 8h7M8.5 11.5h7M8.5 15h4" />
  </Icon>
)

export const IconPersona = (p: P) => (
  <Icon {...p}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20c.8-3.6 3.8-5.5 7.5-5.5s6.7 1.9 7.5 5.5" />
  </Icon>
)

/** Task list: checked rows. */
export const IconLista = (p: P) => (
  <Icon {...p}>
    <path d="m4 6.5 1.5 1.5L8 5.5M4 12.5 5.5 14 8 11.5" />
    <path d="M11 7h9M11 13h9M11 18.5h9" />
    <circle cx="6" cy="18.5" r="1" />
  </Icon>
)

/** Hotel: a building with a horseshoe-arched door. */
export const IconEdificio = (p: P) => (
  <Icon {...p}>
    <path d="M4.5 20.5v-15l7.5-2.5 7.5 2.5v15" />
    <path d="M3 20.5h18" />
    <path d="M10 20.5v-3a2 2 0 0 1 4 0v3" />
    <path d="M8 8.5h1.5M14.5 8.5H16M8 12.5h1.5M14.5 12.5H16" />
  </Icon>
)

/** Room: a door with its handle. */
export const IconPuerta = (p: P) => (
  <Icon {...p}>
    <path d="M6 20.5V4.5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16" />
    <path d="M3.5 20.5h17" />
    <circle cx="14.5" cy="12.5" r="1" />
  </Icon>
)

/** Category: a price tag. */
export const IconEtiqueta = (p: P) => (
  <Icon {...p}>
    <path d="M3.5 12.2V4.5a1 1 0 0 1 1-1h7.7l8.3 8.3a1.5 1.5 0 0 1 0 2.1l-6.6 6.6a1.5 1.5 0 0 1-2.1 0z" />
    <circle cx="8" cy="8" r="1.5" />
  </Icon>
)

/** Staff: an ID badge on a lanyard. */
export const IconGafete = (p: P) => (
  <Icon {...p}>
    <rect x="5" y="6.5" width="14" height="14" rx="2" />
    <path d="M10 3.5h4v4h-4z" />
    <circle cx="12" cy="12.5" r="2" />
    <path d="M8.5 17.5c.6-1.4 1.9-2 3.5-2s2.9.6 3.5 2" />
  </Icon>
)

export const IconMenu = (p: P) => (
  <Icon {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Icon>
)

export const IconCerrar = (p: P) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Icon>
)

/** Error: an exclamation mark in a circle. */
export const IconAlerta = (p: P) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v5.5" />
    <circle cx="12" cy="16.25" r=".6" fill="currentColor" />
  </Icon>
)

export const IconHecho = (p: P) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.5 12.2 2.4 2.3 4.6-4.8" />
  </Icon>
)

export const IconFlecha = (p: P) => (
  <Icon {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
)
