import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {
  private apiUrl = 'http://localhost:3000/api/catalogos';

  constructor(private http: HttpClient) {}

  // Obtener tipos de vehículos
  obtenerTiposVehiculo(): Observable<any> {
    console.log('Llamando a:', `${this.apiUrl}/tipos-vehiculo`);
    return this.http.get(`${this.apiUrl}/tipos-vehiculo`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Agregar tipo de vehículo
  agregarTipoVehiculo(tipo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tipos-vehiculo`, tipo)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar tipo de vehículo
  eliminarTipoVehiculo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tipos-vehiculo/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Agregar grupo de vehículo
  agregarGrupoVehiculo(grupo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/grupos-vehiculo`, grupo)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar grupo de vehículo
  eliminarGrupoVehiculo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/grupos-vehiculo/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Agregar estado de vehículo
  agregarEstadoVehiculo(estado: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/estados-vehiculo`, estado)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar estado de vehículo
  eliminarEstadoVehiculo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/estados-vehiculo/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener grupos de vehículos
  obtenerGruposVehiculo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/grupos-vehiculo`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener estados de vehículos
  obtenerEstadosVehiculo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/estados-vehiculo`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener tipos de combustible
  obtenerTiposCombustible(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tipos-combustible`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Agregar tipo de combustible
  agregarTipoCombustible(tipo: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/tipos-combustible`, tipo)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Eliminar tipo de combustible
  eliminarTipoCombustible(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tipos-combustible/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    console.error('Error en catalogos service:', error);
    return throwError(error);
  }
}