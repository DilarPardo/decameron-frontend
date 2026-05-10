import React, { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate, Navigate } from "react-router-dom";
import logoDecameron from "../../assets/img/brand/logo-decameron.png"; 
import "./AdminLayout.css";

const AdminLayout = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token || !loggedUser) {
      localStorage.clear();
      navigate("/login", { replace: true }); 
    } else {
      try {
        setUser(JSON.parse(loggedUser)); 
      } catch (e) {
        handleLogout();
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("hoteles")) return "Gestión de Hoteles";
    if (path.includes("asignaciones")) return "Habitaciones";
    if (path.includes("tipos")) return "Tipos de Habitación";
    if (path.includes("acomodaciones")) return "Acomodaciones";
    return "Panel Administrativo";
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  if (!localStorage.getItem("token")) return <Navigate to="/login" />;

  return (
    <div className="admin-wrapper">
      
      {/* Botón para Móviles */}
      <button className="hamburger-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        <i className={`fa ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      {/* BARRA LATERAL (SIDEBAR) */}
      <aside className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <img src={logoDecameron} alt="Logo" />
        </div>
        
        <nav className="nav-menu">
          <span className="nav-category">Principal</span>
          <NavLink to="/admin/dashboard" className="nav-item" onClick={closeMobileMenu}>
            <i className="fa fa-tv"></i> <span>Dashboard</span>
          </NavLink>
          
          <span className="nav-category">Operaciones</span>
          <NavLink to="/admin/hoteles" className="nav-item" onClick={closeMobileMenu}>
            <i className="fa fa-hotel"></i> <span>Hoteles</span>
          </NavLink>
          <NavLink to="/admin/asignaciones" className="nav-item" onClick={closeMobileMenu}>
            <i className="fa fa-key"></i> <span>Asignaciones</span>
          </NavLink>

          <span className="nav-category">Configuración</span>
          <NavLink to="/admin/tipos" className="nav-item" onClick={closeMobileMenu}>
            <i className="fa fa-tags"></i> <span>Tipos</span>
          </NavLink>
          <NavLink to="/admin/Alojamientos" className="nav-item" onClick={closeMobileMenu}>
            <i className="fa fa-bed"></i> <span>Acomodaciones</span>
          </NavLink>
        </nav>
      </aside>

      {/* CAPA OSCURA MÓVIL */}
      {isMobileMenuOpen && <div className="mobile-overlay" onClick={closeMobileMenu}></div>}

      {/* CONTENIDO PRINCIPAL */}
      <div className="main-panel">
        
        {/* HEADER AZUL CON GRADIENTE */}
        <header className="blue-header">
          <div className="top-bar">
            <h2 className="title">{getPageTitle()}</h2>
            
            {/* BADGE DE USUARIO (EL ÓVALO) */}
            <div className="user-profile">
              <div className="profile-pill" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                <img src={`https://ui-avatars.com/api/?name=${user?.name || 'A'}&background=5e72e4&color=fff`} alt="avatar" />
                <span className="username">{user?.name || "Admin"}</span>
                <i className={`fa fa-chevron-down ${isUserMenuOpen ? 'up' : ''}`}></i>
              </div>
              
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-info">{user?.email}</div>
                  <div className="divider"></div>
                  <button className="logout-link" onClick={handleLogout}>
                    <i className="fa fa-power-off"></i> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* CONTENEDOR DE LA TARJETA BLANCA */}
        <div className="page-container">
          <div className="main-card">
            <Outlet context={{ user }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;