
import { Component, signal } from '@angular/core';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LoginComponent } from './auth/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, MatIconModule, LoginComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  menuOpen = false;
  sidebarCollapsed = false;
  // base href detected at runtime ('' if not found)
  baseHref: string = '';
  // Getter para el rol del usuario
  get rolUsuario(): string {
    if (typeof window === 'undefined' || !window.localStorage) return '';
    return this.auth.getUsuario()?.rol || this.auth.getUsuario()?.id_rol || '';
  }

  // Getter para los permisos del usuario
  get permisosUsuario(): string[] {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    return this.auth.getUsuario()?.permisos || [];
  }
  protected readonly title = signal('Gestor de Vehículos');

  constructor(private auth: AuthService, public router: Router) {
    this.auth.checkSession();
    // compute base href at runtime so assets load correctly when app is hosted under a subpath
    if (typeof window !== 'undefined') {
      const baseEl = document.querySelector('base');
      this.baseHref = (baseEl && (baseEl as HTMLBaseElement).getAttribute('href')) || window.location.pathname || '';
      // ensure baseHref ends with a slash
      if (this.baseHref && !this.baseHref.endsWith('/')) this.baseHref = this.baseHref + '/';
      // If baseHref is root ("/" or empty) attempt to detect the correct mount by probing likely candidates
      if (!this.baseHref || this.baseHref === '/') {
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        const candidates: string[] = ['/'];
        if (pathSegments.length >= 1) candidates.push('/' + pathSegments[0] + '/');
        if (pathSegments.length >= 2) candidates.push('/' + pathSegments.slice(0, 2).join('/') + '/');

        const tryCandidate = (index: number) => {
          if (index >= candidates.length) {
            // fallback to '/'
            this.baseHref = '/';
            return;
          }
          const candidate = candidates[index];
          const img = new Image();
          img.onload = () => {
            this.baseHref = candidate;
          };
          img.onerror = () => tryCandidate(index + 1);
          // try JPG first (more likely to be statically present)
          img.src = candidate + 'assets/logo2.jpg';
        };

        tryCandidate(0);
      }
    }
    this.router.events.subscribe(() => {
      this.auth.checkSession();
      // Cierra el menú al navegar en móvil para mejor UX
      this.menuOpen = false;
    });
  }

  usuarioAutenticado(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    return !!localStorage.getItem('usuario');
  }
}
