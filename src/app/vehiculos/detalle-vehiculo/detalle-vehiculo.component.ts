import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { VehiculosService } from '../../services/vehiculos.service';
import { CatalogosService } from '../../services/catalogos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Vehiculo } from '../../models/vehiculo.model';

@Component({
  selector: 'app-detalle-vehiculo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  templateUrl: './detalle-vehiculo.component.html',
  styleUrls: ['./detalle-vehiculo.component.css']
})
export class DetalleVehiculoComponent implements OnInit {
  vehiculo: any = null; // Cambiar a any para incluir todos los campos
  cargando: boolean = false;
  error: string = '';
  
  // Para mostrar nombres en lugar de IDs
  tipoVehiculo: string = '';
  grupoVehiculo: string = '';
  estadoVehiculo: string = '';
  tipoCombustible: string = '';
  usuarioAsignado: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehiculosService: VehiculosService,
    private catalogosService: CatalogosService,
    private usuariosService: UsuariosService
  ) { }

  ngOnInit(): void {
    this.cargarVehiculo();
  }

  cargarVehiculo(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargando = true;
      console.log('🔍 Cargando detalle del vehículo ID:', id);
      
      this.vehiculosService.obtenerVehiculoPorId(+id).subscribe({
        next: (response: any) => {
          console.log('✅ Vehículo recibido:', response);
          
          // Manejar diferentes formatos de respuesta
          let vehiculoData = response;
          if (response.success && response.data) {
            vehiculoData = response.data;
          }
          
          this.vehiculo = vehiculoData;
          console.log('📋 Vehículo asignado:', this.vehiculo);
          
          // Cargar los nombres de los catálogos
          this.cargarNombresCatalogos();
          
          this.cargando = false;
        },
        error: (error: any) => {
          console.error('❌ Error al cargar vehículo:', error);
          this.error = 'Error al cargar el vehículo';
          this.cargando = false;
        }
      });
    }
  }

  cargarNombresCatalogos(): void {
    if (!this.vehiculo) return;

    console.log('🔄 Cargando nombres de catálogos para vehículo:', this.vehiculo);

    // Cargar tipo de vehículo
    this.catalogosService.obtenerTiposVehiculo().subscribe({
      next: (tipos: any[]) => {
        const tipo = tipos.find(t => t.id === this.vehiculo?.id_tipo_vehiculo);
        this.tipoVehiculo = tipo ? tipo.nombre : 'No especificado';
        console.log('📝 Tipo de vehículo:', this.tipoVehiculo);
      },
      error: (error) => console.error('Error al cargar tipos de vehículo:', error)
    });

    // Cargar grupo de vehículo
    this.catalogosService.obtenerGruposVehiculo().subscribe({
      next: (grupos: any[]) => {
        const grupo = grupos.find(g => g.id === this.vehiculo?.id_grupo_vehiculo);
        this.grupoVehiculo = grupo ? grupo.nombre : 'No especificado';
        console.log('📝 Grupo de vehículo:', this.grupoVehiculo);
      },
      error: (error) => console.error('Error al cargar grupos de vehículo:', error)
    });

    // Cargar estado de vehículo
    this.catalogosService.obtenerEstadosVehiculo().subscribe({
      next: (estados: any[]) => {
        const estado = estados.find(e => e.id === this.vehiculo?.id_estado_vehiculo);
        this.estadoVehiculo = estado ? estado.nombre : 'No especificado';
        console.log('📝 Estado de vehículo:', this.estadoVehiculo);
      },
      error: (error) => console.error('Error al cargar estados de vehículo:', error)
    });

    // Cargar tipo de combustible
    this.catalogosService.obtenerTiposCombustible().subscribe({
      next: (tipos: any[]) => {
        const tipo = tipos.find(t => t.id === this.vehiculo?.id_tipo_combustible);
        this.tipoCombustible = tipo ? tipo.nombre : 'No especificado';
        console.log('📝 Tipo de combustible:', this.tipoCombustible);
      },
      error: (error) => console.error('Error al cargar tipos de combustible:', error)
    });

    // Cargar usuario asignado
    if (this.vehiculo.id_usuario_asignado) {
      this.usuariosService.obtenerUsuarios().subscribe({
        next: (response: any) => {
          let usuarios = [];
          if (response.success && response.data) {
            usuarios = response.data;
          } else if (Array.isArray(response)) {
            usuarios = response;
          }
          
          const usuario = usuarios.find((u: any) => u.id === this.vehiculo?.id_usuario_asignado);
          this.usuarioAsignado = usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario no encontrado';
          console.log('📝 Usuario asignado:', this.usuarioAsignado);
        },
        error: (error) => {
          console.error('Error al cargar usuarios:', error);
          this.usuarioAsignado = 'Error al cargar usuario';
        }
      });
    } else {
      this.usuarioAsignado = 'Sin asignar';
    }
  }

  editarVehiculo(): void {
    if (this.vehiculo?.id) {
      this.router.navigate(['/vehiculos/editar', this.vehiculo.id]);
    }
  }

  volver(): void {
    this.router.navigate(['/vehiculos/inventario']);
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return 'No disponible';
    
    try {
      // Crear fecha sin ajuste de zona horaria
      let date: Date;
      
      if (fecha.includes('T')) {
        // Si ya incluye hora, usar directamente
        date = new Date(fecha);
      } else {
        // Si solo es fecha, agregarle tiempo local para evitar cambio de zona horaria
        date = new Date(fecha + 'T00:00:00');
      }
      
      // Formatear en zona horaria local de Colombia
      return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'America/Bogota'
      });
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return 'Fecha inválida';
    }
  }

  getEstadoColor(estado: string): string {
    switch (estado?.toLowerCase()) {
      case 'activo':
      case 'disponible':
        return 'primary';
      case 'inactivo':
      case 'fuera de servicio':
        return 'warn';
      case 'mantenimiento':
        return 'accent';
      default:
        return 'basic';
    }
  }

  onImageError(event: any): void {
    console.warn('Error al cargar imagen:', event);
    event.target.style.display = 'none';
    if (event.target.nextElementSibling) {
      event.target.nextElementSibling.style.display = 'block';
    }
  }
}
