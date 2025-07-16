-- ====================================================================
-- ESQUEMA GESTOR DE FLOTA - Similar a "Tu Flota" Simplificado
-- ====================================================================

-- Configuración inicial
CREATE DATABASE gestor_vehiculos;
\c gestor_vehiculos;

-- ====================================================================
-- 1. TABLAS DE CATÁLOGOS BASE
-- ====================================================================

-- Tipos de Vehículo
CREATE TABLE tipos_vehiculo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- Grupos de Vehículo  
CREATE TABLE grupos_vehiculo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- Estados de Vehículo
CREATE TABLE estados_vehiculo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    color VARCHAR(20) DEFAULT 'blue',
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- Tipos de Combustible
CREATE TABLE tipos_combustible (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    precio_referencial DECIMAL(6,2), -- Precio promedio por galón/litro
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- Roles de Usuarios (Operador, Administrador, etc.)
CREATE TABLE roles_usuario (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    permisos TEXT[], -- Array de permisos: ['CONDUCIR', 'CARGAR_COMBUSTIBLE', 'VER_REPORTES']
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- ====================================================================
-- 2. TABLA DE USUARIOS/EMPLEADOS
-- ====================================================================
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    cedula VARCHAR(20) UNIQUE,
    telefono VARCHAR(20),
    email VARCHAR(100),
    
    -- Información de conductor
    licencia_conducir VARCHAR(50),
    fecha_vencimiento_licencia DATE,
    
    -- Rol y estado
    id_rol INTEGER NOT NULL REFERENCES roles_usuario(id),
    activo BOOLEAN DEFAULT true,
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- ====================================================================
-- 3. TABLA PRINCIPAL - VEHÍCULOS
-- ====================================================================
CREATE TABLE vehiculos (
    id SERIAL PRIMARY KEY,
    placa VARCHAR(10) UNIQUE NOT NULL,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio INTEGER NOT NULL CHECK (anio >= 1950 AND anio <= EXTRACT(YEAR FROM NOW()) + 2),
    color VARCHAR(30),
    numero_serie VARCHAR(100),
    
    -- Referencias a catálogos
    id_tipo_vehiculo INTEGER NOT NULL REFERENCES tipos_vehiculo(id),
    id_grupo_vehiculo INTEGER NOT NULL REFERENCES grupos_vehiculo(id),
    id_estado_vehiculo INTEGER NOT NULL REFERENCES estados_vehiculo(id),
    id_tipo_combustible INTEGER NOT NULL REFERENCES tipos_combustible(id),
    
    -- Información técnica para dashboard
    kilometraje_inicial INTEGER DEFAULT 0,
    kilometraje_actual INTEGER DEFAULT 0,
    capacidad_tanque DECIMAL(5,2), -- Capacidad en galones/litros
    consumo_promedio DECIMAL(5,2), -- km/galón o km/litro
    
    -- Asignación actual
    id_usuario_asignado INTEGER REFERENCES usuarios(id), -- Operador actualmente asignado
    fecha_asignacion DATE,
    
    -- Metadata
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP DEFAULT NOW(),
    activo BOOLEAN DEFAULT true
);

-- ====================================================================
-- 4. TABLA DE CARGAS DE COMBUSTIBLE (Para Dashboard)
-- ====================================================================
CREATE TABLE cargas_combustible (
    id SERIAL PRIMARY KEY,
    id_vehiculo INTEGER NOT NULL REFERENCES vehiculos(id),
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id), -- Quien cargó
    
    -- Información de la carga
    fecha_carga TIMESTAMP DEFAULT NOW(),
    kilometraje_actual INTEGER NOT NULL,
    galones_cargados DECIMAL(8,2) NOT NULL,
    precio_galon DECIMAL(6,2) NOT NULL,
    total_pagado DECIMAL(10,2) NOT NULL,
    
    -- Cálculos automáticos para dashboard
    kilometros_recorridos INTEGER, -- Desde última carga
    rendimiento_calculado DECIMAL(6,2), -- km/galón
    
    -- Información adicional
    estacion_gasolina VARCHAR(100),
    numero_factura VARCHAR(50),
    observaciones TEXT,
    
    activo BOOLEAN DEFAULT true
);

-- ====================================================================
-- 5. TABLA DE ASIGNACIONES (Historial)
-- ====================================================================
CREATE TABLE asignaciones_vehiculo (
    id SERIAL PRIMARY KEY,
    id_vehiculo INTEGER NOT NULL REFERENCES vehiculos(id),
    id_usuario INTEGER NOT NULL REFERENCES usuarios(id),
    
    -- Fechas y kilometraje
    fecha_asignacion DATE NOT NULL,
    fecha_devolucion DATE,
    kilometraje_salida INTEGER,
    kilometraje_entrada INTEGER,
    
    -- Información del viaje
    destino VARCHAR(200),
    proposito TEXT,
    observaciones_salida TEXT,
    observaciones_entrada TEXT,
    
    -- Estado
    estado VARCHAR(20) DEFAULT 'ACTIVA', -- ACTIVA, DEVUELTO, CANCELADA
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

-- ====================================================================
-- 6. TABLA DE GASTOS ADICIONALES (Para Dashboard Completo)
-- ====================================================================
CREATE TABLE gastos_vehiculo (
    id SERIAL PRIMARY KEY,
    id_vehiculo INTEGER NOT NULL REFERENCES vehiculos(id),
    
    -- Información del gasto
    tipo_gasto VARCHAR(50) NOT NULL, -- 'MANTENIMIENTO', 'MULTA', 'SEGURO', 'REPARACION'
    fecha_gasto DATE NOT NULL,
    descripcion TEXT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    
    -- Información adicional
    proveedor VARCHAR(100),
    numero_factura VARCHAR(50),
    observaciones TEXT,
    
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    activo BOOLEAN DEFAULT true
);

-- ====================================================================
-- 7. ÍNDICES PARA RENDIMIENTO
-- ====================================================================
CREATE INDEX idx_vehiculos_placa ON vehiculos(placa);
CREATE INDEX idx_vehiculos_activo ON vehiculos(activo);
CREATE INDEX idx_vehiculos_usuario_asignado ON vehiculos(id_usuario_asignado);
CREATE INDEX idx_cargas_vehiculo ON cargas_combustible(id_vehiculo);
CREATE INDEX idx_cargas_fecha ON cargas_combustible(fecha_carga);
CREATE INDEX idx_asignaciones_vehiculo ON asignaciones_vehiculo(id_vehiculo);
CREATE INDEX idx_asignaciones_fecha ON asignaciones_vehiculo(fecha_asignacion);
CREATE INDEX idx_gastos_vehiculo ON gastos_vehiculo(id_vehiculo);
CREATE INDEX idx_gastos_fecha ON gastos_vehiculo(fecha_gasto);

-- ====================================================================
-- 8. DATOS INICIALES
-- ====================================================================

-- Roles de Usuario (SE CREARON MANULAMENTE)
INSERT INTO roles_usuario (nombre, descripcion, permisos) VALUES
('Administrador', 'Acceso completo al sistema', ARRAY['FULL_ACCESS', 'VER_REPORTES', 'GESTIONAR_USUARIOS']),
('Operador', 'Conductor de vehículos', ARRAY['CONDUCIR', 'CARGAR_COMBUSTIBLE', 'VER_ASIGNACIONES']),
('Supervisor', 'Supervisa operaciones', ARRAY['VER_REPORTES', 'ASIGNAR_VEHICULOS', 'VER_DASHBOARD']);

-- Tipos de Vehículo
INSERT INTO tipos_vehiculo (nombre, descripcion) VALUES
('Automóvil', 'Vehículo de uso personal'),
('Motocicleta', 'Vehículo de dos ruedas'),
('Camión', 'Vehículo de carga'),
('Van', 'Vehículo de transporte múltiple');

-- Grupos de Vehículo
INSERT INTO grupos_vehiculo (nombre, descripcion) VALUES
('Administrativo', 'Vehículos para uso administrativo'),
('Operativo', 'Vehículos para operaciones diarias'),
('Transporte', 'Vehículos de transporte'),
('Carga', 'Vehículos para transporte de mercancía');

-- Estados de Vehículo
INSERT INTO estados_vehiculo (nombre, descripcion, color) VALUES
('Disponible', 'Vehículo disponible para asignación', 'green'),
('Asignado', 'Vehículo asignado a operador', 'blue'),
('En Mantenimiento', 'Vehículo en reparación', 'orange'),
('Fuera de Servicio', 'Vehículo dado de baja', 'red');

-- Tipos de Combustible
INSERT INTO tipo_combustible (nombre, descripcion, ) VALUES
('Gasolina Regular', 'Combustible gasolina regular'),
('Gasolina Premium', 'Combustible gasolina premium'),
('Diésel', 'Combustible diésel');


-- ====================================================================
-- 9. VISTAS PARA DASHBOARD
-- ====================================================================

-- Vista resumen de vehículos con información completa
CREATE VIEW vista_vehiculos_dashboard AS
SELECT 
    v.id,
    v.placa,
    v.marca,
    v.modelo,
    v.anio,
    v.color,
    tv.nombre as tipo_vehiculo,
    gv.nombre as grupo_vehiculo,
    ev.nombre as estado_vehiculo,
    ev.color as color_estado,
    tc.nombre as tipo_combustible,
    v.kilometraje_actual,
    v.capacidad_tanque,
    v.consumo_promedio,
    
    -- Información del operador asignado
    CASE 
        WHEN v.id_usuario_asignado IS NOT NULL 
        THEN CONCAT(u.nombres, ' ', u.apellidos)
        ELSE 'Sin asignar'
    END as operador_asignado,
    v.fecha_asignacion,
    
    -- Última carga de combustible
    (SELECT fecha_carga FROM cargas_combustible cc 
     WHERE cc.id_vehiculo = v.id 
     ORDER BY cc.fecha_carga DESC LIMIT 1) as ultima_carga,
    
    -- Gasto total del mes actual en combustible
    COALESCE((SELECT SUM(total_pagado) 
              FROM cargas_combustible cc 
              WHERE cc.id_vehiculo = v.id 
              AND EXTRACT(MONTH FROM cc.fecha_carga) = EXTRACT(MONTH FROM CURRENT_DATE)
              AND EXTRACT(YEAR FROM cc.fecha_carga) = EXTRACT(YEAR FROM CURRENT_DATE)), 0) as gasto_combustible_mes,
    
    v.activo
FROM vehiculos v
JOIN tipos_vehiculo tv ON v.id_tipo_vehiculo = tv.id
JOIN grupos_vehiculo gv ON v.id_grupo_vehiculo = gv.id
JOIN estados_vehiculo ev ON v.id_estado_vehiculo = ev.id
JOIN tipos_combustible tc ON v.id_tipo_combustible = tc.id
LEFT JOIN usuarios u ON v.id_usuario_asignado = u.id
WHERE v.activo = true;

-- Vista de gastos por vehículo (para dashboard de costos)
CREATE VIEW vista_gastos_vehiculo AS
SELECT 
    v.id as vehiculo_id,
    v.placa,
    v.marca,
    v.modelo,
    
    -- Gastos del mes actual
    COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM cc.fecha_carga) = EXTRACT(MONTH FROM CURRENT_DATE) 
                      AND EXTRACT(YEAR FROM cc.fecha_carga) = EXTRACT(YEAR FROM CURRENT_DATE)
                      THEN cc.total_pagado ELSE 0 END), 0) as combustible_mes_actual,
    
    COALESCE(SUM(CASE WHEN EXTRACT(MONTH FROM gv.fecha_gasto) = EXTRACT(MONTH FROM CURRENT_DATE) 
                      AND EXTRACT(YEAR FROM gv.fecha_gasto) = EXTRACT(YEAR FROM CURRENT_DATE)
                      THEN gv.monto ELSE 0 END), 0) as otros_gastos_mes_actual,
    
    -- Gastos totales del año
    COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM cc.fecha_carga) = EXTRACT(YEAR FROM CURRENT_DATE)
                      THEN cc.total_pagado ELSE 0 END), 0) as combustible_anio_actual,
    
    COALESCE(SUM(CASE WHEN EXTRACT(YEAR FROM gv.fecha_gasto) = EXTRACT(YEAR FROM CURRENT_DATE)
                      THEN gv.monto ELSE 0 END), 0) as otros_gastos_anio_actual,
    
    -- Rendimiento promedio
    AVG(cc.rendimiento_calculado) as rendimiento_promedio,
    
    -- Última carga
    MAX(cc.fecha_carga) as ultima_carga
    
FROM vehiculos v
LEFT JOIN cargas_combustible cc ON v.id = cc.id_vehiculo AND cc.activo = true
LEFT JOIN gastos_vehiculo gv ON v.id = gv.id_vehiculo AND gv.activo = true
WHERE v.activo = true
GROUP BY v.id, v.placa, v.marca, v.modelo;

-- ====================================================================
-- 10. TRIGGERS PARA AUTOMATIZACIÓN
-- ====================================================================

-- Función para actualizar fecha_actualizacion
CREATE OR REPLACE FUNCTION actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Función para calcular rendimiento automáticamente
CREATE OR REPLACE FUNCTION calcular_rendimiento_combustible()
RETURNS TRIGGER AS $$
DECLARE
    ultima_carga RECORD;
BEGIN
    -- Buscar la carga anterior del mismo vehículo
    SELECT kilometraje_actual INTO ultima_carga
    FROM cargas_combustible 
    WHERE id_vehiculo = NEW.id_vehiculo 
    AND fecha_carga < NEW.fecha_carga
    ORDER BY fecha_carga DESC 
    LIMIT 1;
    
    -- Calcular kilómetros recorridos y rendimiento NO SE CREARA PORQUE LO ELIMINE EN LA BASE DE DATOS 
    IF ultima_carga IS NOT NULL THEN
        NEW.kilometros_recorridos = NEW.kilometraje_actual - ultima_carga.kilometraje_actual;
        IF NEW.galones_cargados > 0 THEN
            NEW.rendimiento_calculado = NEW.kilometros_recorridos / NEW.galones_cargados;
        END IF;
    END IF;
    
    -- Actualizar kilometraje actual del vehículo
    UPDATE vehiculos SET kilometraje_actual = NEW.kilometraje_actual WHERE id = NEW.id_vehiculo;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar triggers
CREATE TRIGGER tr_vehiculos_actualizar_fecha
    BEFORE UPDATE ON vehiculos
    FOR EACH ROW
    EXECUTE FUNCTION actualizar_fecha_modificacion();

CREATE TRIGGER tr_calcular_rendimiento
    BEFORE INSERT ON cargas_combustible
    FOR EACH ROW
    EXECUTE FUNCTION calcular_rendimiento_combustible();

-- ====================================================================
-- 11. DATOS DE PRUEBA
-- ====================================================================

-- Usuarios de ejemplo
INSERT INTO usuarios (nombres, apellidos, cedula, telefono, email, licencia_conducir, fecha_vencimiento_licencia, id_rol) VALUES
('Juan Carlos', 'Pérez López', '12345678901', '555-0001', 'juan.perez@empresa.com', 'LIC001', '2025-12-31', 2),
('María Elena', 'González Ruiz', '12345678902', '555-0002', 'maria.gonzalez@empresa.com', 'LIC002', '2024-08-15', 2),
('Roberto', 'Martínez Silva', '12345678903', '555-0003', 'roberto.martinez@empresa.com', NULL, NULL, 1);

-- Vehículos de ejemplo
INSERT INTO vehiculos (placa, marca, modelo, anio, color, numero_serie, id_tipo_vehiculo, id_grupo_vehiculo, id_estado_vehiculo, id_tipo_combustible, kilometraje_inicial, kilometraje_actual, capacidad_tanque, consumo_promedio, id_usuario_asignado, fecha_asignacion) VALUES
('ABC-123', 'Toyota', 'Corolla', 2020, 'Blanco', 'TOY123456789', 1, 1, 2, 1, 25000, 27500, 13.2, 18.5, 1, '2024-01-15'),
('DEF-456', 'Honda', 'Civic', 2019, 'Azul', 'HON987654321', 1, 2, 2, 1, 35000, 38200, 12.4, 19.2, 2, '2024-02-01'),
('GHI-789', 'Yamaha', 'XTZ-150', 2021, 'Rojo', 'YAM456789123', 2, 2, 1, 1, 8000, 12500, 3.5, 45.0, NULL, NULL);

-- Cargas de combustible de ejemplo
INSERT INTO cargas_combustible (id_vehiculo, id_usuario, fecha_carga, kilometraje_actual, galones_cargados, precio_galon, total_pagado, estacion_gasolina) VALUES
(1, 1, '2024-07-01 08:30:00', 27000, 10.5, 3.25, 34.13, 'Petrobras Centro'),
(1, 1, '2024-07-10 14:15:00', 27500, 8.2, 3.30, 27.06, 'Shell Norte'),
(2, 2, '2024-07-05 10:45:00', 37800, 11.0, 3.25, 35.75, 'Mobil Sur'),
(2, 2, '2024-07-12 16:20:00', 38200, 9.5, 3.35, 31.83, 'Texaco Este');

-- ====================================================================
-- COMENTARIOS FINALES
-- ====================================================================

-- Este esquema incluye las funcionalidades principales de "Tu Flota":
-- ✅ Gestión de vehículos y usuarios
-- ✅ Asignación de operadores a vehículos  
-- ✅ Registro de cargas de combustible
-- ✅ Dashboard de gastos por vehículo
-- ✅ Dashboard general de la flota
-- ✅ Cálculo automático de rendimiento
-- ✅ Historial de asignaciones
-- ✅ Control de gastos adicionales

-- Funcionalidades para implementar en Angular:
-- 1. Dashboard principal con gráficos de gastos
-- 2. Asignación/desasignación de operadores
-- 3. Registro de cargas de combustible
-- 4. Reportes de gastos por vehículo
-- 5. Reportes de rendimiento
-- 6. Gestión de usuarios/operadores
