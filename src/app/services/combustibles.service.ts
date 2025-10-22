import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CargaCombustible } from '../models/vehiculo.model';

@Injectable({
  providedIn: 'root'
})
export class CombustiblesService {
  private apiUrl = '/api/combustible';

  constructor(private http: HttpClient) { }

  /**
   * Obtener todas las cargas de combustible
   */
  obtenerCargas(params?: { limit?: number; offset?: number; mes?: number; anio?: number }): Observable<any> {
    let query = '';
    if (params) {
      const q = [];
      if (params.limit !== undefined) q.push(`limit=${params.limit}`);
      if (params.offset !== undefined) q.push(`offset=${params.offset}`);
      if (params.mes !== undefined) q.push(`mes=${params.mes}`);
      if (params.anio !== undefined) q.push(`anio=${params.anio}`);
      if (q.length) query = '?' + q.join('&');
    }
    return this.http.get(`${this.apiUrl}/cargas${query}`);
  }

  /**
   * Obtener cargas por vehículo
   */
  obtenerCargasPorVehiculo(idVehiculo: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cargas/vehiculo/${idVehiculo}`);
  }

  /**
   * Registrar nueva carga de combustible
   */
  registrarCarga(carga: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/cargas`, carga);
  }

  /**
   * Obtener estadísticas de combustible
   */
  obtenerEstadisticas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/estadisticas`);
  }

  /**
   * Eliminar carga de combustible
   */
  eliminarCarga(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/cargas/${id}`);
  }

  /**
   * Exportar cargas de combustible a Excel
   */
  exportarCargas(params: { mes: number; anio: number }): Observable<any> {
    return this.http.get(`${this.apiUrl}/cargas/exportar?mes=${params.mes}&anio=${params.anio}`);
  }
}
