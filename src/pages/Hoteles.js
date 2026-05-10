import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../api/clienteAxios';

const Hoteles = () => {
    const [hoteles, setHoteles] = useState([]);
    const [departamentos, setDepartamentos] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState(false);
    const [hotelId, setHotelId] = useState(null);
    const [selectedDepto, setSelectedDepto] = useState('');
    
    const [nuevoHotel, setNuevoHotel] = useState({ 
        name: '', address: '', city_id: '', nit: '', max_rooms: '' 
    });

    const navigate = useNavigate();

    // Estilos para el Modal (Reemplazan a Hoteles.css)
    const modalStyles = {
        overlay: {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1050
        },
        content: {
            backgroundColor: 'white',
            padding: '0',
            borderRadius: '10px',
            width: '90%',
            maxWidth: '550px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
            overflow: 'hidden'
        },
        header: {
            padding: '15px 20px',
            borderBottom: '1px solid #dee2e6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8f9fa'
        }
    };

    useEffect(() => {
        cargarInformacion();
    }, []);

    const cargarInformacion = async () => {
        try {
            const [resHoteles, resStates] = await Promise.all([
                clienteAxios.get('/hotels'),
                clienteAxios.get('/states')
            ]);
            setHoteles(resHoteles.data.data || resHoteles.data);
            setDepartamentos(resStates.data.data || resStates.data);
        } catch (error) {
            console.error("Error al cargar información:", error);
            if (error.response?.status === 401) navigate('/login');
        }
    };

    const handleDeptoChange = async (e) => {
        const id = e.target.value;
        setSelectedDepto(id);
        setCiudades([]);
        setNuevoHotel({...nuevoHotel, city_id: ''}); 
        
        if (!id) return;
        try {
            const res = await clienteAxios.get(`/states/${id}/cities`);
            setCiudades(res.data.data || res.data);
        } catch (error) {
            console.error("Error cargando ciudades:", error);
        }
    };

    const prepararEdicion = async (hotel) => {
        setEditando(true);
        setHotelId(hotel.id);
        
        if (hotel.city?.state_id) {
            setSelectedDepto(hotel.city.state_id);
            try {
                const res = await clienteAxios.get(`/states/${hotel.city.state_id}/cities`);
                setCiudades(res.data.data || res.data);
            } catch (error) {
                console.error("Error al precargar ciudades:", error);
            }
        }

        setNuevoHotel({
            name: hotel.name,
            nit: hotel.nit,
            address: hotel.address,
            city_id: hotel.city_id,
            max_rooms: hotel.max_rooms
        });
        
        setShowModal(true);
    };

    const guardarHotel = async (e) => {
        e.preventDefault();
        try {
            if (editando) {
                await clienteAxios.put(`/hotels/${hotelId}`, nuevoHotel);
                alert("¡Hotel actualizado con éxito!");
            } else {
                await clienteAxios.post('/hotels', nuevoHotel);
                alert("¡Hotel registrado con éxito!");
            }
            cerrarModal();
            await cargarInformacion();
        } catch (error) {
            if (error.response?.data?.errors) {
                const errores = Object.values(error.response.data.errors).flat().join('\n');
                alert(`Errores de validación:\n${errores}`);
            } else {
                alert(error.response?.data?.message || "No se pudo procesar la solicitud.");
            }
        }
    };

    const eliminarHotel = async (id) => {
        if (window.confirm("¿Estás seguro de eliminar este hotel definitivamente?")) {
            try {
                await clienteAxios.delete(`/hotels/${id}`);
                await cargarInformacion();
                alert("Hotel eliminado correctamente.");
            } catch (error) {
                alert("No se pudo eliminar el hotel. Verifique dependencias.");
            }
        }
    };

    const cerrarModal = () => {
        setShowModal(false);
        setEditando(false);
        setHotelId(null);
        setSelectedDepto('');
        setCiudades([]);
        setNuevoHotel({ name: '', address: '', city_id: '', nit: '', max_rooms: '' });
    };

    return (
        <div className="container-fluid mt-4">
            <div className="card shadow border-0">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                    <h3 className="mb-0">Gestión de Hoteles</h3>
                    <button className="btn btn-primary font-weight-bold" onClick={() => setShowModal(true)}>
                        <i className="fa fa-plus mr-2"></i> Nuevo Hotel
                    </button>
                </div>
                <div className="table-responsive">
                    <table className="table align-items-center table-flush">
                        <thead className="thead-light">
                            <tr>
                                <th>Nombre</th>
                                <th>NIT</th>
                                <th>Ubicación</th>
                                <th>Habitaciones Máx.</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hoteles.map(h => (
                                <tr key={h.id}>
                                    <td className="font-weight-bold">{h.name}</td>
                                    <td>{h.nit}</td>
                                    <td>{h.city?.name} ({h.city?.state?.name})</td>
                                    <td>{h.max_rooms}</td>
                                    <td>
                                        <button className="btn btn-sm btn-info mr-2" onClick={() => prepararEdicion(h)}>
                                            <i className="fa fa-edit"></i>
                                        </button>
                                        <button className="btn btn-sm btn-danger" onClick={() => eliminarHotel(h.id)}>
                                            <i className="fa fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div style={modalStyles.overlay}>
                    <div style={modalStyles.content}>
                        <div style={modalStyles.header}>
                            <h4 className="mb-0 font-weight-bold">{editando ? 'Editar Hotel' : 'Registrar Nuevo Hotel'}</h4>
                            <button onClick={cerrarModal} className="btn border-0 h4 mb-0">&times;</button>
                        </div>
                        <form onSubmit={guardarHotel} className="p-4">
                            <label className="small font-weight-bold text-muted text-uppercase">Nombre del Hotel</label>
                            <input className="form-control mb-3" value={nuevoHotel.name} onChange={e => setNuevoHotel({...nuevoHotel, name: e.target.value})} required />
                            
                            <label className="small font-weight-bold text-muted text-uppercase">NIT</label>
                            <input 
                                className="form-control mb-3" 
                                value={nuevoHotel.nit} 
                                onChange={e => setNuevoHotel({...nuevoHotel, nit: e.target.value})} 
                                required 
                                readOnly={editando}
                                style={editando ? {backgroundColor: '#f8f9fa'} : {}}
                            />
                            
                            <div className="row">
                                <div className="col-6">
                                    <label className="small font-weight-bold text-muted text-uppercase">Departamento</label>
                                    <select className="form-control mb-3" value={selectedDepto} onChange={handleDeptoChange} required>
                                        <option value="">Seleccione...</option>
                                        {departamentos.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label className="small font-weight-bold text-muted text-uppercase">Ciudad</label>
                                    <select className="form-control mb-3" value={nuevoHotel.city_id} onChange={e => setNuevoHotel({...nuevoHotel, city_id: e.target.value})} required>
                                        <option value="">Seleccione...</option>
                                        {ciudades.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            
                            <label className="small font-weight-bold text-muted text-uppercase">Dirección</label>
                            <input className="form-control mb-3" value={nuevoHotel.address} onChange={e => setNuevoHotel({...nuevoHotel, address: e.target.value})} required />
                            
                            <label className="small font-weight-bold text-muted text-uppercase">Capacidad Total (Habitaciones)</label>
                            <input className="form-control mb-4" type="number" value={nuevoHotel.max_rooms} onChange={e => setNuevoHotel({...nuevoHotel, max_rooms: e.target.value})} required min="1" />
                            
                            <button type="submit" className={`btn ${editando ? 'btn-warning' : 'btn-success'} btn-block font-weight-bold p-2`}>
                                {editando ? 'GUARDAR CAMBIOS' : 'REGISTRAR HOTEL'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Hoteles;