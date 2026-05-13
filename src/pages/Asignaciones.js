import React, { useState, useEffect } from 'react';
import clienteAxios from '../api/clienteAxios';

const Asignaciones = () => {
    const [hoteles, setHoteles] = useState([]);
    const [tiposHabitacion, setTiposHabitacion] = useState([]);
    const [asignaciones, setAsignaciones] = useState([]);
    const [acomodacionesFiltradas, setAcomodacionesFiltradas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editandoId, setEditandoId] = useState(null);
    const [loading, setLoading] = useState(false);

    const [nuevaAsignacion, setNuevaAsignacion] = useState({
        hotel_id: '',
        room_type_id: '',
        accommodation_id: '',
        quantity: '',
        status: 'Activo' 
    });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        setLoading(true);
        try {
            const [resH, resT, resAsig] = await Promise.all([
                clienteAxios.get('/hotels'),
                clienteAxios.get('/room-types'),
                clienteAxios.get('/hotel-rooms') 
            ]);
            
            setHoteles(resH.data.data || resH.data);
            setTiposHabitacion(resT.data.data || resT.data);
            setAsignaciones(resAsig.data.data || resAsig.data);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    const manejarCambioTipo = async (typeId, initialAccommodationId = '') => {
        setNuevaAsignacion(prev => ({ ...prev, room_type_id: typeId, accommodation_id: initialAccommodationId }));
        if (!typeId) {
            setAcomodacionesFiltradas([]);
            return;
        }
        try {
            const res = await clienteAxios.get(`/room-types/${typeId}/accommodations`);
            setAcomodacionesFiltradas(res.data);
        } catch (error) {
            setAcomodacionesFiltradas([]);
        }
    };

    const abrirModalEditar = (asig) => {
        setEditandoId(asig.id);
        setNuevaAsignacion({
            hotel_id: asig.hotel_id,
            room_type_id: asig.room_type_accommodation.room_type_id,
            accommodation_id: asig.room_type_accommodation.accommodation_id,
            quantity: asig.quantity,
            status: asig.status || 'Activo'
        });
        manejarCambioTipo(asig.room_type_accommodation.room_type_id, asig.room_type_accommodation.accommodation_id);
        setShowModal(true);
    };

    const guardarAsignacion = async (e) => {
        e.preventDefault();
        
        const seleccion = acomodacionesFiltradas.find(
            item => item.accommodation_id === parseInt(nuevaAsignacion.accommodation_id)
        );

        if (!seleccion) {
            alert("Combinación de Tipo y Acomodación no válida.");
            return;
        }

        const payload = {
            hotel_id: parseInt(nuevaAsignacion.hotel_id),
            room_type_accommodation_id: seleccion.id,
            quantity: parseInt(nuevaAsignacion.quantity),
            status: nuevaAsignacion.status // Enviamos el estado a la BD
        };

        try {
            if (editandoId) {
                await clienteAxios.put(`/hotel-rooms/${editandoId}`, payload);
            } else {
                await clienteAxios.post('/hotel-rooms', payload);
            }
            cerrarModal();
            cargarDatos();
        } catch (error) {
            alert(error.response?.data?.error || error.response?.data?.message || "Error en la operación");
        }
    };

    const eliminarAsignacion = async (id) => {
        if (!window.confirm("¿Estás seguro de eliminar esta asignación?")) return;
        try {
            await clienteAxios.delete(`/hotel-rooms/${id}`);
            cargarDatos();
        } catch (error) {
            alert("No se pudo eliminar");
        }
    };

    const cerrarModal = () => {
        setShowModal(false);
        setEditandoId(null);
        setNuevaAsignacion({ hotel_id: '', room_type_id: '', accommodation_id: '', quantity: '', status: 'Activo' });
        setAcomodacionesFiltradas([]);
    };

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow border-0">
                <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
                    <h3 className="mb-0 text-primary font-weight-bold">Distribución de Inventario</h3>
                    <button className="btn btn-primary btn-round shadow-sm" onClick={() => setShowModal(true)}>
                        <i className="fa fa-plus-circle mr-2"></i> Nueva Asignación
                    </button>
                </div>
                
                <div className="table-responsive">
                    <table className="table align-items-center table-flush">
                        <thead className="thead-light">
                            <tr>
                                <th>Hotel</th>
                                <th>Configuración</th>
                                <th>Cantidad</th>
                                <th>Estado</th>
                                <th className="text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {asignaciones.length > 0 ? (
                                asignaciones.map(asig => (
                                    <tr key={asig.id}>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <i className="fa fa-hotel mr-3 text-muted"></i>
                                                <strong>{asig.hotel?.name}</strong>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-dark font-weight-600">
                                                {asig.room_type_accommodation?.room_type?.name}
                                            </span>
                                            <br />
                                            <small className="text-muted">
                                                {asig.room_type_accommodation?.accommodation?.name}
                                            </small>
                                        </td>
                                        <td>
                                            <span className="text-dark font-weight-600" style={{fontSize: '0.85rem'}}>
                                                {asig.quantity} Habitaciones
                                            </span>
                                        </td>
                                        <td>
                                            <span className="badge badge-dot mr-4">
                                                <i className={asig.status === 'Inactivo' ? 'bg-danger' : 'bg-success'} 
                                                   style={{width: '9px', height: '9px', display: 'inline-block', borderRadius: '50%', marginRight: '5px'}}></i> 
                                                <span className={asig.status === 'Inactivo' ? 'text-danger' : 'text-success'} style={{fontWeight: '600'}}>
                                                    {asig.status || 'Activo'}
                                                </span>
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <button className="btn btn-sm btn-outline-info mr-2" onClick={() => abrirModalEditar(asig)}>
                                                <i className="fa fa-edit"></i>
                                            </button>
                                            <button className="btn btn-sm btn-outline-danger" onClick={() => eliminarAsignacion(asig.id)}>
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan="5" className="text-center py-5 text-muted">No hay asignaciones registradas.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-custom-overlay" style={{position:'fixed', top:0, left:0, width:'100%', height:'100%', background:'rgba(0,0,0,0.5)', zIndex:1050, display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <div className="modal-content p-4 shadow" style={{maxWidth: '500px', width: '95%', background:'#fff', borderRadius:'15px', border:'none'}}>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h5 className="mb-0 font-weight-bold">{editandoId ? '🔧 Editar Asignación' : '✨ Nueva Configuración'}</h5>
                            <button onClick={cerrarModal} className="close" style={{border:'none', background:'none', fontSize:'1.8rem', color:'#999'}}>&times;</button>
                        </div>
                        <form onSubmit={guardarAsignacion}>
                            <div className="form-group mb-3">
                                <label className="small font-weight-bold text-uppercase">Hotel</label>
                                <select className="form-control" required value={nuevaAsignacion.hotel_id} onChange={e => setNuevaAsignacion({...nuevaAsignacion, hotel_id: e.target.value})}>
                                    <option value="">Seleccione un hotel...</option>
                                    {hoteles.map(h => <option key={h.id} value={h.id}>{h.name}</option>)}
                                </select>
                            </div>
                            <div className="row mb-3">
                                <div className="col-6">
                                    <label className="small font-weight-bold text-uppercase">Tipo</label>
                                    <select className="form-control" required value={nuevaAsignacion.room_type_id} onChange={e => manejarCambioTipo(e.target.value)}>
                                        <option value="">Tipo...</option>
                                        {tiposHabitacion.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className="small font-weight-bold text-uppercase">Acomodación</label>
                                    <select className="form-control" required disabled={acomodacionesFiltradas.length === 0} value={nuevaAsignacion.accommodation_id} onChange={e => setNuevaAsignacion({...nuevaAsignacion, accommodation_id: e.target.value})}>
                                        <option value="">Elegir...</option>
                                        {acomodacionesFiltradas.map(reg => <option key={reg.id} value={reg.accommodation_id}>{reg.accommodation?.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            <div className="row mb-4">
                                <div className="col-6">
                                    <label className="small font-weight-bold text-uppercase">Cantidad</label>
                                    <input type="number" className="form-control" required min="1" value={nuevaAsignacion.quantity} onChange={e => setNuevaAsignacion({...nuevaAsignacion, quantity: e.target.value})} placeholder="Ej: 10" />
                                </div>
                                <div className="col-6">
                                    <label className="small font-weight-bold text-uppercase">Estado</label>
                                    <select className="form-control" value={nuevaAsignacion.status} onChange={e => setNuevaAsignacion({...nuevaAsignacion, status: e.target.value})}>
                                        <option value="Activo">Activo</option>
                                        <option value="Inactivo">Inactivo</option>
                                    </select>
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-block shadow py-2 font-weight-bold">
                                {editandoId ? 'ACTUALIZAR REGISTRO' : 'GUARDAR ASIGNACIÓN'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Asignaciones;