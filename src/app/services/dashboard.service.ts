import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GastoVehiculo {
  vehiculo_id: number;
  placa: string;
  marca: string;
  modelo: string;
  combustible_mes_actual: string;
  otros_gastos_mes_actual: string;
  combustible_anio_actual: string;
  otros_gastos_anio_actual: string;
  ultima_carga?: string;
}

export interface VehiculoDashboard {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  tipo_vehiculo: string;
  grupo_vehiculo: string;
  estado_vehiculo: string;
  colo_estado: string;
  tipo_combustible: string;
  kilometraje_actual: number;
  operador_asignado?: string;
  fecha_asignacion?: string;
  ultima_carga?: string;
  gasto_combustible_mes: string;
  activo: boolean;
}

export interface ResumenDashboard {
  totales: {
    vehiculos: number;
    combustibleMesActual: number;
    otrosGastosMesActual: number;
    gastoTotalMesActual: number;
    combustibleAnioActual: number;
    otrosGastosAnioActual: number;
    gastoTotalAnioActual: number;
  };
  vehiculosPorEstado: { [estado: string]: number };
  gastosDetalle: GastoVehiculo[];
  vehiculosDetalle: VehiculoDashboard[];
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = 'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) { }

  /**
   * Obtener gastos por vehículo desde la vista de la base de datos
   */
  obtenerGastosVehiculos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/gastos-vehiculos`);
  }

  /**
   * Obtener datos del dashboard de vehículos desde la vista de la base de datos
   */
  obtenerDashboardVehiculos(): Observable<any> {
    return this.http.get(`${this.apiUrl}/vehiculos`);
  }

  /**
   * Obtener resumen consolidado del dashboard
   */
  obtenerResumenDashboard(): Observable<any> {
    return this.http.get(`${this.apiUrl}/resumen`);
  }
}
