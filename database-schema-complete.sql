-- Esquema completo de la base de datos para el Gestor de Vehículos

-- Crear base de datos
-- CREATE DATABASE gestor_vehiculos;

-- Tipos de vehículos
CREATE TABLE IF NOT EXISTS tipo_vehiculo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Grupos de vehículos
CREATE TABLE IF NOT EXISTS grupo_vehiculo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Estados de vehículos
CREATE TABLE IF NOT EXISTS estado_vehiculo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tipos de combustible
CREATE TABLE IF NOT EXISTS tipo_combustible (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    telefono VARCHAR(20),
    cargo VARCHAR(100),
    departamento VARCHAR(100),
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla principal de vehículos
CREATE TABLE IF NOT EXISTS vehiculo (
    id SERIAL PRIMARY KEY,
    placa VARCHAR(30) NOT NULL UNIQUE,  -- Aumentado de 20 a 30 caracteres
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio INTEGER NOT NULL,
    color VARCHAR(30) NOT NULL,
    numero_serie VARCHAR(50) NOT NULL,
    observaciones TEXT,
    foto_vehiculo VARCHAR(255),
    fecha_asignacion TIMESTAMP,
    id_usuario_asignado INTEGER,
    kilometraje_inicial INTEGER DEFAULT 0,
    kilometraje_actual INTEGER DEFAULT 0,
    id_tipo_vehiculo INTEGER NOT NULL,
    id_grupo_vehiculo INTEGER NOT NULL,
    id_estado_vehiculo INTEGER NOT NULL,
    id_tipo_combustible INTEGER NOT NULL,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_tipo_vehiculo) REFERENCES tipo_vehiculo(id),
    FOREIGN KEY (id_grupo_vehiculo) REFERENCES grupo_vehiculo(id),
    FOREIGN KEY (id_estado_vehiculo) REFERENCES estado_vehiculo(id),
    FOREIGN KEY (id_tipo_combustible) REFERENCES tipo_combustible(id),
    FOREIGN KEY (id_usuario_asignado) REFERENCES usuario(id)
);

-- Insertar datos básicos
INSERT INTO tipo_vehiculo (nombre, descripcion) VALUES 
('Automóvil', 'Vehículo de pasajeros'),
('Motocicleta', 'Vehículo de dos ruedas'),
('Camión', 'Vehículo de carga'),
('Autobús', 'Vehículo de transporte público')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO grupo_vehiculo (nombre, descripcion) VALUES 
('Liviano', 'Vehículos livianos'),
('Pesado', 'Vehículos pesados'),
('Comercial', 'Vehículos comerciales'),
('Particular', 'Vehículos particulares')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO estado_vehiculo (nombre, descripcion) VALUES 
('Activo', 'Vehículo en uso'),
('Inactivo', 'Vehículo fuera de servicio'),
('En Mantenimiento', 'Vehículo en reparación'),
('Vendido', 'Vehículo vendido')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO tipo_combustible (nombre, descripcion) VALUES 
('Gasolina', 'Combustible gasolina'),
('Diésel', 'Combustible diésel'),
('Eléctrico', 'Vehículo eléctrico'),
('Híbrido', 'Vehículo híbrido'),
('Gas Natural', 'Combustible gas natural')
ON CONFLICT (nombre) DO NOTHING;

-- Insertar usuarios de prueba
INSERT INTO usuario (nombre, apellido, email, telefono, cargo, departamento) VALUES 
('Juan', 'Pérez', 'juan.perez@empresa.com', '123-456-7890', 'Gerente', 'Administración'),
('María', 'González', 'maria.gonzalez@empresa.com', '123-456-7891', 'Conductor', 'Operaciones'),
('Carlos', 'Rodríguez', 'carlos.rodriguez@empresa.com', '123-456-7892', 'Supervisor', 'Mantenimiento'),
('Ana', 'Martínez', 'ana.martinez@empresa.com', '123-456-7893', 'Coordinadora', 'Logística'),
('Luis', 'López', 'luis.lopez@empresa.com', '123-456-7894', 'Mecánico', 'Mantenimiento')
ON CONFLICT (email) DO NOTHING;

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_vehiculo_placa ON vehiculo(placa);
CREATE INDEX IF NOT EXISTS idx_vehiculo_activo ON vehiculo(activo);
CREATE INDEX IF NOT EXISTS idx_vehiculo_estado ON vehiculo(id_estado_vehiculo);
