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
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      telefono: [''],
      dpi: [''],
      licencia_conducir: [''],
      fecha_vencimiento_licencia: [''],
      // Puedes agregar más campos aquí
    });
  }

  ngOnInit() {
    const usuario = this.authService.getUsuario();
    if (usuario) {
      this.perfilForm.patchValue(usuario);
    }
  }

  guardar() {
    this.error = '';
    this.success = '';
    if (this.perfilForm.invalid) return;
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
