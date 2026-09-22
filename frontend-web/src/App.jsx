import { useState, useEffect } from 'react'
import './App.css'
import {
  obtenerPeticiones,
  crearPeticion,
  apoyarPeticion,
  obtenerConductores,
  crearConductor,
  obtenerRecorridos,
  crearRecorrido,
  LOCALIDADES,
  NOMBRES_TIPO_PETICION,
  NOMBRES_TIPO_SERVICIO,
  NOMBRES_DIAS_SERVICIO
} from './api.js'
import Mapa from './Mapa.jsx'

function App() {
  // Qué pestaña está activa: 'peticiones', 'conductores' o 'mapa'
  const [pestanaActiva, setPestanaActiva] = useState('peticiones')

  // ---------- Estado de Peticiones ----------
  const [peticiones, setPeticiones] = useState([])
  const [cargandoPeticiones, setCargandoPeticiones] = useState(true)
  const [errorPeticiones, setErrorPeticiones] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [modalPeticionAbierto, setModalPeticionAbierto] = useState(false)
  const [errorFormPeticion, setErrorFormPeticion] = useState('')
  const [enviandoPeticion, setEnviandoPeticion] = useState(false)
  const [formPeticion, setFormPeticion] = useState({
    titulo: '',
    tipo: '',
    origen: '',
    destino: '',
    horarioActual: '',
    horarioSugerido: '',
    descripcion: '',
    autor: ''
  })

  // ---------- Estado de Recorridos ----------
  const [recorridos, setRecorridos] = useState([])
  const [cargandoRecorridos, setCargandoRecorridos] = useState(true)
  const [errorRecorridos, setErrorRecorridos] = useState('')
  const [filtroOrigenRecorrido, setFiltroOrigenRecorrido] = useState('')
  const [filtroDiasServicio, setFiltroDiasServicio] = useState('')
  const [modalRecorridoAbierto, setModalRecorridoAbierto] = useState(false)
  const [errorFormRecorrido, setErrorFormRecorrido] = useState('')
  const [enviandoRecorrido, setEnviandoRecorrido] = useState(false)
  const [formRecorrido, setFormRecorrido] = useState({
    nombreLinea: '',
    empresa: '',
    localidadOrigen: '',
    localidadDestino: '',
    paradas: '',
    horariosSalida: '',
    diasServicio: 'diario',
    frecuenciaMinutos: '',
    tarifa: '',
    observaciones: ''
  })

  // ---------- Estado de Conductores ----------
  const [conductores, setConductores] = useState([])
  const [cargandoConductores, setCargandoConductores] = useState(true)
  const [errorConductores, setErrorConductores] = useState('')
  const [filtroLocalidad, setFiltroLocalidad] = useState('')
  const [modalConductorAbierto, setModalConductorAbierto] = useState(false)
  const [errorFormConductor, setErrorFormConductor] = useState('')
  const [enviandoConductor, setEnviandoConductor] = useState(false)
  const [formConductor, setFormConductor] = useState({
    nombre: '',
    telefono: '',
    localidad: '',
    tipoServicio: 'remis',
    vehiculo: '',
    capacidad: 4,
    zonas: ''
  })

  // Cargar peticiones cuando cambia el filtro de tipo
  useEffect(() => {
    cargarPeticiones()
  }, [filtroTipo])

  // Cargar conductores cuando cambia el filtro de localidad
  useEffect(() => {
    cargarConductores()
  }, [filtroLocalidad])

  // Cargar recorridos cuando cambian sus filtros
  useEffect(() => {
    cargarRecorridos()
  }, [filtroOrigenRecorrido, filtroDiasServicio])

  async function cargarPeticiones() {
    setCargandoPeticiones(true)
    setErrorPeticiones('')

    const respuesta = await obtenerPeticiones(filtroTipo)

    if (respuesta.ok) {
      setPeticiones(respuesta.datos)
    } else {
      setErrorPeticiones(respuesta.mensaje)
    }

    setCargandoPeticiones(false)
  }

  async function cargarConductores() {
    setCargandoConductores(true)
    setErrorConductores('')

    const respuesta = await obtenerConductores(filtroLocalidad)

    if (respuesta.ok) {
      setConductores(respuesta.datos)
    } else {
      setErrorConductores(respuesta.mensaje)
    }

    setCargandoConductores(false)
  }

  async function cargarRecorridos() {
    setCargandoRecorridos(true)
    setErrorRecorridos('')

    const respuesta = await obtenerRecorridos({
      localidadOrigen: filtroOrigenRecorrido,
      diasServicio: filtroDiasServicio
    })

    if (respuesta.ok) {
      setRecorridos(respuesta.datos)
    } else {
      setErrorRecorridos(respuesta.mensaje)
    }

    setCargandoRecorridos(false)
  }

  async function manejarApoyo(id) {
    const respuesta = await apoyarPeticion(id)

    if (respuesta.ok) {
      // Actualizamos solo esa petición en la lista, sin recargar todo
      const listaActualizada = peticiones.map((peticion) => {
        if (peticion._id === id) {
          return { ...peticion, apoyos: respuesta.datos.apoyos }
        }
        return peticion
      })
      setPeticiones(listaActualizada)
    } else {
      alert(respuesta.mensaje)
    }
  }

  function actualizarCampoPeticion(campo, valor) {
    setFormPeticion({ ...formPeticion, [campo]: valor })
  }

  function actualizarCampoConductor(campo, valor) {
    setFormConductor({ ...formConductor, [campo]: valor })
  }

  function actualizarCampoRecorrido(campo, valor) {
    setFormRecorrido({ ...formRecorrido, [campo]: valor })
  }

  async function manejarSubmitPeticion(evento) {
    evento.preventDefault()
    setErrorFormPeticion('')
    setEnviandoPeticion(true)

    const respuesta = await crearPeticion(formPeticion)

    setEnviandoPeticion(false)

    if (respuesta.ok) {
      setModalPeticionAbierto(false)
      setFormPeticion({
        titulo: '', tipo: '', origen: '', destino: '',
        horarioActual: '', horarioSugerido: '', descripcion: '', autor: ''
      })
      cargarPeticiones()
    } else {
      setErrorFormPeticion(respuesta.mensaje)
    }
  }

  async function manejarSubmitConductor(evento) {
    evento.preventDefault()
    setErrorFormConductor('')
    setEnviandoConductor(true)

    let zonas = []
    if (formConductor.zonas.trim() !== '') {
      const partes = formConductor.zonas.split(',')
      for (let i = 0; i < partes.length; i++) {
        zonas.push(partes[i].trim())
      }
    }

    const conductorAEnviar = {
      nombre: formConductor.nombre,
      telefono: formConductor.telefono,
      localidad: formConductor.localidad,
      tipoServicio: formConductor.tipoServicio,
      vehiculo: formConductor.vehiculo,
      capacidad: Number(formConductor.capacidad),
      zonasCubiertas: zonas
    }

    const respuesta = await crearConductor(conductorAEnviar)

    setEnviandoConductor(false)

    if (respuesta.ok) {
      setModalConductorAbierto(false)
      setFormConductor({
        nombre: '', telefono: '', localidad: '', tipoServicio: 'remis',
        vehiculo: '', capacidad: 4, zonas: ''
      })
      cargarConductores()
    } else {
      setErrorFormConductor(respuesta.mensaje)
    }
  }

  async function manejarSubmitRecorrido(evento) {
    evento.preventDefault()
    setErrorFormRecorrido('')
    setEnviandoRecorrido(true)

    let paradas = []
    if (formRecorrido.paradas.trim() !== '') {
      paradas = formRecorrido.paradas.split(',').map((p) => p.trim())
    }

    let horariosSalida = []
    if (formRecorrido.horariosSalida.trim() !== '') {
      horariosSalida = formRecorrido.horariosSalida.split(',').map((h) => h.trim())
    }

    const recorridoAEnviar = {
      nombreLinea: formRecorrido.nombreLinea,
      empresa: formRecorrido.empresa,
      localidadOrigen: formRecorrido.localidadOrigen,
      localidadDestino: formRecorrido.localidadDestino,
      paradas,
      horariosSalida,
      diasServicio: formRecorrido.diasServicio,
      frecuenciaMinutos: formRecorrido.frecuenciaMinutos ? Number(formRecorrido.frecuenciaMinutos) : undefined,
      tarifa: formRecorrido.tarifa,
      observaciones: formRecorrido.observaciones
    }

    const respuesta = await crearRecorrido(recorridoAEnviar)

    setEnviandoRecorrido(false)

    if (respuesta.ok) {
      setModalRecorridoAbierto(false)
      setFormRecorrido({
        nombreLinea: '', empresa: '', localidadOrigen: '', localidadDestino: '',
        paradas: '', horariosSalida: '', diasServicio: 'diario',
        frecuenciaMinutos: '', tarifa: '', observaciones: ''
      })
      cargarRecorridos()
    } else {
      setErrorFormRecorrido(respuesta.mensaje)
    }
  }

  // ---------- Cálculos para el encabezado ----------
  function contarPeticionesAbiertas() {
    let contador = 0
    for (let i = 0; i < peticiones.length; i++) {
      if (peticiones[i].estado === 'abierta') contador++
    }
    return contador
  }

  function contarApoyosTotales() {
    let total = 0
    for (let i = 0; i < peticiones.length; i++) {
      total += peticiones[i].apoyos
    }
    return total
  }

  function contarConductoresDisponibles() {
    let contador = 0
    for (let i = 0; i < conductores.length; i++) {
      if (conductores[i].disponible) contador++
    }
    return contador
  }

  function contarRecorridosActivos() {
    let contador = 0
    for (let i = 0; i < recorridos.length; i++) {
      if (recorridos[i].activo) contador++
    }
    return contador
  }

  return (
    <>
      <header className="header">
        <div className="contenedor header-contenido">
          <span className="logo">Transporte Iglesia</span>
          <nav className="tabs">
            <button
              className={pestanaActiva === 'peticiones' ? 'tab-btn tab-activo' : 'tab-btn'}
              onClick={() => setPestanaActiva('peticiones')}
            >
              Peticiones
            </button>
            <button
              className={pestanaActiva === 'recorridos' ? 'tab-btn tab-activo' : 'tab-btn'}
              onClick={() => setPestanaActiva('recorridos')}
            >
              Recorridos
            </button>
            <button
              className={pestanaActiva === 'conductores' ? 'tab-btn tab-activo' : 'tab-btn'}
              onClick={() => setPestanaActiva('conductores')}
            >
              Conductores
            </button>
            <button
              className={pestanaActiva === 'mapa' ? 'tab-btn tab-activo' : 'tab-btn'}
              onClick={() => setPestanaActiva('mapa')}
            >
              Mapa
            </button>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="contenedor">
            <p className="hero-eyebrow">Departamento Iglesia, San Juan</p>
            <h1 className="hero-titulo">
              Un recorrido no se cambia solo. Se pide, se suma gente, se consigue.
            </h1>
            <p className="hero-texto">
              Los colectivos de la zona tienen pocos recorridos y horarios que no siempre alcanzan.
              Esta es la cartelera de pedidos de los vecinos, y el listado de quienes hacen remises
              y viajes cuando el colectivo no llega.
            </p>

            <div className="hero-stats">
              <div className="stat-box">
                <span className="stat-numero">{contarPeticionesAbiertas()}</span>
                <span className="stat-texto">peticiones abiertas</span>
              </div>
              <div className="stat-box">
                <span className="stat-numero">{contarApoyosTotales()}</span>
                <span className="stat-texto">apoyos acumulados</span>
              </div>
              <div className="stat-box">
                <span className="stat-numero">{contarConductoresDisponibles()}</span>
                <span className="stat-texto">conductores disponibles</span>
              </div>
              <div className="stat-box">
                <span className="stat-numero">{contarRecorridosActivos()}</span>
                <span className="stat-texto">recorridos de colectivo</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================= SECCION PETICIONES ================= */}
        {pestanaActiva === 'peticiones' && (
          <section className="seccion contenedor">
            <div className="seccion-encabezado">
              <div>
                <h2>Peticiones al servicio de colectivos</h2>
                <p className="seccion-texto">
                  Cambios de horario, nuevos recorridos o más frecuencia. Apoyá los pedidos
                  que también te afectan a vos.
                </p>
              </div>
              <button className="btn btn-primario" onClick={() => setModalPeticionAbierto(true)}>
                Nueva petición
              </button>
            </div>

            <div className="filtros">
              <button
                className={filtroTipo === '' ? 'filtro-btn filtro-activo' : 'filtro-btn'}
                onClick={() => setFiltroTipo('')}
              >
                Todas
              </button>
              <button
                className={filtroTipo === 'cambio_horario' ? 'filtro-btn filtro-activo' : 'filtro-btn'}
                onClick={() => setFiltroTipo('cambio_horario')}
              >
                Cambio de horario
              </button>
              <button
                className={filtroTipo === 'nuevo_recorrido' ? 'filtro-btn filtro-activo' : 'filtro-btn'}
                onClick={() => setFiltroTipo('nuevo_recorrido')}
              >
                Nuevo recorrido
              </button>
              <button
                className={filtroTipo === 'mas_frecuencia' ? 'filtro-btn filtro-activo' : 'filtro-btn'}
                onClick={() => setFiltroTipo('mas_frecuencia')}
              >
                Más frecuencia
              </button>
              <button
                className={filtroTipo === 'otro' ? 'filtro-btn filtro-activo' : 'filtro-btn'}
                onClick={() => setFiltroTipo('otro')}
              >
                Otro
              </button>
            </div>

            {cargandoPeticiones && <p className="mensaje-info">Cargando peticiones...</p>}
            {!cargandoPeticiones && errorPeticiones && (
              <p className="mensaje-error">{errorPeticiones}</p>
            )}
            {!cargandoPeticiones && !errorPeticiones && peticiones.length === 0 && (
              <p className="mensaje-vacio">
                Todavía no hay peticiones en esta categoría. Sé el primero en publicar una.
              </p>
            )}

            {!cargandoPeticiones && !errorPeticiones && peticiones.length > 0 && (
              <div className="lista-peticiones">
                {peticiones.map((peticion) => (
                  <div className="peticion-tarjeta" key={peticion._id}>
                    <div className="peticion-info">
                      <span className="peticion-etiqueta">
                        {NOMBRES_TIPO_PETICION[peticion.tipo] || 'Otro'}
                      </span>
                      <h3>{peticion.titulo}</h3>
                      <p className="peticion-ruta">{peticion.origen} -&gt; {peticion.destino}</p>
                      <p className="peticion-descripcion">{peticion.descripcion}</p>
                      <p className="peticion-horarios">
                        {peticion.horarioActual && <span>Actual: {peticion.horarioActual}</span>}
                        {peticion.horarioSugerido && <span>Propuesto: {peticion.horarioSugerido}</span>}
                      </p>
                      <p className="peticion-autor">Publicado por {peticion.autor}</p>
                    </div>
                    <div className="peticion-apoyo">
                      <span className="apoyos-numero">{peticion.apoyos}</span>
                      <button className="btn-apoyar" onClick={() => manejarApoyo(peticion._id)}>
                        Apoyar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ================= SECCION RECORRIDOS ================= */}
        {pestanaActiva === 'recorridos' && (
          <section className="seccion contenedor">
            <div className="seccion-encabezado">
              <div>
                <h2>Horarios y recorridos de colectivos</h2>
                <p className="seccion-texto">
                  Consultá los recorridos y horarios de los colectivos que circulan dentro
                  del Departamento Iglesia.
                </p>
              </div>
              <button className="btn btn-primario" onClick={() => setModalRecorridoAbierto(true)}>
                Cargar recorrido
              </button>
            </div>

            <div className="filtros">
              <button
                className={filtroOrigenRecorrido === '' ? 'filtro-btn filtro-activo' : 'filtro-btn'}
                onClick={() => setFiltroOrigenRecorrido('')}
              >
                Todos los orígenes
              </button>
              {LOCALIDADES.map((localidad) => (
                <button
                  key={localidad}
                  className={filtroOrigenRecorrido === localidad ? 'filtro-btn filtro-activo' : 'filtro-btn'}
                  onClick={() => setFiltroOrigenRecorrido(localidad)}
                >
                  {localidad}
                </button>
              ))}
            </div>

            <div className="filtros">
              <button
                className={filtroDiasServicio === '' ? 'filtro-btn filtro-activo' : 'filtro-btn'}
                onClick={() => setFiltroDiasServicio('')}
              >
                Cualquier día
              </button>
              <button
                className={filtroDiasServicio === 'diario' ? 'filtro-btn filtro-activo' : 'filtro-btn'}
                onClick={() => setFiltroDiasServicio('diario')}
              >
                Todos los días
              </button>
              <button
                className={filtroDiasServicio === 'habiles' ? 'filtro-btn filtro-activo' : 'filtro-btn'}
                onClick={() => setFiltroDiasServicio('habiles')}
              >
                Días hábiles
              </button>
              <button
                className={filtroDiasServicio === 'fines_semana' ? 'filtro-btn filtro-activo' : 'filtro-btn'}
                onClick={() => setFiltroDiasServicio('fines_semana')}
              >
                Fines de semana
              </button>
            </div>

            {cargandoRecorridos && <p className="mensaje-info">Cargando recorridos...</p>}
            {!cargandoRecorridos && errorRecorridos && (
              <p className="mensaje-error">{errorRecorridos}</p>
            )}
            {!cargandoRecorridos && !errorRecorridos && recorridos.length === 0 && (
              <p className="mensaje-vacio">
                No hay recorridos cargados todavía con estos filtros.
              </p>
            )}

            {!cargandoRecorridos && !errorRecorridos && recorridos.length > 0 && (
              <div className="lista-recorridos">
                {recorridos.map((recorrido) => (
                  <div
                    className={recorrido.activo ? 'recorrido-tarjeta' : 'recorrido-tarjeta recorrido-inactivo'}
                    key={recorrido._id}
                  >
                    <div className="recorrido-top">
                      <h3>{recorrido.nombreLinea}</h3>
                      <span className={recorrido.activo ? 'estado estado-online' : 'estado'}>
                        {recorrido.activo ? 'En servicio' : 'Suspendido'}
                      </span>
                    </div>

                    <p className="recorrido-ruta">
                      {recorrido.localidadOrigen} -&gt; {recorrido.localidadDestino}
                    </p>

                    {recorrido.paradas && recorrido.paradas.length > 0 && (
                      <p className="recorrido-paradas">Pasa por: {recorrido.paradas.join(', ')}</p>
                    )}

                    <p className="recorrido-meta">
                      {recorrido.empresa && recorrido.empresa !== 'Sin especificar' ? recorrido.empresa + ' - ' : ''}
                      {NOMBRES_DIAS_SERVICIO[recorrido.diasServicio] || recorrido.diasServicio}
                      {recorrido.frecuenciaMinutos ? ` - cada ${recorrido.frecuenciaMinutos} min` : ''}
                    </p>

                    {recorrido.horariosSalida && recorrido.horariosSalida.length > 0 && (
                      <div className="recorrido-horarios">
                        {recorrido.horariosSalida.map((horario) => (
                          <span className="horario-chip" key={horario}>{horario}</span>
                        ))}
                      </div>
                    )}

                    {recorrido.tarifa && (
                      <p className="recorrido-tarifa">Tarifa aproximada: {recorrido.tarifa}</p>
                    )}

                    {recorrido.observaciones && (
                      <p className="recorrido-observaciones">{recorrido.observaciones}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ================= SECCION CONDUCTORES ================= */}
        {pestanaActiva === 'conductores' && (
          <section className="seccion contenedor">
            <div className="seccion-encabezado">
              <div>
                <h2>Conductores de la zona</h2>
                <p className="seccion-texto">
                  Remises, viajes largos, fletes y moto. Los que están disponibles ahora aparecen primero.
                </p>
              </div>
              <button className="btn btn-secundario" onClick={() => setModalConductorAbierto(true)}>
                Inscribirme
              </button>
            </div>

            <div className="filtros">
              <button
                className={filtroLocalidad === '' ? 'filtro-btn filtro-activo' : 'filtro-btn'}
                onClick={() => setFiltroLocalidad('')}
              >
                Todas las localidades
              </button>
              {LOCALIDADES.map((localidad) => (
                <button
                  key={localidad}
                  className={filtroLocalidad === localidad ? 'filtro-btn filtro-activo' : 'filtro-btn'}
                  onClick={() => setFiltroLocalidad(localidad)}
                >
                  {localidad}
                </button>
              ))}
            </div>

            {cargandoConductores && <p className="mensaje-info">Cargando conductores...</p>}
            {!cargandoConductores && errorConductores && (
              <p className="mensaje-error">{errorConductores}</p>
            )}
            {!cargandoConductores && !errorConductores && conductores.length === 0 && (
              <p className="mensaje-vacio">Todavía no hay conductores inscriptos en esta localidad.</p>
            )}

            {!cargandoConductores && !errorConductores && conductores.length > 0 && (
              <div className="lista-conductores">
                {conductores.map((conductor) => (
                  <div
                    className={conductor.disponible ? 'conductor-tarjeta' : 'conductor-tarjeta conductor-offline'}
                    key={conductor._id}
                  >
                    <div className="conductor-top">
                      <span className="conductor-nombre">{conductor.nombre}</span>
                      <span className={conductor.disponible ? 'estado estado-online' : 'estado'}>
                        {conductor.disponible ? 'Disponible' : 'No disponible'}
                      </span>
                    </div>
                    <p className="conductor-meta">
                      {NOMBRES_TIPO_SERVICIO[conductor.tipoServicio] || conductor.tipoServicio} - {conductor.localidad}
                    </p>
                    <p className="conductor-meta">
                      {conductor.vehiculo || 'Vehículo sin especificar'} - hasta {conductor.capacidad} pasajeros
                    </p>
                    {conductor.zonasCubiertas && conductor.zonasCubiertas.length > 0 && (
                      <p className="conductor-zonas">Cubre: {conductor.zonasCubiertas.join(', ')}</p>
                    )}
                    <a className="conductor-telefono" href={'tel:' + conductor.telefono}>
                      {conductor.telefono}
                    </a>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* ================= SECCION MAPA ================= */}
        {pestanaActiva === 'mapa' && (
          <section className="seccion contenedor">
            <div className="seccion-encabezado">
              <div>
                <h2>Mapa del departamento</h2>
                <p className="seccion-texto">
                  Ubicación aproximada de las localidades del Departamento Iglesia.
                </p>
              </div>
            </div>
            <Mapa />
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="contenedor">
          <p>Proyecto de vecinos del Departamento Iglesia. Los datos que cargás acá los ve el resto de la comunidad.</p>
        </div>
      </footer>

      {/* ============ VENTANA: nueva petición ============ */}
      {modalPeticionAbierto && (
        <div className="modal-fondo" onClick={(e) => { if (e.target === e.currentTarget) setModalPeticionAbierto(false) }}>
          <div className="modal-caja">
            <div className="modal-encabezado">
              <h3>Nueva petición</h3>
              <button className="modal-cerrar" onClick={() => setModalPeticionAbierto(false)}>X</button>
            </div>

            <form onSubmit={manejarSubmitPeticion}>
              <label className="campo">
                <span>Título</span>
                <input
                  type="text"
                  required
                  maxLength={120}
                  placeholder="Ej: Colectivo a Rodeo más temprano"
                  value={formPeticion.titulo}
                  onChange={(e) => actualizarCampoPeticion('titulo', e.target.value)}
                />
              </label>

              <label className="campo">
                <span>Qué estás pidiendo</span>
                <select
                  required
                  value={formPeticion.tipo}
                  onChange={(e) => actualizarCampoPeticion('tipo', e.target.value)}
                >
                  <option value="" disabled>Elegí una opción</option>
                  <option value="cambio_horario">Cambio de horario</option>
                  <option value="nuevo_recorrido">Nuevo recorrido</option>
                  <option value="mas_frecuencia">Más frecuencia</option>
                  <option value="otro">Otro</option>
                </select>
              </label>

              <div className="campo-fila">
                <label className="campo">
                  <span>Origen</span>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Villa Iglesia"
                    value={formPeticion.origen}
                    onChange={(e) => actualizarCampoPeticion('origen', e.target.value)}
                  />
                </label>
                <label className="campo">
                  <span>Destino</span>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Rodeo"
                    value={formPeticion.destino}
                    onChange={(e) => actualizarCampoPeticion('destino', e.target.value)}
                  />
                </label>
              </div>

              <div className="campo-fila">
                <label className="campo">
                  <span>Horario actual (opcional)</span>
                  <input
                    type="text"
                    placeholder="Ej: 09:00"
                    value={formPeticion.horarioActual}
                    onChange={(e) => actualizarCampoPeticion('horarioActual', e.target.value)}
                  />
                </label>
                <label className="campo">
                  <span>Horario que proponés (opcional)</span>
                  <input
                    type="text"
                    placeholder="Ej: 06:30"
                    value={formPeticion.horarioSugerido}
                    onChange={(e) => actualizarCampoPeticion('horarioSugerido', e.target.value)}
                  />
                </label>
              </div>

              <label className="campo">
                <span>Contanos la situación</span>
                <textarea
                  required
                  maxLength={600}
                  rows={4}
                  placeholder="Por qué hace falta este cambio, a quiénes afecta..."
                  value={formPeticion.descripcion}
                  onChange={(e) => actualizarCampoPeticion('descripcion', e.target.value)}
                />
              </label>

              <label className="campo">
                <span>Tu nombre (o el de tu barrio/grupo)</span>
                <input
                  type="text"
                  required
                  maxLength={80}
                  placeholder="Ej: Vecinos de Villa Iglesia"
                  value={formPeticion.autor}
                  onChange={(e) => actualizarCampoPeticion('autor', e.target.value)}
                />
              </label>

              {errorFormPeticion && <p className="mensaje-error">{errorFormPeticion}</p>}

              <div className="modal-botones">
                <button type="button" className="btn btn-ghost" onClick={() => setModalPeticionAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primario" disabled={enviandoPeticion}>
                  {enviandoPeticion ? 'Publicando...' : 'Publicar petición'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ VENTANA: cargar recorrido ============ */}
      {modalRecorridoAbierto && (
        <div className="modal-fondo" onClick={(e) => { if (e.target === e.currentTarget) setModalRecorridoAbierto(false) }}>
          <div className="modal-caja">
            <div className="modal-encabezado">
              <h3>Cargar recorrido de colectivo</h3>
              <button className="modal-cerrar" onClick={() => setModalRecorridoAbierto(false)}>X</button>
            </div>

            <form onSubmit={manejarSubmitRecorrido}>
              <label className="campo">
                <span>Nombre de la línea</span>
                <input
                  type="text"
                  required
                  maxLength={120}
                  placeholder="Ej: Línea Rodeo - Las Flores"
                  value={formRecorrido.nombreLinea}
                  onChange={(e) => actualizarCampoRecorrido('nombreLinea', e.target.value)}
                />
              </label>

              <label className="campo">
                <span>Empresa (opcional)</span>
                <input
                  type="text"
                  placeholder="Ej: El Cóndor"
                  value={formRecorrido.empresa}
                  onChange={(e) => actualizarCampoRecorrido('empresa', e.target.value)}
                />
              </label>

              <div className="campo-fila">
                <label className="campo">
                  <span>Localidad de origen</span>
                  <select
                    required
                    value={formRecorrido.localidadOrigen}
                    onChange={(e) => actualizarCampoRecorrido('localidadOrigen', e.target.value)}
                  >
                    <option value="" disabled>Elegí el origen</option>
                    {LOCALIDADES.map((localidad) => (
                      <option value={localidad} key={localidad}>{localidad}</option>
                    ))}
                  </select>
                </label>
                <label className="campo">
                  <span>Localidad de destino</span>
                  <select
                    required
                    value={formRecorrido.localidadDestino}
                    onChange={(e) => actualizarCampoRecorrido('localidadDestino', e.target.value)}
                  >
                    <option value="" disabled>Elegí el destino</option>
                    {LOCALIDADES.map((localidad) => (
                      <option value={localidad} key={localidad}>{localidad}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="campo">
                <span>Paradas intermedias, en orden (separadas por coma, opcional)</span>
                <input
                  type="text"
                  placeholder="Ej: Bella Vista, Pismanta"
                  value={formRecorrido.paradas}
                  onChange={(e) => actualizarCampoRecorrido('paradas', e.target.value)}
                />
              </label>

              <label className="campo">
                <span>Horarios de salida (separados por coma, formato HH:MM)</span>
                <input
                  type="text"
                  placeholder="Ej: 07:00, 12:30, 18:00"
                  value={formRecorrido.horariosSalida}
                  onChange={(e) => actualizarCampoRecorrido('horariosSalida', e.target.value)}
                />
              </label>

              <div className="campo-fila">
                <label className="campo">
                  <span>Días de servicio</span>
                  <select
                    value={formRecorrido.diasServicio}
                    onChange={(e) => actualizarCampoRecorrido('diasServicio', e.target.value)}
                  >
                    <option value="diario">Todos los días</option>
                    <option value="habiles">Días hábiles</option>
                    <option value="fines_semana">Fines de semana</option>
                  </select>
                </label>
                <label className="campo">
                  <span>Frecuencia en minutos (opcional)</span>
                  <input
                    type="number"
                    min={0}
                    placeholder="Ej: 60"
                    value={formRecorrido.frecuenciaMinutos}
                    onChange={(e) => actualizarCampoRecorrido('frecuenciaMinutos', e.target.value)}
                  />
                </label>
              </div>

              <label className="campo">
                <span>Tarifa aproximada (opcional)</span>
                <input
                  type="text"
                  placeholder="Ej: $800"
                  value={formRecorrido.tarifa}
                  onChange={(e) => actualizarCampoRecorrido('tarifa', e.target.value)}
                />
              </label>

              <label className="campo">
                <span>Observaciones (opcional)</span>
                <textarea
                  maxLength={400}
                  rows={3}
                  placeholder="Ej: Los días de lluvia no sale desde Angualasto"
                  value={formRecorrido.observaciones}
                  onChange={(e) => actualizarCampoRecorrido('observaciones', e.target.value)}
                />
              </label>

              {errorFormRecorrido && <p className="mensaje-error">{errorFormRecorrido}</p>}

              <div className="modal-botones">
                <button type="button" className="btn btn-ghost" onClick={() => setModalRecorridoAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primario" disabled={enviandoRecorrido}>
                  {enviandoRecorrido ? 'Guardando...' : 'Guardar recorrido'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ VENTANA: inscribir conductor ============ */}
      {modalConductorAbierto && (
        <div className="modal-fondo" onClick={(e) => { if (e.target === e.currentTarget) setModalConductorAbierto(false) }}>
          <div className="modal-caja">
            <div className="modal-encabezado">
              <h3>Inscribirme como conductor</h3>
              <button className="modal-cerrar" onClick={() => setModalConductorAbierto(false)}>X</button>
            </div>

            <form onSubmit={manejarSubmitConductor}>
              <label className="campo">
                <span>Nombre</span>
                <input
                  type="text"
                  required
                  maxLength={80}
                  placeholder="Nombre y apellido"
                  value={formConductor.nombre}
                  onChange={(e) => actualizarCampoConductor('nombre', e.target.value)}
                />
              </label>

              <label className="campo">
                <span>Teléfono de contacto</span>
                <input
                  type="tel"
                  required
                  placeholder="Ej: 2647123456"
                  value={formConductor.telefono}
                  onChange={(e) => actualizarCampoConductor('telefono', e.target.value)}
                />
              </label>

              <div className="campo-fila">
                <label className="campo">
                  <span>Localidad base</span>
                  <select
                    required
                    value={formConductor.localidad}
                    onChange={(e) => actualizarCampoConductor('localidad', e.target.value)}
                  >
                    <option value="" disabled>Elegí tu localidad</option>
                    {LOCALIDADES.map((localidad) => (
                      <option value={localidad} key={localidad}>{localidad}</option>
                    ))}
                  </select>
                </label>
                <label className="campo">
                  <span>Tipo de servicio</span>
                  <select
                    value={formConductor.tipoServicio}
                    onChange={(e) => actualizarCampoConductor('tipoServicio', e.target.value)}
                  >
                    <option value="remis">Remis</option>
                    <option value="viaje_largo">Viaje largo</option>
                    <option value="flete">Flete</option>
                    <option value="moto">Moto</option>
                  </select>
                </label>
              </div>

              <div className="campo-fila">
                <label className="campo">
                  <span>Vehículo (opcional)</span>
                  <input
                    type="text"
                    placeholder="Ej: Fiat Siena"
                    value={formConductor.vehiculo}
                    onChange={(e) => actualizarCampoConductor('vehiculo', e.target.value)}
                  />
                </label>
                <label className="campo">
                  <span>Capacidad de pasajeros</span>
                  <input
                    type="number"
                    min={1}
                    value={formConductor.capacidad}
                    onChange={(e) => actualizarCampoConductor('capacidad', e.target.value)}
                  />
                </label>
              </div>

              <label className="campo">
                <span>Zonas que cubrís (separadas por coma)</span>
                <input
                  type="text"
                  placeholder="Ej: Rodeo, Las Flores, Villa Iglesia"
                  value={formConductor.zonas}
                  onChange={(e) => actualizarCampoConductor('zonas', e.target.value)}
                />
              </label>

              {errorFormConductor && <p className="mensaje-error">{errorFormConductor}</p>}

              <div className="modal-botones">
                <button type="button" className="btn btn-ghost" onClick={() => setModalConductorAbierto(false)}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-secundario" disabled={enviandoConductor}>
                  {enviandoConductor ? 'Inscribiendo...' : 'Inscribirme'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default App
