# Scraper de Anuncios de Facebook Ads Library con Playwright 🕵️‍♂️

Este script utiliza **Playwright** para automatizar la navegación por la biblioteca de anuncios de Facebook y extraer información útil como el título del anuncio, el enlace, emails y webs encontradas.

## 🚀 ¿Qué hace este script?

1. Abre un navegador Chromium (con interfaz).
2. Navega a una búsqueda específica en la [Facebook Ads Library](https://www.facebook.com/ads/library).
3. Realiza scroll automático para cargar más anuncios.
4. Extrae información de cada anuncio:
   - Título del anuncio
   - Enlace al anuncio
5. Visita cada anuncio y busca:
   - Correos electrónicos visibles
   - Enlaces a sitios web
6. Guarda todos los resultados en un archivo **CSV** llamado `resultados.csv`.

## 🧱 Requisitos

- Node.js
- Playwright
- Acceso a internet

## 📦 Instalación

Clona este repositorio y ejecuta:

```bash
git clone https://github.com/heb1k0/ads-meta-scrapping.git
cd ads-meta-scrapping
npm install
```

## ▶️ Ejecución

```bash
node index.js
```

## 🧩 Selectores usados

- `.xh8yej3` → Contenedor principal de anuncios
- `.x8t9es0` → Texto del anuncio
- `.xieb3on` → Contenedor de información adicional dentro del anuncio
- `.x193iq5w .xeuugli .x13faqbe` → Elementos tipo span donde se busca el email
- `a[target="_blank"]` → Posibles enlaces a sitios web

## 💾 Salida

El archivo `resultados.csv` contiene:

```
Title,Enlace,Emails,Web
"Ejemplo de Título","https://facebook.com/ads/...","contacto@ejemplo.com","www.ejemplo.com"
```

## ⚠️ Notas

- El script espera a que los elementos se carguen con `waitForTimeout` y `waitForSelector`.
- Puede tardar varios minutos dependiendo del número de anuncios y la velocidad de conexión.

## 🧑‍⚖️ Legal

Usar este script está sujeto a las políticas de uso de datos de Facebook. Úsalo bajo tu responsabilidad y solo con fines educativos o personales.

## 📄 Licencia

MIT License


## ⚙️ Personalización

Dentro del archivo `index.js`, puedes modificar los siguientes valores según tus preferencias:

```js
const PAIS = "ES"; // Cambia esto por el país que desees
// Puedes cambiar el país a otro que quieras, por ejemplo: "CO" para Colombia, "AR" para Argentina, etc.
let PALABRAS_CLAVE = "Coches de segunda mano"; // Cambia esto por la palabra clave que desees buscar
// Puedes cambiar la palabra clave a otra que quieras, por ejemplo: "Coches nuevos", "Móviles", etc.
```

- `PAIS`: Código del país desde donde deseas obtener los anuncios (por ejemplo: `ES`, `AR`, `CO`...).
- `PALABRAS_CLAVE`: Palabras clave que quieres buscar en los anuncios, separadas por comas.

Asegúrate de ajustar estos valores antes de ejecutar el script para obtener resultados relevantes para tu búsqueda.