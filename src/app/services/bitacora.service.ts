import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BitacoraService {
  private apiUrl = '/api/bitacora';

  constructor(private http: HttpClient) { }

  /**
   * Crear un nuevo registro de bitácora de mantenimiento.
   * @param bitacoraData Los datos del formulario de la bitácora.
   */
  crearBitacora(bitacoraData: any): Observable<any> {
    return this.http.post(this.apiUrl, bitacoraData);
  }

  /**
   * Obtener todos los registros de la bitácora.
   */
  obtenerBitacoras(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  /**
   * Obtener datos de cumplimiento de mantenimiento por vehículo y mes.
   */
  obtenerCumplimiento(params?: any): Observable<any> {
    const url = `${this.apiUrl}/cumplimiento`;
    if (params) {
      // Permite filtros opcionales como { anio: 2025, mes: 10, id_vehiculo: 123 }
      const query = new URLSearchParams(params).toString();
      return this.http.get(`${url}?${query}`);
    }
    return this.http.get(url);
  }
}
