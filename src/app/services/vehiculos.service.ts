import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  private apiUrl= 'http://localhost:3000/api/vehiculos';

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private http: HttpClient) { }
  //crea un vehiculo
  crearVehiculo(vehiculo: any): Observable<any> {
    console.log('Creando vehículo:', vehiculo);
    
    return this.http.post(this.apiUrl, vehiculo, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    );
  }

  // Verifica si la placa existente
   verificarPlaca(placa: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/verificar-placa/${placa}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener todos los vehículos
  obtenerVehiculos(): Observable<any> {
    return this.http.get(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
    
    // Datos de prueba temporales (comentados para usar backend real)
    // console.log('Obteniendo vehículos (modo temporal)');
    // const vehiculosTemporales = [
    //   {
    //     id: 1,
    //     numero_placa: 'ABC-123',
    //     marca: 'Toyota',
    //     modelo: 'Corolla',
    //     anio: 2020,
    //     color: 'Blanco',
    //     kilometraje: 25000,
    //     propietario: 'Juan Pérez',
    //     estado: 'Activo',
    //     tipo: 'Automóvil',
    //     grupo: 'Liviano'
    //   }
    // ];
    // 
    // return new Observable(observer => {
    //   setTimeout(() => {
    //     observer.next(vehiculosTemporales);
    //     observer.complete();
    //   }, 1000);
    // });
  }

  // Eliminar vehículo (soft delete)
  eliminarVehiculo(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Obtener vehículo por ID
  obtenerVehiculoPorId(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Actualizar vehículo
  actualizarVehiculo(id: number, vehiculo: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, vehiculo, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

   // Obtener catálogos
  obtenerTiposVehiculo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/catalogos/tipos-vehiculo`)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  obtenerGruposVehiculo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/catalogos/grupos-vehiculo`)
      .pipe(
        catchError(this.handleError)
      );
  }

  obtenerEstadosVehiculo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/catalogos/estados-vehiculo`)
      .pipe(
        catchError(this.handleError)
      );
  }

  
  obtenerTiposCombustible(): Observable<any> {
    return this.http.get(`${this.apiUrl}/catalogos/tipos-combustible`)
      .pipe(
        catchError(this.handleError)
      );
  }


  private handleError(error: any): Observable<never> {
    console.error('VehiculosService error:', error);
    return throwError(error);
  }


}
