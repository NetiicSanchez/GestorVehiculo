import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, map } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {
  private apiUrl = 'http://localhost:3000/api/catalogos';

  constructor(private http: HttpClient) {}

  // Obtener tipos de vehículos
  obtenerTiposVehiculo(): Observable<any[]> {
    console.log('Llamando a:', `${this.apiUrl}/tipos-vehiculo`);
    return this.http.get<any[]>(`${this.apiUrl}/tipos-vehiculo`)
      .pipe(
        map((response: any) => Array.isArray(response) ? response : response.data || []),
        catchError(this.handleError)
      );
    
    // Datos de prueba temporales (comentados para usar backend real)
    // const datosTemporales = [
    //   { id: 1, nombre: 'Automóvil' },
    //   { id: 2, nombre: 'Motocicleta' },
    //   { id: 3, nombre: 'Camión' },
    //   { id: 4, nombre: 'Autobús' }
    // ];
    // 
    // return new Observable(observer => {
    //   setTimeout(() => {
    //     observer.next(datosTemporales);
    //     observer.complete();
    //   }, 500);
    // });
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
  obtenerGruposVehiculo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grupos-vehiculo`)
      .pipe(
        map((response: any) => Array.isArray(response) ? response : response.data || []),
        catchError(this.handleError)
      );
    
    // Datos de prueba temporales (comentados para usar backend real)
    // const datosTemporales = [
    //   { id: 1, nombre: 'Liviano' },
    //   { id: 2, nombre: 'Pesado' },
    //   { id: 3, nombre: 'Comercial' },
    //   { id: 4, nombre: 'Particular' }
    // ];
    // 
    // return new Observable(observer => {
    //   setTimeout(() => {
    //     observer.next(datosTemporales);
    //     observer.complete();
    //   }, 500);
    // });
  }

  // Obtener estados de vehículos
  obtenerEstadosVehiculo(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estados-vehiculo`)
      .pipe(
        map((response: any) => Array.isArray(response) ? response : response.data || []),
        catchError(this.handleError)
      );
    
    // Datos de prueba temporales (comentados para usar backend real)
    // const datosTemporales = [
    //   { id: 1, nombre: 'Activo' },
    //   { id: 2, nombre: 'Inactivo' },
    //   { id: 3, nombre: 'En Mantenimiento' },
    //   { id: 4, nombre: 'Vendido' }
    // ];
    // 
    // return new Observable(observer => {
    //   setTimeout(() => {
    //     observer.next(datosTemporales);
    //     observer.complete();
    //   }, 500);
    // });
  }

  // Obtener tipos de combustible
  obtenerTiposCombustible(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tipos-combustible`).pipe(
      map((response: any) => {
        if (Array.isArray(response)) return response;
        if (response && Array.isArray(response.data)) return response.data;
        return [];
      }),
      catchError(this.handleError)
    );
    
    // Datos de prueba temporales (comentados para usar backend real)
    // const datosTemporales = [
    //   { id: 1, nombre: 'Gasolina' },
    //   { id: 2, nombre: 'Diésel' },
    //   { id: 3, nombre: 'Eléctrico' },
    //   { id: 4, nombre: 'Híbrido' },
    //   { id: 5, nombre: 'Gas Natural' }
    // ];
    // 
    // return new Observable(observer => {
    //   setTimeout(() => {
    //     observer.next(datosTemporales);
    //     observer.complete();
    //   }, 500);
    // });
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