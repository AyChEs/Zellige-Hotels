import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

// Curvas de docs/MARCA.md §9 con nombre propio: «sereno» ≈ cubic-bezier(.22,1,.36,1).
export const SERENO = 'expo.out'
export const UMBRAL = 'power2.inOut'
export const DURACION_ENTRADA = 0.9
export const ESCALONADO = 0.09

export { gsap, ScrollTrigger, useGSAP }
