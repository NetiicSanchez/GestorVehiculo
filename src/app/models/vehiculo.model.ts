export interface Vehiculo {
  id?: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  color?: string;
  numeroSerie?: string;
  idTipoVehiculo: number;
  idGrupoVehiculo: number;
  idEstadoVehiculo: number;
  idTipoCombustible: number;
  kilometrajeInicial?: number;
  fotoVehiculo?: string[];
  fechaCreacion?: Date;
  fechaActualizacion?: Date;
  activo?: boolean;
}

export interface TipoVehiculo {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fechaCreacion?: Date;
}

export interface GrupoVehiculo {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fechaCreacion?: Date;
}

export interface EstadoVehiculo {
  id: number;
  nombre: string;
  descripcion?: string;
  color?: string;
  activo: boolean;
  fechaCreacion?: Date;
}

export interface TipoCombustible {
  id: number;
  nombre: string;
  descripcion?: string;
  activo: boolean;
  fechaCreacion?: Date;
}

export interface CargaCombustible {
  id?: number;
  idVehiculo: number;
  idUsuario?: number;
  idTipoCombustible?: number;
  fechaCarga: Date;
  kilometrajeActual: number;
  galonesCargados: number;
  precioGalon: number;
  totalPagado: number;
  proveedorCombustible?: string;
  numeroFactura?: string;
  observaciones?: string;
  fotoFactura?: string;
  activo?: boolean;
  fechaCreacion?: Date;
  fechaRegistro?: Date;
  
  // Campos para mostrar información relacionada
  placa?: string;
  marca?: string;
  modelo?: string;
  tipoCombustible?: string;
}
