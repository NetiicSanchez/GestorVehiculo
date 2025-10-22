-- Tabla: incidente
-- Dependencias: vehiculo(id), usuario(id)

CREATE TABLE IF NOT EXISTS incidente (
	id SERIAL PRIMARY KEY,
	id_vehiculo INTEGER NOT NULL REFERENCES vehiculo(id) ON DELETE CASCADE,
	id_piloto INTEGER NOT NULL REFERENCES usuario(id) ON DELETE SET NULL,
	tipo_incidente TEXT NOT NULL,
	kilometraje INTEGER,
	detalle TEXT,
	fotos TEXT,
	tipo_aceite TEXT,
	tipo_mantenimiento TEXT,
	tipo_accesorio TEXT,
	urgencia TEXT CHECK (urgencia IN ('baja','media','alta')) DEFAULT 'media',
	correo_incidente TEXT,
	fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
);

-- Índices útiles
CREATE INDEX IF NOT EXISTS idx_incidente_vehiculo ON incidente(id_vehiculo);
CREATE INDEX IF NOT EXISTS idx_incidente_piloto ON incidente(id_piloto);
CREATE INDEX IF NOT EXISTS idx_incidente_tipo ON incidente(tipo_incidente);

-- Catálogo: tipo_accesorio
CREATE TABLE IF NOT EXISTS tipo_accesorio (
	id SERIAL PRIMARY KEY,
	nombre TEXT UNIQUE NOT NULL,
	activo BOOLEAN DEFAULT true
);


