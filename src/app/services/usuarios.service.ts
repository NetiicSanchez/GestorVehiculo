import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private baseUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) { }

  obtenerUsuarios(): Observable<any> {
    console.log('🌐 UsuariosService: Llamando a', this.baseUrl);
    return this.http.get<any>(this.baseUrl);
  }
}
