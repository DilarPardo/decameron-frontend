import React, { useState, useEffect } from 'react';
import clienteAxios from '../api/clienteAxios';

const Alojamientos = () => {
    const [asignaciones, setAsignaciones] = useState([]);
    const [hoteles, setHoteles] = useState([]);
    const [configuraciones, setConfiguraciones] = useState([]); 
    const [formData, setFormData] = useState({ hotel_id: '', room_type_accommodation_id: '', quantity: '' });

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [resA, resH, resC] = await Promise.all([
                clienteAxios.get('/hotel-rooms'),
                clienteAxios.get('/hotels'),
                clienteAxios.get('/room-rules') 
            ]);
            
            setAsignaciones(resA.data || []);
            setHoteles(resH.data || []);
            setConfiguraciones(resC.data || []);
        } catch (error) {
            console.error("Error al cargar datos:", error);
            alert("Error al conectar con el servidor. Revisa la consola.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await clienteAxios.post('/hotel-rooms', formData);
            setFormData({ hotel_id: '', room_type_accommodation_id: '', quantity: '' });
            cargarDatos();
            alert("Asignación guardada con éxito");
        } catch (error) {
            alert(error.response?.data?.message || "Error al asignar: Verifica la capacidad del hotel");
        }
    };

    const eliminar = async (id) => {
        if (!window.confirm("¿Desea eliminar esta asignación de inventario?")) return;
        try {
            await clienteAxios.delete(`/hotel-rooms/${id}`);
            cargarDatos();
        } catch (error) {
            alert("Error al eliminar");
        }
    };

    return (
        <div className="container-fluid p-4">
            <h2 className="text-white mb-4 font-weight-bold">GESTIÓN DE ALOJAMIENTOS (INVENTARIO)</h2>
            
            {/* Formulario de Asignación */}
            <div className="card p-4 mb-4 shadow-sm border-0" style={{borderRadius: '15px'}}>
                <form onSubmit={handleSubmit} className="row align-items-end">
                    <div className="col-md-4">
                        <label className="small font-weight-bold text-muted">1. Seleccionar Hotel</label>
                        <select className="form-control" value={formData.hotel_id} onChange={e => setFormData({...formData, hotel_id: e.target.value})} required>
                            <option value="">¿A qué hotel asignamos?</option>
                            {hoteles.map(h => (
                                <option key={h.id} value={h.id}>{h.name} (Máx: {h.num_rooms} hab.)</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="col-md-4">
                        <label className="small font-weight-bold text-muted">2. Tipo y Acomodación</label>
                        <select className="form-control" value={formData.room_type_accommodation_id} onChange={e => setFormData({...formData, room_type_accommodation_id: e.target.value})} required>
                            <option value="">Seleccione Configuración...</option>
                            {configuraciones.map(c => (
                                <option key={c.id} value={c.id}>
                                    {c.room_type?.name} - {c.accommodation?.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-2">
                        <label className="small font-weight-bold text-muted">3. Cantidad</label>
                        <input type="number" className="form-control" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} min="1" placeholder="0" required />
                    </div>

                    <div className="col-md-2">
                        <button type="submit" className="btn btn-primary btn-block shadow-sm">
                            <i className="fa fa-plus-circle mr-2"></i> Asignar
                        </button>
                    </div>
                </form>
            </div>

            <div className="table-responsive bg-white rounded shadow-sm">
                <table className="table table-hover mb-0">
                    <thead className="bg-dark text-white">
                        <tr>
                            <th>Hotel</th>
                            <th>Tipo de Habitación</th>
                            <th>Acomodación</th>
                            <th className="text-center">Cantidad</th>
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {asignaciones.length > 0 ? asignaciones.map(a => (
                            <tr key={a.id}>
                                <td className="font-weight-bold text-primary">{a.hotel?.name}</td>
                                <td>{a.room_type_accommodation?.room_type?.name || 'N/A'}</td>
                                <td>{a.room_type_accommodation?.accommodation?.name || 'N/A'}</td>
                                <td className="text-center">
                                    <span className="text-dark font-weight-600" style={{fontSize: '0.9rem'}}>
                                        {a.quantity}
                                    </span>
                                </td>
                                <td className="text-center">
                                    <button className="btn btn-sm btn-link text-danger" onClick={() => eliminar(a.id)}>
                                        <i className="fa fa-trash-alt"></i>
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="5" className="text-center py-5 text-muted">
                                    No hay registros de alojamiento creados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Alojamientos;