# París en familia · 30 oct – 2 nov 2026

PWA del viaje familiar a París. Funciona sin conexión una vez abierta.

- **Hoy**: qué toca ahora y lo siguiente, con el tiempo del día. Antes del viaje, cuenta atrás, lista de "Antes de salir" y previsión.
- **Plan**: los cuatro días con su ilustración. Cada parada se abre para ver detalles y "Cómo llegar".
- **Mapa**: el recorrido de cada día o de todo el viaje, con "Dónde estoy".
- **Guía**: líneas de metro, frases útiles, dónde comer, consejos y emergencias.
- **Viaje**: tarjetas de embarque, hotel, reservas con su código, lista de cosas por hacer y maleta.

## Instalar en el móvil

1. Abrir la web de GitHub Pages con conexión.
2. iPhone: Compartir → *Añadir a pantalla de inicio*. Android: menú → *Instalar app*.
3. Abrir el **mapa de cada día** una vez con conexión, para que se guarde y se vea también sin internet.

Las marcas de "hecho", las notas y los códigos de reserva se guardan en cada móvil; no se comparten.

## Cambiar el plan

Todo el contenido está en `data.js`: hotel, coordenadas, paradas de cada día, vuelos, reservas, listas, metro, frases, restaurantes y consejos. Las instrucciones de cada campo están al principio del archivo.

Después de cambiar algo, sube el número de `CACHE` en `sw.js` para que los móviles cojan la versión nueva.

## Archivos

- `index.html`: estructura y diseño.
- `app.js`: la lógica de las pestañas, el mapa y el tiempo.
- `data.js`: el contenido del viaje.
- `scenes.js`: las ilustraciones de cada día, en SVG.
- `sw.js`: service worker (caché de la app y de las teselas del mapa que se ven).
- `vendor/`: Leaflet 1.9.4 y las fuentes Barlow y Barlow Condensed (SIL Open Font License).

Mapa © colaboradores de OpenStreetMap. Previsión del tiempo de Open-Meteo.

## Widget y avisos en el iPhone (Scriptable)

`scriptable/paris-widget.js` es un script para la app Scriptable (gratis en la App Store):

- Al abrirlo programa un aviso a la hora de cada parada que queda, y otro 15 minutos antes en lo reservado y en los desplazamientos (60 antes del vuelo).
- Como widget muestra qué toca ahora y lo siguiente, con cuenta atrás. Hay tamaños para la pantalla de inicio y la de bloqueo.
- Funciona sin conexión. Si cambia el plan, `node scriptable/build.js` lo regenera desde `data.js` y hay que volver a abrirlo para reprogramar los avisos.
