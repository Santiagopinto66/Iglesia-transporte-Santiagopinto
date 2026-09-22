# Transporte Iglesia

Plataforma web para mejorar el transporte en el Departamento Iglesia (San Juan).

**El problema:** los colectivos tienen pocos recorridos y horarios poco flexibles, y los servicios de remis o viajes particulares son difíciles de contactar (no se tiene el número o no se sabe si están activos). Aplicaciones como Uber o Didi no tienen presencia en la zona.

**La propuesta:** un sitio con tres partes.

1. **Peticiones (sección principal):** los vecinos publican pedidos para cambiar horarios de colectivos, sumar frecuencias o crear nuevos recorridos, y el resto apoya los pedidos. Las peticiones más apoyadas quedan primero.
2. **Recorridos:** consultor de horarios y recorridos de los colectivos que circulan dentro del departamento (línea, origen, destino, paradas, horarios de salida, días de servicio y frecuencia).
3. **Conductores:** quienes hacen remises, fletes o viajes se inscriben con su teléfono, localidad y zonas que cubren, y pueden marcarse como disponibles o no disponibles.
4. **Mapa:** ubicación de las localidades del departamento con Google Maps.

## Estructura del proyecto

```
backend/          -> Node.js + Express + Mongoose (API + MongoDB Atlas)
frontend-web/     -> React + Vite (interfaz que consume la API)
```

Son dos proyectos separados con su propio `package.json`, así que hay que instalar dependencias en cada carpeta por separado.

## Cómo levantarlo (backend + frontend juntos)

Se necesitan dos terminales abiertas al mismo tiempo.

**Terminal 1 - Backend:**
```bash
cd backend
npm install
cp .env.example .env     # completar MONGO_URI con los datos del cluster de MongoDB Atlas
npm run dev
```
Queda escuchando en `http://localhost:3000`.

**Terminal 2 - Frontend:**
```bash
cd frontend-web
npm install
cp .env.example .env     # completar con la clave de Google Maps (opcional, ver más abajo)
npm run dev
```
Queda escuchando en `http://localhost:5173` (o el puerto que indique Vite en la terminal).

Abrir `http://localhost:5173` en el navegador. El frontend habla con el backend a través de la URL definida en `frontend-web/src/api.js` (`URL_BASE`), que por defecto apunta a `http://localhost:3000/api`.

## Backend - Endpoints

### Conductores — `/api/conductores`

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/` | Lista los conductores. Filtros: `?localidad=Rodeo&tipoServicio=remis&disponible=true` |
| GET | `/:id` | Trae un conductor puntual |
| POST | `/` | Inscribe un conductor |
| PUT | `/:id` | Actualiza sus datos |
| PATCH | `/:id/disponibilidad` | Lo marca como disponible o no disponible |
| DELETE | `/:id` | Lo da de baja |

### Peticiones — `/api/peticiones`

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/` | Lista las peticiones ordenadas por apoyos. Filtros: `?tipo=cambio_horario&estado=abierta` |
| GET | `/:id` | Trae una petición puntual |
| POST | `/` | Crea una petición |
| PUT | `/:id` | Actualiza una petición |
| PATCH | `/:id/apoyar` | Suma un apoyo |
| DELETE | `/:id` | Elimina la petición |

Todas las respuestas siguen el formato `{ ok, mensaje, datos }`.

### Recorridos — `/api/recorridos`

| Método | Ruta | Qué hace |
|---|---|---|
| GET | `/` | Lista los recorridos. Filtros: `?localidadOrigen=Rodeo&localidadDestino=Las%20Flores&diasServicio=habiles` |
| GET | `/:id` | Trae un recorrido puntual |
| POST | `/` | Carga un recorrido de colectivo |
| PUT | `/:id` | Actualiza sus datos |
| PATCH | `/:id/estado` | Lo marca como activo o suspendido |
| DELETE | `/:id` | Lo elimina |

### Usuarios — `/api/usuarios` (pendiente)

Los archivos `models/Usuario.js`, `controllers/usuario.controller.js` y `routes/usuario.routes.js` ya están creados en el backend, pero sin código todavía: están esperando la versión que muestre el profe en clase para adaptarla acá con el mismo estilo que usamos en Conductor y Petición. Por eso `index.js` todavía no los conecta (está comentado, listo para descomentar cuando se agregue el código).

Una vez que exista, lo lógico es que el sistema de usuarios se adapte a esta app así: cada usuario podría ser quien publica peticiones o se inscribe como conductor, y quizás un rol de administrador para moderar contenido. Eso lo vemos con el código real del profe cuando lo tengan.

## Frontend - Qué hace cada pestaña

- **Peticiones:** tarjetas ordenadas por apoyos, filtro por tipo, botón para apoyar y formulario para publicar una nueva.
- **Recorridos:** tarjetas con línea, origen/destino, paradas intermedias, horarios de salida (en formato de chips), días de servicio, frecuencia y tarifa aproximada. Filtro por localidad de origen y por días de servicio, y formulario para cargar un recorrido nuevo.
- **Conductores:** tarjetas con teléfono, localidad, vehículo y estado de disponibilidad. Filtro por localidad y formulario para inscribirse.
- **Mapa:** localidades del departamento marcadas con Google Maps.

## Google Maps

La pestaña "Mapa" necesita una clave de la API de Google Maps (JavaScript API), gratuita hasta cierto uso mensual. Se consigue en [Google Cloud Console](https://console.cloud.google.com/google/maps-apis) y se pega en `frontend-web/.env` como `VITE_GOOGLE_MAPS_API_KEY`. Si no se configura, la pestaña muestra un aviso en vez de romperse.

Las coordenadas de las localidades (`frontend-web/src/localidades.js`) son aproximadas. Si alguna está mal ubicada en el mapa, se puede corregir buscando el lugar en Google Maps y copiando el lat/lng de ahí.

## Valores permitidos

- `localidad`: Rodeo, Villa Iglesia, Las Flores, Bella Vista, Angualasto, Tudcum, Pismanta, Colangüil, Malimán, Otra
- `tipoServicio`: `remis`, `viaje_largo`, `flete`, `moto`
- `tipo` de petición: `cambio_horario`, `nuevo_recorrido`, `mas_frecuencia`, `otro`
- `estado` de petición: `abierta`, `en_revision`, `resuelta`, `rechazada`
- `diasServicio` de recorrido: `diario`, `habiles`, `fines_semana`
- `horariosSalida` de recorrido: array de strings en formato `HH:MM` (ej: `"07:30"`)
