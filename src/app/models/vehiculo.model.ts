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
