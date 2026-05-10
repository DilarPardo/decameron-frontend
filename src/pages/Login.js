import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clienteAxios from '../api/clienteAxios';
import logoDecameron from '../assets/img/brand/logo-decameron.png';
import './Login.css';

const Login = () => {
    const [credenciales, setCredenciales] = useState({ 
        email: 'admin@gmail.com', 
        password: 'Admin123' 
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredenciales({ ...credenciales, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const respuesta = await clienteAxios.post('/login', credenciales);
            
            const token = respuesta.data.token || respuesta.data.access_token || respuesta.data.data?.token;
            const usuario = respuesta.data.user || respuesta.data.data?.user;
            
            if (token && usuario) {

                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(usuario));
          
                Promise.resolve().then(() => {
                    navigate('/admin/dashboard', { replace: true });
                });
            } else {
                console.error('Estructura de respuesta de API inesperada:', respuesta.data);
                setError('Error interno del servidor. Por favor, contacte a soporte.');
            }
        } catch (err) {
            if (!err.response) {
                setError('No se pudo conectar con el servidor. Verifique que el backend esté ejecutándose.');
            } else if (err.response.status === 422) {
                const mensajes = err.response.data.errors;
                const primerError = mensajes ? Object.values(mensajes)[0][0] : 'Datos inválidos.';
                setError(primerError);
            } else {
                setError('Credenciales inválidas. Por favor, intente de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    const UserIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="input-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );

    const LockIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="input-icon-svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
    );

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-sidebar">
                    <div className="sidebar-overlay">
                        <img src={logoDecameron} alt="Logo Decamerón" className="sidebar-logo" />
                        <div className="sidebar-content">
                            <h1 className="welcome-title">Bienvenido al Panel</h1>
                            <p className="welcome-subtitle">Gestiona hoteles y habitaciones.</p>
                        </div>
                    </div>
                </div>

                <div className="login-main">
                    <div className="form-container">
                        <div className="form-header">
                            <span className="icon-paz" role="img" aria-label="palmera">🌴</span>
                            <h2 className="form-title">Iniciar sesión</h2>
                        </div>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                <strong>Error:</strong> {error}
                            </div>
                        )}

                        <form className="login-form" onSubmit={handleSubmit}>

                            <div className="input-group-custom">
                                <label className="input-label" htmlFor="email">Correo electrónico</label>
                                <div className="input-with-icon-wrapper">

                                    <div className="input-icon-container">
                                        <UserIcon />
                                    </div>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        id="email"
                                        className="form-input input-padded" 
                                        value={credenciales.email} 
                                        onChange={handleChange} 
                                        required 
                                        placeholder="ejemplo@decameron.com"
                                    />
                                </div>
                            </div>

                            <div className="input-group-custom">
                                <label className="input-label" htmlFor="password">Contraseña</label>
                                <div className="input-with-icon-wrapper">
 
                                    <div className="input-icon-container">
                                        <LockIcon />
                                    </div>
                                    <input 
                                        type="password" 
                                        name="password" 
                                        id="password"
                                        className="form-input input-padded" 
                                        value={credenciales.password}
                                        onChange={handleChange} 
                                        required 
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="submit-button" disabled={loading}>
                                {loading ? (
                                    <span className="loading-spinner">Cargando...</span>
                                ) : (
                                    'Entrar al sistema'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;