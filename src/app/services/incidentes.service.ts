import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class IncidentesService {
  constructor(private http: HttpClient) {}

  getVehiculos(): Observable<any[]> {
    return this.http.get<any>('/api/vehiculos').pipe(
      map(res => res.data)
    );
  }

  getUsuarios(): Observable<any[]> {
    return this.http.get<any>('/api/usuarios').pipe(
      map(res => res.data)
    );
  }

  registrarIncidente(incidente: any): Observable<any> {
    return this.http.post<any>('/api/incidentes', incidente);
  }

  getIncidentes(): Observable<any[]> {
    return this.http.get<any>('/api/incidentes').pipe(
      map(res => res.data ?? res)
    );
  }

  // Marcar incidente como solventado (el backend debe enviar el Telegram)
  solventarIncidente(id: number, resolvedAt?: string, mensajeSolucion?: string): Observable<any> {
    return this.http.post<any>(`/api/incidentes/${id}/solventar`, { resolvedAt, mensajeSolucion });
  }

  // Subir foto de incidente a la carpeta /var/www/loader/incidentes en el backend
  // Devuelve un objeto con { success, filePath? | url? }
  uploadIncidenteFoto(file: File): Observable<{ success?: boolean; filePath?: string; url?: string }> {
    const formData = new FormData();
    formData.append('foto', file);
    return this.http.post<{ success?: boolean; filePath?: string; url?: string }>(
      '/api/upload/incidentes',
      formData
    );
  }
}
