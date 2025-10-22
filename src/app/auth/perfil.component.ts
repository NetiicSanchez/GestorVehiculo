import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from './auth.service';
import { UsuariosService } from '../services/usuarios.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  rolDesactualizado = false;
  logout() {
    this.authService.logout();
    setTimeout(() => { window.location.href = '/login'; }, 100);
  }
  // Getter para el rol del usuario
  get rolUsuario(): string {
    if (typeof window === 'undefined' || !window.localStorage) return '';
    return this.authService.getUsuario()?.rol || this.authService.getUsuario()?.id_rol || '';
  }

  // Getter para los permisos del usuario (si los guardas en el objeto usuario)
  get permisosUsuario(): string[] {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    return this.authService.getUsuario()?.permisos || [];
  }
  perfilForm: FormGroup;
  loading = false;
  success = '';
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usuariosService: UsuariosService
  ) {
    this.perfilForm = this.fb.group({
      nombre: [{ value: '', disabled: false }, Validators.required],
      apellido: [{ value: '', disabled: false }, Validators.required],
      email: [{ value: '', disabled: true }],
      telefono: [{ value: '', disabled: false }],
      dpi: [{ value: '', disabled: false }],
      licencia_conducir: [{ value: '', disabled: false }],
      fecha_vencimiento_licencia: [{ value: '', disabled: false }],
    });
  }

  ngOnInit() {
    const usuarioLocal = this.authService.getUsuario();
    if (usuarioLocal) {
      this.usuariosService.obtenerUsuarioPorId(usuarioLocal.id).subscribe({
        next: (usuario) => {
          this.perfilForm.patchValue(usuario);
          // Lógica de permisos por rol
          if (this.rolUsuario === 'Supervisor') {
            this.perfilForm.get('nombre')?.disable();
            this.perfilForm.get('apellido')?.disable();
            this.perfilForm.get('email')?.disable();
            // Permitir editar teléfono y dpi
            this.perfilForm.get('telefono')?.enable();
            this.perfilForm.get('dpi')?.enable();
          }
          if (this.rolUsuario === 'Conductor') {
            this.perfilForm.get('nombre')?.disable();
            this.perfilForm.get('apellido')?.disable();
            this.perfilForm.get('email')?.disable();
            this.perfilForm.get('telefono')?.disable();
            this.perfilForm.get('dpi')?.disable();
            this.perfilForm.get('licencia_conducir')?.disable();
            this.perfilForm.get('fecha_vencimiento_licencia')?.disable();
          }
          // Verificar si el rol en la base de datos es diferente al del localStorage
          if (usuario.rol && usuario.rol !== usuarioLocal.rol) {
            this.rolDesactualizado = true;
          }
        }
      });
    }
  }

  guardar() {
    this.error = '';
    this.success = '';
    if (this.perfilForm.invalid) return;
    // Solo permitir guardar si no es conductor
    if (this.rolUsuario === 'Conductor') return;
    this.loading = true;
    let datos = { ...this.perfilForm.getRawValue(), id: this.authService.getUsuario()?.id };
    // Adaptar fecha a formato YYYY-MM-DD si existe
    if (datos.fecha_vencimiento_licencia) {
      const fecha = new Date(datos.fecha_vencimiento_licencia);
      if (!isNaN(fecha.getTime())) {
        const yyyy = fecha.getFullYear();
        const mm = String(fecha.getMonth() + 1).padStart(2, '0');
        const dd = String(fecha.getDate()).padStart(2, '0');
        datos.fecha_vencimiento_licencia = `${yyyy}-${mm}-${dd}`;
      }
    }
    this.usuariosService.actualizarUsuario(datos).subscribe({
      next: () => {
        this.authService.saveUser({ ...this.authService.getUsuario(), ...datos });
        this.loading = false;
        this.success = 'Perfil actualizado correctamente';
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'Error al actualizar perfil';
      }
    });
  }
}
