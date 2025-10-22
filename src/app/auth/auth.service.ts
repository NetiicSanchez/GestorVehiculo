import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('login_time', Date.now().toString());
  }

  isSessionExpired(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) return true;
    const loginTime = localStorage.getItem('login_time');
    if (!loginTime) return true;
    const now = Date.now();
    // Sesión de 2 horas
    const TWO_HOURS = 2 * 60 * 60 * 1000;
    return now - parseInt(loginTime, 10) > TWO_HOURS;
  }

  checkSession() {
    if (this.isSessionExpired()) {
      // Evita el bucle de redirección si ya estamos en una página pública
      const publicPaths = ['/login', '/register'];
      if (typeof window !== 'undefined') {
        const currentPath = window.location?.pathname || '';
        const isPublic = publicPaths.some(path => currentPath.endsWith(path));
        if (isPublic) return; // ya estamos en login/register
      }

      // Redirige siempre al login al expirar la sesión
      this.logout();
    }
  }

  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('login_time');
      // Siempre redirige a login al cerrar sesión.
      this.router.navigate(['/login']);
    }
  }

  saveUser(usuario: any) {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  getUsuario(): any {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }
}
