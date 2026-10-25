import { Fragment } from 'react'

/**
 * Titular partido en líneas para que entren una a una (docs/MARCA.md §9). Cada línea va
 * en una máscara (`.linea`) y su contenido (`.linea-int`) es lo que se mueve. Entre líneas
 * queda un espacio real: el lector de pantalla y el título del documento leen la frase entera.
 * `entrada` anima con CSS al cargar (titular del inicio); el resto lo anima GSAP al hacer scroll.
 */
export function Lineas({ lineas, entrada = false }: { lineas: string[]; entrada?: boolean }) {
  return (
    <>
      {lineas.map((l, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span className="linea">
            <span
              className={`linea-int ${entrada ? 'linea-entrada' : ''}`}
              style={entrada ? { animationDelay: `${120 + i * 90}ms` } : undefined}
            >
              {l}
            </span>
          </span>
        </Fragment>
      ))}
    </>
  )
}
