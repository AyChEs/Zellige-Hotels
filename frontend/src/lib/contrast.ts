/** Relative luminance of a #RRGGBB colour (WCAG 2.2). */
export function luminance(hex: string): number {
  const [r, g, b] = (hex.replace('#', '').match(/../g) ?? ['0', '0', '0'])
    .map((x) => parseInt(x, 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Contrast ratio between two colours, rounded to one decimal (e.g. 7.5). */
export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return Math.round(((hi + 0.05) / (lo + 0.05)) * 10) / 10
}
