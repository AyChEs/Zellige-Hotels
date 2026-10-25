// La foto de la portada es lo más grande de la primera pantalla: se pide ya, sin esperar al JavaScript.
// Va en un archivo propio (y no en línea en index.html) para que la CSP no necesite 'unsafe-inline' en scripts.
if (location.pathname === '/') {
  var l = document.createElement('link')
  l.rel = 'preload'
  l.as = 'image'
  l.type = 'image/avif'
  l.setAttribute('imagesrcset', '/img/hero-640.avif 640w, /img/hero-1024.avif 1024w, /img/hero-1672.avif 1672w')
  l.setAttribute('imagesizes', '100vw')
  l.setAttribute('fetchpriority', 'high')
  document.head.appendChild(l)
}
