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
    private apiUrl = '/api/dashboard';

    constructor(private http: HttpClient) { }

    /**
     * Calcula el total de galones del mes actual a partir de los datos recibidos
     * @param data Array de gastos mensuales por vehículo
     * @param mesActualYM Mes actual en formato YYYY-MM (ej: '2025-09')
     */
    getTotalGalonesMes(data: any[], mesActualYM: string): number {
      let totalGalones = 0;
      data.forEach(item => {
        // Filtrar por mes en formato YYYY-MM
        if (item.mes === mesActualYM) {
          const gal = Number(item.total_galones);
          totalGalones += isNaN(gal) ? 0 : gal;
        }
      });
      return totalGalones;
    }

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

    /**
     * Obtener gastos mensuales por vehículo
     */
    getGastosMensuales(): Observable<any> {
      return this.http.get(`${this.apiUrl}/gastos-mensuales`);
    }

    /**
     * Obtener total de galones usados por mes (todos los vehículos)
     */
    getTotalGalonesPorMes(): Observable<any> {
      return this.http.get<any>('/api/total-galones-mes');
    }
  }
