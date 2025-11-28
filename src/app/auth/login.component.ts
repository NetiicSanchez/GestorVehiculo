import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  mostrarContrasena = false;
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    // Si ya hay sesión activa, redirige automáticamente
    if (this.authService.isLoggedIn() && !this.authService.isSessionExpired()) {
      this.router.navigate(['/vehiculos/inventario']);
    }
  }

  login() {
    this.error = '';
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        this.authService.saveToken(res.token);
        this.authService.saveUser(res.usuario);
        this.router.navigate(['/vehiculos/inventario']); // Redirige al home
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Error de autenticación';
      }
    });
  }
}
