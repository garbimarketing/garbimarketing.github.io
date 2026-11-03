# Garbí · Web de marketing para pymes de Vilanova i la Geltrú

Web estática (HTML, CSS y JavaScript, sin dependencias) preparada para GitHub Pages.

Dirección prevista: **https://garbimarketing.github.io/**

## Estructura

```
index.html          Contenido de la web (todas las secciones)
styles.css      Estilos (colores y tipografías al principio del archivo)
config.js        DATOS EDITABLES: nombre, email, teléfono, redes, formulario
main.js          Funcionamiento (menú, formulario, animaciones)
favicon.svg, apple-touch-icon.png, og-image.png   Iconos e imagen para redes
robots.txt, sitemap.xml   Para Google
.nojekyll           Indica a GitHub Pages que publique los archivos tal cual
```

## Datos que tenéis que sustituir

| Qué | Dónde |
|---|---|
| Email y teléfono | `config.js` → `email`, `phone` (vacíos = no se muestran) |
| Instagram y LinkedIn | `config.js` → `instagram`, `linkedin`, `joaquinLinkedin`, `luisLinkedin` |
| Envío del formulario | `config.js` → `formEndpoint` (ver abajo) |
| Fotos de Joaquín y Luis | Subir `joaquin.jpg` y `luis.jpg` y seguir el comentario en `index.html` (sección Quiénes somos) |
| Descripción de cada uno | `index.html`, sección Quiénes somos (texto provisional marcado) |
| Nombre "Garbí" (provisional) | `config.js` → `name`, y en `index.html` el `<title>` y las etiquetas `og:` |
| Colores | `styles.css`, variables al inicio (`--accent` es el color principal) |
| Dominio propio (opcional) | Cambiar `garbimarketing.github.io` en `index.html`, `robots.txt` y `sitemap.xml` |

## Formulario de contacto

GitHub Pages no puede enviar correos por sí solo. El formulario funciona así:

1. **Sin configurar** (`email` y `formEndpoint` vacíos): avisa de que aún no está conectado. No finge enviar nada.
2. **Solo con `email`**: abre el programa de correo del visitante con el mensaje ya escrito y dirigido a vosotros.
3. **Con Formspree (recomendado)**: los mensajes llegan directamente a vuestro correo.
   - Cread una cuenta gratuita en https://formspree.io
   - Pulsad *New form*, poned vuestro email y copiad la dirección que os da (tipo `https://formspree.io/f/abcdwxyz`).
   - Pegadla en `formEndpoint` dentro de `config.js`.
   - El plan gratuito admite un número limitado de envíos al mes, suficiente para empezar.

## Publicar en GitHub Pages

1. En GitHub, pulsad **New repository**.
2. Nombre del repositorio: **`garbimarketing.github.io`** (dentro de la organización garbimarketing) (exactamente así, para que la web quede en la dirección principal). Público.
3. Pulsad **uploading an existing file**, arrastrad todos los archivos y carpetas de este proyecto y pulsad **Commit changes**.
4. Id a **Settings → Pages**. En *Source* elegid **Deploy from a branch**, rama **main**, carpeta **/ (root)** y guardad.
5. En 1–2 minutos la web estará en https://garbimarketing.github.io/

## Actualizar la web

- **Desde la web de GitHub**: abrid el archivo (por ejemplo `config.js`), pulsad el lápiz ✏️, cambiad lo que queráis y pulsad **Commit changes**. La web se actualiza sola en un par de minutos.
- **Para cambiar imágenes**: *Add file → Upload files* y subid la imagen con el mismo nombre.

## Que aparezca en Google

1. Entrad en https://search.google.com/search-console y añadid la propiedad `https://garbimarketing.github.io/`.
2. Verificadla con el método de *etiqueta HTML*: Google os dará una línea `<meta name="google-site-verification" ...>` que se pega dentro del `<head>` de `index.html`.
3. En *Sitemaps*, enviad `sitemap.xml`.
4. Google tarda de días a semanas en indexar una web nueva. Crear un perfil de Google Business y enlazar la web desde Instagram ayuda.
