
# 🏨 Sistema de Gestión Hotelera - Decameron

Proyecto desarrollado como prueba técnica Full Stack utilizando Laravel, React.js y PostgreSQL.

El sistema permite administrar hoteles, habitaciones y acomodaciones aplicando reglas de negocio específicas definidas por la compañía Decameron.

---

# 🚀 Tecnologías Utilizadas

## Backend
- PHP 8.2+
- Laravel 12
- PostgreSQL
- Laravel Sanctum
- Arquitectura REST API
- Principios SOLID

## Frontend
- React.js
- React Router DOM
- TailwindCSS
- Axios
- Hooks (useState, useEffect)

## Herramientas
- Git & GitHub
- pgAdmin
- Postman
- Visual Studio Code

---

# 📋 Funcionalidades Principales

## ✅ Autenticación
- Login seguro para administradores
- Protección de rutas
- Manejo de sesiones

## ✅ Dashboard Administrativo
- Total de hoteles registrados
- Total habitaciones configuradas
- Resumen general del sistema
- Accesos rápidos

## ✅ Gestión de Hoteles
- Crear hoteles
- Editar hoteles
- Eliminar hoteles
- Listado con paginación y filtros
- Validación de NIT único

## ✅ Configuración de Habitaciones
- Asignación de tipos de habitación
- Asignación de acomodaciones
- Control de capacidad máxima
- Validación de reglas de negocio

## ✅ Catálogos Maestros
- Departamentos
- Ciudades
- Tipos de habitación
- Acomodaciones

---

# 🏗️ Arquitectura de Base de Datos

Tablas principales:

- departamentos
- ciudades
- hoteles
- tipos_habitacion
- acomodaciones
- tipo_habitacion_acomodacion
- hotel_habitaciones

---

# 📌 Reglas de Negocio Implementadas

## Validación de Capacidad
La suma de habitaciones configuradas no puede superar el número máximo permitido del hotel.

## Combinaciones Únicas
No se permite repetir:

Tipo Habitación + Acomodación

para el mismo hotel.

## Validación de Acomodaciones

| Tipo Habitación | Acomodaciones Permitidas |
|-----------------|--------------------------|
| ESTANDAR        | SENCILLA, DOBLE          |
| JUNIOR          | TRIPLE, CUADRUPLE        |
| SUITE           | SENCILLA, DOBLE, TRIPLE  |

## NIT Único
No se permite registrar hoteles con el mismo NIT.

---

# ⚙️ Instalación del Proyecto

## 1️⃣ Clonar Repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

---

# 2️⃣ Backend Laravel

```bash
cd backend
composer install
cp .env.example .env
```

Configurar PostgreSQL en el archivo `.env`

```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=decameron_db
DB_USERNAME=postgres
DB_PASSWORD=123456789
```

Generar clave:

```bash
php artisan key:generate
```

Migraciones:

```bash
php artisan migrate --seed
```

Ejecutar servidor:

```bash
php artisan serve
```

---

# 3️⃣ Frontend React

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible en:

```bash
http://localhost:5173
```

---

# 🔗 Endpoints Principales

## Autenticación

| Método | Endpoint |
|---------|-----------|
| POST | /api/login |

## Hoteles

| Método | Endpoint |
|---------|-----------|
| GET | /api/hoteles |
| POST | /api/hoteles |
| PUT | /api/hoteles/{id} |
| DELETE | /api/hoteles/{id} |

---

# 📱 Diseño Responsive

Compatible con:
- Desktop
- Laptop
- Tablet

---

# 🧪 Pruebas Unitarias

```bash
php artisan test
```

---

# 🔄 Integración Continua

Integración continua mediante GitHub Actions.

---

# 🛠️ Solución de Problemas

Habilitar PostgreSQL en `php.ini`

```ini
extension=pgsql
extension=pdo_pgsql
```

---

# 👨‍💻 Autor

Desarrollado por:
Dilar Jose Pardo Burgos

Prueba Técnica Full Stack - Decameron
