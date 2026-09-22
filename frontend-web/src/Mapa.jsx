import { useEffect, useRef, useState } from 'react'
import { LOCALIDADES_MAPA, CENTRO_MAPA } from './localidades.js'

// La clave de Google Maps se guarda en el archivo .env del frontend,
// en la variable VITE_GOOGLE_MAPS_API_KEY (ver .env.example)
const CLAVE_API = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

function Mapa() {
  const contenedorMapa = useRef(null)
  const [errorMapa, setErrorMapa] = useState('')

  useEffect(() => {
    // Si todavía no se cargó la clave de Google Maps, no intentamos cargar el mapa
    if (!CLAVE_API) {
      setErrorMapa('Falta configurar la clave de Google Maps (VITE_GOOGLE_MAPS_API_KEY en el .env).')
      return
    }

    // Si el script de Google Maps ya está cargado, inicializamos directo
    if (window.google && window.google.maps) {
      inicializarMapa()
      return
    }

    // Si no está cargado, lo agregamos una sola vez
    const scriptExistente = document.getElementById('script-google-maps')
    if (scriptExistente) {
      scriptExistente.addEventListener('load', inicializarMapa)
      return
    }

    const script = document.createElement('script')
    script.id = 'script-google-maps'
    script.src = 'https://maps.googleapis.com/maps/api/js?key=' + CLAVE_API
    script.async = true
    script.onload = inicializarMapa
    script.onerror = () => setErrorMapa('No se pudo cargar Google Maps. Revisá la clave de la API.')
    document.body.appendChild(script)
  }, [])

  function inicializarMapa() {
    if (!contenedorMapa.current) return

    const mapa = new window.google.maps.Map(contenedorMapa.current, {
      center: CENTRO_MAPA,
      zoom: 9
    })

    for (let i = 0; i < LOCALIDADES_MAPA.length; i++) {
      const localidad = LOCALIDADES_MAPA[i]
      new window.google.maps.Marker({
        position: { lat: localidad.lat, lng: localidad.lng },
        map: mapa,
        title: localidad.nombre
      })
    }
  }

  if (errorMapa) {
    return <p className="mapa-aviso">{errorMapa}</p>
  }

  return <div className="mapa-caja" ref={contenedorMapa}></div>
}

export default Mapa
