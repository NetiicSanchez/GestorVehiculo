import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private baseUrl = '/api/usuarios';

  constructor(private http: HttpClient) { }

  obtenerUsuarios(): Observable<any> {
    console.log('🌐 UsuariosService: Llamando a', this.baseUrl);
    return this.http.get<any>(this.baseUrl);
  }

  obtenerUsuarioPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  actualizarUsuario(usuario: any) {
    return this.http.put(`/api/usuarios/${usuario.id}`, usuario);
  }
}
