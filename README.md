# París en familia · 30 oct – 2 nov 2026

PWA con el itinerario del viaje: lista y mapa por días, "ahora / siguiente", reservas, notas e info práctica. Funciona sin conexión una vez abierta.

## Instalar en el móvil

1. Abrir la web de GitHub Pages con conexión.
2. iPhone: Compartir → *Añadir a pantalla de inicio*. Android: menú → *Instalar app*.
3. Abrir el **mapa de cada día** una vez con conexión, para que se guarde y se vea también sin internet.

Las marcas de "hecho" y las notas se guardan en cada móvil; no se comparten.

## Cambiar el plan

Todo está al principio de `index.html`:

- `HOTEL`: datos del alojamiento.
- `PLACES`: coordenadas para el mapa, por el mismo texto que el campo `maps` de cada parada.
- `DAYS`: paradas de cada día (`t` hora, `title`, `note`, `fixed` si es reserva, `todo` si falta algo, `maps` para "Cómo llegar").
- `BEFORE`: lista de "Antes de salir".

Después de cambiar algo, sube el número de `CACHE` en `sw.js` para que los móviles cojan la versión nueva.

## Archivos

- `index.html`: la app.
- `sw.js`: service worker (caché de la app y de las teselas del mapa que se ven).
- `manifest.webmanifest` e iconos.
- `vendor/`: Leaflet 1.9.4 para el mapa. Mapa © colaboradores de OpenStreetMap.
