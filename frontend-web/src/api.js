/**
 * api.js
 * Acá están todas las funciones que hablan con el backend (fetch).
 * Si el backend corre en otra URL, hay que cambiar URL_BASE.
 */

const URL_BASE = 'http://localhost:3000/api'

// Localidades del Departamento Iglesia (mismo orden que el backend)
export const LOCALIDADES = [
  'Rodeo', 'Villa Iglesia', 'Las Flores', 'Bella Vista', 'Angualasto',
  'Tudcum', 'Pismanta', 'Colangüil', 'Malimán', 'Otra'
]

export const NOMBRES_TIPO_PETICION = {
  cambio_horario: 'Cambio de horario',
  nuevo_recorrido: 'Nuevo recorrido',
  mas_frecuencia: 'Más frecuencia',
  otro: 'Otro'
}

export const NOMBRES_TIPO_SERVICIO = {
  remis: 'Remis',
  viaje_largo: 'Viaje largo',
  flete: 'Flete',
  moto: 'Moto'
}

export const NOMBRES_DIAS_SERVICIO = {
  diario: 'Todos los días',
  habiles: 'Días hábiles',
  fines_semana: 'Fines de semana'
}

// -------------------------------------------------------------
// PETICIONES
// -------------------------------------------------------------

export async function obtenerPeticiones(tipo) {
  let url = URL_BASE + '/peticiones'
  if (tipo) {
    url = url + '?tipo=' + tipo
  }

  const respuesta = await fetch(url)
  const datos = await respuesta.json()
  return datos
}

export async function crearPeticion(peticion) {
  const respuesta = await fetch(URL_BASE + '/peticiones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(peticion)
  })
  const datos = await respuesta.json()
  return datos
}

export async function apoyarPeticion(id) {
  const respuesta = await fetch(URL_BASE + '/peticiones/' + id + '/apoyar', {
    method: 'PATCH'
  })
  const datos = await respuesta.json()
  return datos
}

// -------------------------------------------------------------
// CONDUCTORES
// -------------------------------------------------------------

export async function obtenerConductores(localidad) {
  let url = URL_BASE + '/conductores'
  if (localidad) {
    url = url + '?localidad=' + localidad
  }

  const respuesta = await fetch(url)
  const datos = await respuesta.json()
  return datos
}

export async function crearConductor(conductor) {
  const respuesta = await fetch(URL_BASE + '/conductores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(conductor)
  })
  const datos = await respuesta.json()
  return datos
}

// -------------------------------------------------------------
// RECORRIDOS (horarios y recorridos de colectivos)
// -------------------------------------------------------------

export async function obtenerRecorridos(filtros = {}) {
  const parametros = new URLSearchParams()

  if (filtros.localidadOrigen) parametros.append('localidadOrigen', filtros.localidadOrigen)
  if (filtros.localidadDestino) parametros.append('localidadDestino', filtros.localidadDestino)
  if (filtros.diasServicio) parametros.append('diasServicio', filtros.diasServicio)

  let url = URL_BASE + '/recorridos'
  const query = parametros.toString()
  if (query) {
    url = url + '?' + query
  }

  const respuesta = await fetch(url)
  const datos = await respuesta.json()
  return datos
}

export async function crearRecorrido(recorrido) {
  const respuesta = await fetch(URL_BASE + '/recorridos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(recorrido)
  })
  const datos = await respuesta.json()
  return datos
}
