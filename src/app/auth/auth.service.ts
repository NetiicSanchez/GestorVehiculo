import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

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
    const THIRTY_MIN = 30 * 60 * 1000;
    return now - parseInt(loginTime, 10) > THIRTY_MIN;
  }

  checkSession() {
    if (this.isSessionExpired()) {
      // Evita cerrar sesión si ya estás en /login
      if (typeof window !== 'undefined' && window.location.pathname === '/login') {
        return;
      }
      this.logout();
    }
  }

  logout() {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      localStorage.removeItem('login_time');
      if (this.router.url !== '/login') {
        this.router.navigate(['/login']);
      }
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
