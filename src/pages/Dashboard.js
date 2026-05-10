import React, { useState, useEffect } from 'react';
import clienteAxios from '../api/clienteAxios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';


const Dashboard = () => {
    const [stats, setStats] = useState({
        total_hotels: 0,
        total_room_types: 0,
        total_accommodations: 0,
        total_assignments: 0,
        chart_data: []
    });

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        try {
            const res = await clienteAxios.get('/dashboard-stats');
            setStats(res.data);
        } catch (error) {
            console.error("Error al cargar datos del dashboard");
        }
    };

    const COLORS = ['#007bff', '#28a745', '#ffc107', '#17a2b8', '#6610f2'];

    return (
        <div className="container-fluid p-4">
            <h2 className="text-white mb-4 font-weight-bold">PANEL ADMINISTRATIVO</h2>
    
            <div className="row d-flex align-items-stretch">
                {[
                    { label: 'Hoteles', val: stats.total_hotels, color: 'bg-primary', icon: 'fa-hotel' },
                    { label: 'Tipos de Configuración', val: stats.total_room_types, color: 'bg-success', icon: 'fa-bed' },
                    { label: 'Acomodaciones', val: stats.total_accommodations, color: 'bg-warning', icon: 'fa-users' },
                    { label: 'Hab. Asignadas', val: stats.total_assignments, color: 'bg-info', icon: 'fa-clipboard-check' }
                ].map((item, idx) => (
                    <div className="col-md-3 mb-4" key={idx}>
                        <div className={`card ${item.color} text-white h-100 border-0 shadow-sm`} style={{ borderRadius: '15px' }}>
                            <div className="card-body d-flex flex-column justify-content-center py-4">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <p className="text-uppercase small mb-1 font-weight-bold">{item.label}</p>
                                        <h2 className="mb-0 font-weight-bold" style={{ fontSize: '2.5rem' }}>{item.val}</h2>
                                    </div>
                                    <i className={`fa ${item.icon} fa-3x opacity-50`}></i>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row mt-3">
                <div className="col-md-7 mb-4">
                    <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '15px' }}>
                        <h5 className="font-weight-bold mb-4 text-dark">Distribución de Habitaciones por Hotel</h5>
                        <div style={{ width: '100%', height: 300 }}>
                            <ResponsiveContainer>
                                <BarChart data={stats.chart_data}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" fontSize={12} />
                                    <YAxis fontSize={12} />
                                    <Tooltip />
                                    <Bar dataKey="asignadas" radius={[5, 5, 0, 0]}>
                                        {stats.chart_data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="col-md-5 mb-4">
                    <div className="card border-0 shadow-sm p-4 h-100 text-center d-flex flex-column justify-content-center" style={{ borderRadius: '15px' }}>                       
                        <h4 className="font-weight-bold">Sistema de Inventario</h4>
                        <p className="text-muted small">Supervisión en tiempo real de la capacidad instalada y configuraciones activas del grupo hotelero.</p>
                        <div className="mt-2">
                            <span className="badge badge-light border text-muted px-3 py-2">Versión 1.0.0 - Prueba Técnica</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;