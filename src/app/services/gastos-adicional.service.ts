import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GastoAdicional {
  id_vehiculo: number;
  tipo_gasto: string;
  fecha_gasto: string;
  descripcion?: string;
  monto: number;
  proveedor?: string;
  observaciones?: string;
  foto_factura?: string;
  kilometraje: number;
}

@Injectable({
  providedIn: 'root'
})
export class GastosAdicionalService {
  private apiUrl = '/api/gastos-adicional';
  constructor(private http: HttpClient) {}

  crearGasto(gasto: GastoAdicional): Observable<any> {
    return this.http.post(this.apiUrl, gasto);
  }

  obtenerGastos(params?: { limit?: number; offset?: number; mes?: number; anio?: number }): Observable<any> {
    let query = '';
    if (params) {
      const q = [];
      if (params.limit !== undefined) q.push(`limit=${params.limit}`);
      if (params.offset !== undefined) q.push(`offset=${params.offset}`);
      if (params.mes !== undefined) q.push(`mes=${params.mes}`);
      if (params.anio !== undefined) q.push(`anio=${params.anio}`);
      if (q.length) query = '?' + q.join('&');
    }
    return this.http.get(this.apiUrl + query);
  }
  actualizarGasto(id: number, gasto: GastoAdicional) {
  return this.http.put(`/api/gastos-adicional/${id}`, gasto);
  }
  
}
