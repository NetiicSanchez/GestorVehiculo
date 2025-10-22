import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IncidentesService } from '../services/incidentes.service';

@Component({
  selector: 'app-incidentes',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './incidentes.component.html',
  styleUrls: ['./incidentes.component.css']
})
export class IncidentesComponent implements OnInit {
  vehiculos: any[] = [];
  usuarios: any[] = [];
  //seccion de listado de incidentes regresa los incidentes registrados
  listadoIncidentes: any[] = [];
  cargandoLista = false;
  filtroEstado: string = 'todos';
  paginaActual: number = 1;
  itemsPorPagina: number = 8;

    rolUsuario: string = '';

  accesorios: string[] = [
    'Faros','Luces bajas','Luces altas','Pidevias','Llantas','Tricket','Llave de cruz','Llantas de repuesto'
  ];
  guardando = false;
  mensaje: string = '';
  marcando = false;
  // Manejo de foto de incidente
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = null;
    verHistorial() {
      // Aquí puedes navegar a la vista de historial o mostrar un modal
      // Por ejemplo, usando router: this.router.navigate(['/historial-incidentes']);
      alert('Funcionalidad de historial solo para administradores.');
    }

  ngOnInit(): void {
    this.incidentesService.getVehiculos().subscribe((res: any[]) => {
      this.vehiculos = Array.isArray(res) ? res.filter(v => v && v.id) : [];
      console.log('Vehiculos:', this.vehiculos);
    });
    this.incidentesService.getUsuarios().subscribe((res: any[]) => {
      this.usuarios = Array.isArray(res) ? res.filter(u => u && u.id) : [];
      console.log('Usuarios:', this.usuarios);
    });
      // Obtener rol del usuario autenticado y normalizar
      const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
      let rol = usuario.rol || usuario.nombre_rol || usuario.id_rol || '';
      if (typeof rol === 'number') rol = rol.toString();
      rol = rol.toString().toLowerCase().trim();
      // Considerar 'administrador' o id 1 como admin
      this.rolUsuario = (rol === 'administrador' || rol === '1') ? 'Administrador' : rol.charAt(0).toUpperCase() + rol.slice(1);
      this.cargarIncidentes();
  }

  get incidentesFiltrados(): any[] {
    let filtrados = this.listadoIncidentes;
    if (this.filtroEstado === 'pendientes') {
      filtrados = filtrados.filter(i => !i.solventado);
    } else if (this.filtroEstado === 'solventados') {
      filtrados = filtrados.filter(i => i.solventado);
    }
    return filtrados;
  }

  get incidentesPaginados(): any[] {
    const start = (this.paginaActual - 1) * this.itemsPorPagina;
    return this.incidentesFiltrados.slice(start, start + this.itemsPorPagina);
  }

  get totalPaginas(): number {
    return Math.ceil(this.incidentesFiltrados.length / this.itemsPorPagina) || 1;
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPaginas) {
      this.paginaActual = nuevaPagina;
    }
  }

  cambiarFiltroEstado(nuevoEstado: string) {
    this.filtroEstado = nuevoEstado;
    this.paginaActual = 1;
  }
    // Cargar incidentes existentes desde el backend
    cargarIncidentes() {
    this.cargandoLista = true;
    this.incidentesService.getIncidentes().subscribe({
      next: (res) => {
        this.listadoIncidentes = Array.isArray(res) ? res : [];
        this.cargandoLista = false;
      },
      error: () => {
        this.listadoIncidentes = [];
        this.cargandoLista = false;
      }
    });
  }

  marcarSolventado(inc: any) {
  if (!inc?.id) { return; }
  this.marcando = true;
  const resolvedAtIso = new Date().toISOString();
  const mensajeSolucion = inc.mensajeSolucion || '';
  this.incidentesService.solventarIncidente(inc.id, resolvedAtIso, mensajeSolucion).subscribe({
      next: (res) => {
        this.mensaje = `Incidente #${inc.id} marcado como solventado.`;
        // Actualiza in-place si backend retorna el objeto, si no, recarga
        if (res?.data) {
          const idx = this.listadoIncidentes.findIndex(i => i.id === inc.id);
          if (idx > -1) this.listadoIncidentes[idx] = { ...this.listadoIncidentes[idx], ...res.data };
        } else {
          this.cargarIncidentes();
        }
        this.marcando = false;
      },
      error: (e) => {
        console.error('Error al marcar solventado', e);
        this.mensaje = 'No se pudo marcar como solventado.';
        this.marcando = false;
      }
    });
  }
  incidente: any = {};

  get camposObligatoriosCompletos(): boolean {
    return !!(this.incidente.id_vehiculo && this.incidente.id_piloto && this.incidente.tipo_incidente);
  }

  onTipoIncidenteChange() {
    const tipo = this.incidente.tipo_incidente;
    // Limpiar campos que no aplican al cambiar tipo
    const comunes = ['kilometraje','detalle','fotos','tipo_aceite','tipo_mantenimiento','tipo_accesorio'];
    comunes.forEach(c => delete this.incidente[c]);
    // Dejar tipo, ids y correo_intacto
    this.incidente.tipo_incidente = tipo;
  }

  // Nuevo: sincroniza reportado_por al cambiar el piloto
  onPilotoChange(pilotoId: number) {
    const piloto = this.usuarios.find(u => u && u.id === pilotoId);
    if (piloto) {
      const nombre = (piloto.nombre || '').toString().trim();
      const apellido = (piloto.apellido || '').toString().trim();
      this.incidente.reportado_por = [nombre, apellido].filter(Boolean).join(' ').trim();
    } else {
      delete this.incidente.reportado_por;
    }
  }

  // Manejar selección de archivo e imagen de vista previa
  onFileSelected(event: any) {
    const file = event?.target?.files?.[0];
    if (!file) { return; }
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSubmit(form: NgForm) {
      console.log('Submit ejecutado', form.value, this.incidente);

    // Refuerza sincronización de reportado_por por si acaso
    if (this.incidente?.id_piloto) {
      const piloto = this.usuarios.find(u => u && u.id === this.incidente.id_piloto);
      if (piloto) {
        const nombre = (piloto.nombre || '').toString().trim();
        const apellido = (piloto.apellido || '').toString().trim();
        this.incidente.reportado_por = [nombre, apellido].filter(Boolean).join(' ').trim();
      }
    }

    if (form.invalid) {
      this.mensaje = 'Por favor, completa todos los campos obligatorios.';
      return;
    }
    this.guardando = true;
    this.mensaje = '';
    const finalizar = () => {
      this.guardando = false;
    };

    const guardarIncidente = () => {
      console.log('Datos a enviar:', this.incidente);
      this.incidentesService.registrarIncidente(this.incidente).subscribe({
        next: (res) => {
          console.log('Respuesta backend:', res);
          if (res && (res.success === true || res.id || res.data)) {
            this.mensaje = 'Incidente registrado correctamente.';
            form.resetForm();
            this.incidente = {};
            this.selectedFile = null;
            this.imagePreview = null;
          } else {
            this.mensaje = 'El backend no confirmó el registro.';
          }
          finalizar();
        },
        error: (err) => {
          console.error('Error backend:', err);
          this.mensaje = 'Error al registrar el incidente.';
          finalizar();
        }
      });
    };

    // Si hay archivo seleccionado, primero subirlo a /api/uploads/incidentes
    if (this.selectedFile) {
      this.incidentesService.uploadIncidenteFoto(this.selectedFile).subscribe({
        next: (resp) => {
          const url = resp?.filePath || resp?.url;
          if (url) {
            // Integrar con el campo esperado por el backend. Preferimos 'fotos' si ya existe en el DTO.
            this.incidente.fotos = url;
          }
          guardarIncidente();
        },
        error: (e) => {
          console.error('Error al subir la imagen del incidente', e);
          this.mensaje = '❌ Error al subir la foto del incidente.';
          finalizar();
        }
      });
    } else {
      // Sin foto, guardar directamente
      guardarIncidente();
    }
  }

  constructor(private incidentesService: IncidentesService) {}

}
