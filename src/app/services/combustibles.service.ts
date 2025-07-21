import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CargaCombustible } from '../models/vehiculo.model';

@Injectable({
  providedIn: 'root'
})
export class CombustiblesService {
  private apiUrl = 'http://localhost:3000/api/combustible';

  constructor(private http: HttpClient) { }

  /**
   * Obtener todas las cargas de combustible
   */
  obtenerCargas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cargas`);
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
  registrarCarga(carga: CargaCombustible): Observable<any> {
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
}
