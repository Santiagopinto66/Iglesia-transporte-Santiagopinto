# Frontend - Transporte Iglesia

Hecho con React + Vite. Consume la API del backend (`../backend`).

## Puesta en marcha

```bash
npm install
cp .env.example .env     # completar con la clave de Google Maps
npm run dev
```

Por defecto Vite lo levanta en `http://localhost:5173`. El backend tiene que estar corriendo en `http://localhost:3000` (ver `src/api.js`, ahí está la URL_BASE).

## Estructura

```
src/
├── main.jsx         # Punto de entrada de React
├── App.jsx          # Componente principal: pestañas, listas, formularios
├── Mapa.jsx          # Componente del mapa (Google Maps)
├── App.css           # Estilos de la app
├── index.css         # Estilos globales
├── api.js            # Funciones que hablan con el backend (fetch)
└── localidades.js     # Coordenadas de las localidades para el mapa
```

## Google Maps

La pestaña "Mapa" necesita una clave de la API de Google Maps (JavaScript API). Se consigue en Google Cloud Console y se pega en el archivo `.env` como `VITE_GOOGLE_MAPS_API_KEY`. Si no se configura, la pestaña muestra un aviso en vez de romperse.

Las coordenadas de las localidades en `src/localidades.js` son aproximadas: si alguna está mal ubicada, se puede corregir buscando el lugar en Google Maps y copiando el lat/lng de ahí.
