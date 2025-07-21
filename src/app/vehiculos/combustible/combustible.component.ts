import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CombustiblesService } from '../../services/combustibles.service';
import { VehiculosService } from '../../services/vehiculos.service';
import { CargaCombustible, Vehiculo } from '../../models/vehiculo.model';
import { DialogoNuevaCargaComponent } from './dialogo-nueva-carga.component';

@Component({
  selector: 'app-combustible',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatDialogModule
  ],
  providers: [
    CombustiblesService,
    VehiculosService
  ],
  templateUrl: './combustible.component.html',
  styleUrls: ['./combustible.component.css']
})
export class CombustibleComponent implements OnInit {
  // Datos
  cargas: CargaCombustible[] = [];
  cargasFiltradas: CargaCombustible[] = [];
  vehiculos: Vehiculo[] = [];
  estadisticas: any = {};

  // Estado
  cargando = false;
  errorCarga = '';

  // Filtros
  vehiculoSeleccionado = '';
  fechaDesdeSeleccionada: Date | null = null;
  fechaHastaSeleccionada: Date | null = null;

  // Configuración de la tabla
  columnasDisplayed: string[] = [
    'fecha', 'vehiculo', 'combustible', 'galones', 
    'precio', 'total', 'kilometraje', 'proveedor', 'acciones'
  ];

  constructor(
    private combustiblesService: CombustiblesService,
    private vehiculosService: VehiculosService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log('⛽ Inicializando gestión de combustible');
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.errorCarga = '';

    // Cargar vehículos y cargas en paralelo
    Promise.all([
      this.cargarVehiculos(),
      this.cargarCargas(),
      this.cargarEstadisticas()
    ]).then(() => {
      this.cargando = false;
      console.log('✅ Todos los datos cargados exitosamente');
    }).catch(error => {
      this.cargando = false;
      this.errorCarga = 'Error cargando datos de combustible';
      console.error('❌ Error cargando datos:', error);
    });
  }

  private async cargarVehiculos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.vehiculosService.obtenerVehiculos().subscribe({
        next: (response) => {
          if (response.success) {
            this.vehiculos = response.data;
            console.log('🚗 Vehículos cargados:', this.vehiculos.length);
            resolve();
          } else {
            reject('Error en respuesta de vehículos');
          }
        },
        error: (error) => {
          console.error('❌ Error cargando vehículos:', error);
          reject(error);
        }
      });
    });
  }

  private async cargarCargas(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.combustiblesService.obtenerCargas().subscribe({
        next: (response) => {
          if (response.success) {
            this.cargas = response.data;
            this.cargasFiltradas = [...this.cargas];
            console.log('⛽ Cargas cargadas:', this.cargas.length);
            resolve();
          } else {
            reject('Error en respuesta de cargas');
          }
        },
        error: (error) => {
          console.error('❌ Error cargando cargas:', error);
          reject(error);
        }
      });
    });
  }

  private async cargarEstadisticas(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.combustiblesService.obtenerEstadisticas().subscribe({
        next: (response) => {
          if (response.success) {
            this.estadisticas = response.data;
            console.log('📊 Estadísticas cargadas:', this.estadisticas);
            resolve();
          } else {
            reject('Error en respuesta de estadísticas');
          }
        },
        error: (error) => {
          console.error('❌ Error cargando estadísticas:', error);
          // No rechazar aquí para que no falle todo si las estadísticas fallan
          resolve();
        }
      });
    });
  }

  filtrarPorVehiculo(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.cargasFiltradas = this.cargas.filter(carga => {
      // Filtro por vehículo
      if (this.vehiculoSeleccionado && carga.idVehiculo.toString() !== this.vehiculoSeleccionado) {
        return false;
      }

      // Filtro por fecha desde
      if (this.fechaDesdeSeleccionada && new Date(carga.fechaCarga) < this.fechaDesdeSeleccionada) {
        return false;
      }

      // Filtro por fecha hasta
      if (this.fechaHastaSeleccionada && new Date(carga.fechaCarga) > this.fechaHastaSeleccionada) {
        return false;
      }

      return true;
    });

    console.log(`🔍 Filtros aplicados. Mostrando ${this.cargasFiltradas.length} de ${this.cargas.length} cargas`);
  }

  abrirDialogoCarga(): void {
    console.log('➕ Abriendo diálogo para nueva carga');
    
    const dialogRef = this.dialog.open(DialogoNuevaCargaComponent, {
      width: '600px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('✅ Nueva carga registrada:', result);
        this.cargarDatos(); // Recargar datos
      }
    });
  }

  editarCarga(carga: CargaCombustible): void {
    console.log('✏️ Editando carga:', carga);
    // TODO: Implementar diálogo para editar carga
    alert('Edición de carga en desarrollo');
  }

  eliminarCarga(carga: CargaCombustible): void {
    console.log('🗑️ Eliminando carga:', carga);
    if (confirm('¿Estás seguro de que deseas eliminar esta carga de combustible?')) {
      this.combustiblesService.eliminarCarga(carga.id!).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('✅ Carga eliminada exitosamente');
            this.cargarCargas();
            this.cargarEstadisticas();
          } else {
            alert('Error eliminando la carga');
          }
        },
        error: (error) => {
          console.error('❌ Error eliminando carga:', error);
          alert('Error eliminando la carga');
        }
      });
    }
  }
}
