import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../services/usuarios.service';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-usuarios-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.css']
})
export class UsuariosListComponent implements OnInit {
  esConductor(): boolean {
    return this.rolUsuario === 'Conductor';
  }
  usuarios: any[] = [];
  permisosUsuario: string[] = [];
  rolUsuario: string = '';
  usuarioEditando: any = null;

    // Devuelve true si la licencia está vencida
    isLicenciaVencida(fecha: string): boolean {
      if (!fecha) return false;
      const hoy = new Date();
      const fechaLic = new Date(fecha);
      return fechaLic < hoy;
    }

    // Devuelve true si la licencia vence en los próximos 30 días
    isLicenciaPorVencer(fecha: string): boolean {
      if (!fecha) return false;
      const hoy = new Date();
      const fechaLic = new Date(fecha);
      const diff = fechaLic.getTime() - hoy.getTime();
      const dias = diff / (1000 * 60 * 60 * 24);
      return dias > 0 && dias <= 30;
    }

  constructor(
    private usuariosService: UsuariosService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Leer permisos y rol desde localStorage solo en navegador
    if (isPlatformBrowser(this.platformId)) {
      const usuario = localStorage.getItem('usuario');
      if (usuario) {
        const obj = JSON.parse(usuario);
        this.rolUsuario = obj.rol || obj.id_rol || '';
        this.permisosUsuario = obj.permisos || [];
      }
    }
  }

  ngOnInit(): void {
    if (this.rolUsuario === 'Administrador' || this.rolUsuario === 'Supervisor') {
      this.usuariosService.obtenerUsuarios().subscribe({
        next: (resp) => {
          this.usuarios = resp.data || [];
        },
        error: (err) => {
          this.usuarios = [];
        }
      });
    }
  }

  editarUsuario(usuario: any) {
    // Clonar el usuario para edición
    this.usuarioEditando = { ...usuario };
  }

  cancelarEdicion() {
    this.usuarioEditando = null;
  }

  guardarEdicion() {
    // Mapear el rol a id_rol para el backend
    let usuarioParaGuardar = { ...this.usuarioEditando };
    if (this.rolUsuario === 'Administrador') {
      if (usuarioParaGuardar.rol === 'Administrador') usuarioParaGuardar.id_rol = 1;
      else if (usuarioParaGuardar.rol === 'Supervisor') usuarioParaGuardar.id_rol = 2;
      else if (usuarioParaGuardar.rol === 'Conductor') usuarioParaGuardar.id_rol = 3;
    }
    this.usuariosService.actualizarUsuario(usuarioParaGuardar).subscribe({
      next: (resp) => {
        // Actualizar la lista local
        const idx = this.usuarios.findIndex(u => u.id === this.usuarioEditando.id);
        if (idx > -1) this.usuarios[idx] = { ...this.usuarioEditando };

        // Si el usuario editado es el que está logueado, actualizar localStorage
        const usuarioActual = localStorage.getItem('usuario');
        if (usuarioActual) {
          const obj = JSON.parse(usuarioActual);
          if (obj.id === this.usuarioEditando.id) {
            localStorage.setItem('usuario', JSON.stringify({ ...obj, ...this.usuarioEditando }));
          }
        }

        this.usuarioEditando = null;
      },
      error: () => {
        alert('Error al guardar los cambios');
      }
    });
  }
}
