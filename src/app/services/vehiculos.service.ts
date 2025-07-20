import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError, timer } from 'rxjs';
import { catchError, timeout, retry, retryWhen, delayWhen, take } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  private apiUrl= 'http://localhost:3000/api/vehiculos';
  private readonly TIMEOUT_MS = 15000; // 15 segundos timeout
  private readonly MAX_RETRIES = 2; // máximo 2 reintentos

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }
  //crea un vehiculo
  crearVehiculo(vehiculo: any): Observable<any> {
    console.log('📤 Creando vehículo:', vehiculo);
    
    return this.http.post(this.apiUrl, vehiculo, this.httpOptions)
    .pipe(
      timeout(this.TIMEOUT_MS),
      retry(this.MAX_RETRIES),
      catchError(this.handleError)
    );
  }

  // Verifica si la placa existente
   verificarPlaca(placa: string): Observable<any> {
    console.log('🔍 Verificando placa:', placa);
    return this.http.get(`${this.apiUrl}/verificar-placa/${placa}`)
      .pipe(
        timeout(this.TIMEOUT_MS),
        retry(this.MAX_RETRIES),
        catchError(this.handleError)
      );
  }

  // Obtener todos los vehículos
  obtenerVehiculos(): Observable<any> {
    console.log('📋 Obteniendo vehículos...');
    return this.http.get(this.apiUrl)
      .pipe(
        timeout(this.TIMEOUT_MS),
        retry(this.MAX_RETRIES),
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
    console.log('🗑️ Eliminando vehículo ID:', id);
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        timeout(this.TIMEOUT_MS),
        retry(this.MAX_RETRIES),
        catchError(this.handleError)
      );
  }

  // Obtener vehículo por ID
  obtenerVehiculoPorId(id: number): Observable<any> {
    console.log('🔍 Obteniendo vehículo por ID:', id);
    return this.http.get(`${this.apiUrl}/${id}`)
      .pipe(
        timeout(this.TIMEOUT_MS),
        retry(this.MAX_RETRIES),
        catchError(this.handleError)
      );
  }

  // Actualizar vehículo
  actualizarVehiculo(id: number, vehiculo: any): Observable<any> {
    console.log('📝 Actualizando vehículo ID:', id);
    return this.http.put(`${this.apiUrl}/${id}`, vehiculo, this.httpOptions)
      .pipe(
        timeout(this.TIMEOUT_MS),
        retry(this.MAX_RETRIES),
        catchError(this.handleError)
      );
  }

   // Obtener catálogos
  obtenerTiposVehiculo(): Observable<any> {
    console.log('📋 Obteniendo tipos de vehículo...');
    return this.http.get(`${this.apiUrl}/catalogos/tipos-vehiculo`)
      .pipe(
        timeout(this.TIMEOUT_MS),
        retry(this.MAX_RETRIES),
        catchError(this.handleError)
      );
  }

  obtenerGruposVehiculo(): Observable<any> {
    console.log('📋 Obteniendo grupos de vehículo...');
    return this.http.get(`${this.apiUrl}/catalogos/grupos-vehiculo`)
      .pipe(
        timeout(this.TIMEOUT_MS),
        retry(this.MAX_RETRIES),
        catchError(this.handleError)
      );
  }

  obtenerEstadosVehiculo(): Observable<any> {
    console.log('📋 Obteniendo estados de vehículo...');
    return this.http.get(`${this.apiUrl}/catalogos/estados-vehiculo`)
      .pipe(
        timeout(this.TIMEOUT_MS),
        retry(this.MAX_RETRIES),
        catchError(this.handleError)
      );
  }

  
  obtenerTiposCombustible(): Observable<any> {
    console.log('📋 Obteniendo tipos de combustible...');
    return this.http.get(`${this.apiUrl}/catalogos/tipos-combustible`)
      .pipe(
        timeout(this.TIMEOUT_MS),
        retry(this.MAX_RETRIES),
        catchError(this.handleError)
      );
  }


  private handleError(error: any): Observable<never> {
    console.error('❌ VehiculosService error:', error);
    
    let errorMessage = 'Error desconocido';
    
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          errorMessage = 'Sin conexión al servidor. Verifique su conexión a internet.';
          break;
        case 404:
          errorMessage = 'Recurso no encontrado.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor.';
          break;
        case 408:
          errorMessage = 'Tiempo de espera agotado. Intente nuevamente.';
          break;
        default:
          errorMessage = error.error?.message || `Error del servidor: ${error.status}`;
      }
    } else if (error.name === 'TimeoutError') {
      errorMessage = 'Tiempo de espera agotado. La conexión es muy lenta.';
    } else {
      errorMessage = error.message || 'Error de conexión';
    }
    
    console.error('🔍 Error procesado:', errorMessage);
    return throwError(() => ({ message: errorMessage, originalError: error }));
  }


}
