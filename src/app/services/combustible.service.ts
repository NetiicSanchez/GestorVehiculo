import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, timeout, retry } from 'rxjs';
import { CargaCombustible } from '../models/vehiculo.model';

@Injectable({
  providedIn: 'root'
})
export class CombustibleService {
  private apiUrl = 'http://localhost:3000/api';
  private readonly TIMEOUT_MS = 10000;
  private readonly MAX_RETRIES = 3;

  constructor(private http: HttpClient) { }

  // Obtener todas las cargas de combustible
  obtenerCargas(): Observable<any> {
    console.log('🚗 CombustibleService: Obteniendo todas las cargas');
    return this.http.get(`${this.apiUrl}/combustible/cargas`)
      .pipe(
        timeout(this.TIMEOUT_MS),
        retry(this.MAX_RETRIES),
        catchError(error => {
          console.error('❌ Error obteniendo cargas:', error);
          return throwError(() => error);
        })
      );
  }

  // Obtener cargas por vehículo
  obtenerCargasPorVehiculo(idVehiculo: number): Observable<any> {
    console.log(`🚗 CombustibleService: Obteniendo cargas del vehículo ${idVehiculo}`);
    return this.http.get(`${this.apiUrl}/combustible/cargas/vehiculo/${idVehiculo}`)
      .pipe(
        timeout(this.TIMEOUT_MS),
        retry(this.MAX_RETRIES),
        catchError(error => {
          console.error('❌ Error obteniendo cargas del vehículo:', error);
          return throwError(() => error);
        })
      );
  }

  // Registrar nueva carga de combustible
  registrarCarga(carga: CargaCombustible): Observable<any> {
    console.log('⛽ CombustibleService: Registrando nueva carga:', carga);
    return this.http.post(`${this.apiUrl}/combustible/cargas`, carga)
      .pipe(
        timeout(this.TIMEOUT_MS),
        retry(this.MAX_RETRIES),
        catchError(error => {
          console.error('❌ Error registrando carga:', error);
          return throwError(() => error);
        })
      );
  }

  // Actualizar carga de combustible
  actualizarCarga(id: number, carga: CargaCombustible): Observable<any> {
    console.log(`🔧 CombustibleService: Actualizando carga ${id}:`, carga);
    return this.http.put(`${this.apiUrl}/combustible/cargas/${id}`, carga)
      .pipe(
        timeout(this.TIMEOUT_MS),
        retry(this.MAX_RETRIES),
        catchError(error => {
          console.error('❌ Error actualizando carga:', error);
          return throwError(() => error);
        })
      );
  }

  // Eliminar carga de combustible
  eliminarCarga(id: number): Observable<any> {
    console.log(`🗑️ CombustibleService: Eliminando carga ${id}`);
    return this.http.delete(`${this.apiUrl}/combustible/cargas/${id}`)
      .pipe(
        timeout(this.TIMEOUT_MS),
        retry(this.MAX_RETRIES),
        catchError(error => {
          console.error('❌ Error eliminando carga:', error);
          return throwError(() => error);
        })
      );
  }

  // Obtener estadísticas de combustible
  obtenerEstadisticas(): Observable<any> {
    console.log('📊 CombustibleService: Obteniendo estadísticas');
    return this.http.get(`${this.apiUrl}/combustible/estadisticas`)
      .pipe(
        timeout(this.TIMEOUT_MS),
        retry(this.MAX_RETRIES),
        catchError(error => {
          console.error('❌ Error obteniendo estadísticas:', error);
          return throwError(() => error);
        })
      );
  }
}
