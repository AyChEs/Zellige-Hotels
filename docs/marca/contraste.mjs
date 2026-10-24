// Contraste WCAG 2.2 entre pares de colores. Uso: node contraste.mjs '#1E5B46/#FAF8F4' '#EDEAE3/#18231F'
const lum = (hex) => {
  const [r, g, b] = hex.replace('#', '').match(/../g).map((x) => parseInt(x, 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}
for (const par of process.argv.slice(2)) {
  const [a, b] = par.split('/').map(lum).sort((x, y) => y - x)
  console.log(`${par}  ${((a + 0.05) / (b + 0.05)).toFixed(1)}:1`)
}
