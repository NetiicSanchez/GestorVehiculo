import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = localStorage.getItem('token');
    if (token && !this.auth.isSessionExpired()) {
      return true;
    }
    // Redirige al login si no hay token o la sesión expiró
    return this.router.parseUrl('/login');
  }
}
