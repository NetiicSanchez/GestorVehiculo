import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Gestor de Vehículos');

  constructor(private auth: AuthService, private router: Router) {
    this.auth.checkSession();
    this.router.events.subscribe(() => {
      this.auth.checkSession();
    });
  }

  usuarioAutenticado(): boolean {
    if (typeof window === 'undefined' || !window.localStorage) return false;
    return !!localStorage.getItem('usuario');
  }
}
