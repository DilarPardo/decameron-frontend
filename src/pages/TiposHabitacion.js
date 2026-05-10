import React, { useState, useEffect } from 'react';
import clienteAxios from '../api/clienteAxios';

const Tipos = () => {
    const [tipos, setTipos] = useState([]);
    const [acomodaciones, setAcomodaciones] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
    const [idAcomodacion, setIdAcomodacion] = useState('');

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [resT, resA] = await Promise.all([
                clienteAxios.get('/room-types'), 
                clienteAxios.get('/accommodations')
            ]);
            setTipos(resT.data);
            setAcomodaciones(resA.data);
        } catch (error) {
            console.error("Error al cargar datos");
        }
    };

    const guardarVinculo = async (e) => {
        e.preventDefault();
        try {
            await clienteAxios.post(`/room-types/${tipoSeleccionado.id}/accommodations`, { 
                accommodation_id: idAcomodacion 
            });
            setShowModal(false);
            setIdAcomodacion('');
            await cargarDatos(); 
        } catch (error) {
            alert(error.response?.data?.message || "Error al vincular");
        }
    };

    const eliminarVinculo = async (tipoId, accId) => {
        if (!window.confirm("¿Quitar esta acomodación de la lista permitida?")) return;
        try {
            await clienteAxios.delete(`/room-types/${tipoId}/accommodations/${accId}`);
            await cargarDatos(); 
        } catch (error) {
            alert("No se pudo eliminar el vínculo");
        }
    };

    return (
        <div className="container-fluid p-4">
            <h2 className="text-white mb-4 font-weight-bold">CONFIGURACIÓN: TIPOS Y ACOMODACIONES</h2>
            <div className="row">
                {tipos.map(tipo => (
                    <div className="col-md-4" key={tipo.id}>
                        <div className="card shadow-sm border-0 p-3 mb-4" style={{borderRadius: '15px'}}>
                            <h4 className="text-primary font-weight-bold border-bottom pb-2">{tipo.name}</h4>
                            <p className="small font-weight-bold text-muted mt-2">ACOMODACIONES PERMITIDAS:</p>
                            <ul className="list-unstyled">
                                {tipo.accommodations?.length > 0 ? tipo.accommodations.map(acc => (
                                    <li key={acc.id} className="d-flex justify-content-between align-items-center mb-2 bg-light p-2 rounded">
                                        <span className="font-weight-bold text-dark">{acc.name}</span>
                                        <button className="btn btn-sm btn-link text-danger" onClick={() => eliminarVinculo(tipo.id, acc.id)}>
                                            <i className="fa fa-times"></i>
                                        </button>
                                    </li>
                                )) : <li className="text-muted small italic">No hay configuraciones</li>}
                            </ul>
                            <button 
                                className="btn btn-primary btn-sm btn-block mt-3" 
                                onClick={() => { setTipoSeleccionado(tipo); setShowModal(true); }}
                                style={{borderRadius: '10px'}}
                            >
                                <i className="fa fa-plus-circle mr-2"></i> Vincular Acomodación
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-custom-overlay" style={styles.overlay}>
                    <div className="bg-white p-4 rounded shadow-lg" style={styles.modal}>
                        <h5 className="font-weight-bold mb-3">Vincular a {tipoSeleccionado?.name}</h5>
                        <form onSubmit={guardarVinculo}>
                            <label className="small font-weight-bold text-muted">Seleccione Acomodación:</label>
                            <select className="form-control mb-4" value={idAcomodacion} onChange={e => setIdAcomodacion(e.target.value)} required>
                                <option value="">Elija una opción...</option>
                                {acomodaciones.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                            <div className="d-flex justify-content-end">
                                <button type="button" className="btn btn-light mr-2" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary px-4">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles = {
    overlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    modal: { width: '400px', border: 'none' }
};

export default Tipos;