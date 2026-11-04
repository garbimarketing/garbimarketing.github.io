# Garbí Marketing · web

Web estática (HTML, CSS y JavaScript, sin dependencias) publicada con GitHub Pages en https://garbimarketing.github.io/

## Archivos
- `index.html`: contenido de todas las secciones.
- `styles.css`: estilos. Los colores están al principio (`--night`, `--electric`, `--sky`, `--warm`, `--sun`).
- `config.js`: **datos editables** (email, teléfono, redes, formulario). Lo que esté vacío no se muestra.
- `main.js`: menú, formulario, copiar email y sección activa del menú.
- `extras.js`: animación del buscador en «Marketing digital».
- `joaquin.jpg`, `luis.jpg`: fotos con tratamiento azul noche.
- `logo.png`, `logo-white.png`, `favicon.png`, `apple-touch-icon.png`, `og-image.png`: marca e imagen para compartir.
- `google3c85dfcbf99af5a6.html`: verificación de Google Search Console. **No borrar.**
- `robots.txt`, `sitemap.xml`: para Google.

## Pendiente de vuestra parte
- Teléfono, Instagram y LinkedIn → `config.js`.
- Formspree para que el formulario envíe directamente: crear cuenta en formspree.io, copiar el enlace del formulario en `formEndpoint` de `config.js`. Sin él, el formulario abre el correo del visitante con el mensaje ya escrito.
- Los proyectos de la sección «Proyectos» son conceptuales. Cuando tengáis trabajos reales, sustituidlos.

## Actualizar
En GitHub: abrir el archivo → lápiz ✏️ → cambiar → **Commit changes**. Si cambias `styles.css`, sube el número `?v=` en `index.html` para que los navegadores no usen la versión antigua.
