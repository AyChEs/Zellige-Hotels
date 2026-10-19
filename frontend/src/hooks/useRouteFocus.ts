import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const SITE = 'Zellige Hotels'
const WAIT_MS = 3000

// Module level, not per layout: going from /login (public layout) to /account (another
// layout instance) is still a route change, not the first page load.
let firstLoad = true

/**
 * On every route change: scroll to the top, name the document after the screen's <h1>
 * ("Reservas · Zellige Hotels") and move focus to that <h1>, so keyboard and screen
 * reader users start reading the new screen instead of staying on the old link.
 * Pages are lazy and their titles may arrive with the data, so for a few seconds the
 * document title follows the <h1> text; focus moves only once.
 */
export function useRouteFocus() {
  const { pathname } = useLocation()

  useEffect(() => {
    const moveFocus = !firstLoad
    firstLoad = false
    if (moveFocus) window.scrollTo(0, 0)

    let focused = false
    const apply = () => {
      const h1 = document.querySelector<HTMLHeadingElement>('main h1')
      const text = h1?.textContent?.trim()
      if (!h1 || !text) return
      document.title = `${text} · ${SITE}`
      if (moveFocus && !focused) {
        if (!h1.hasAttribute('tabindex')) h1.setAttribute('tabindex', '-1')
        h1.focus({ preventScroll: true })
        focused = true
      }
    }
    apply()
    const observer = new MutationObserver(apply)
    observer.observe(document.body, { childList: true, subtree: true, characterData: true })
    const timer = setTimeout(() => observer.disconnect(), WAIT_MS)
    return () => {
      observer.disconnect()
      clearTimeout(timer)
    }
  }, [pathname])
}
