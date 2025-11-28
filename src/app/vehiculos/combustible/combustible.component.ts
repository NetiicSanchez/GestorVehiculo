import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { MatPaginatorModule } from '@angular/material/paginator';
import { CombustiblesService } from '../../services/combustibles.service';
import { VehiculosService } from '../../services/vehiculos.service';
import { CargaCombustible, Vehiculo } from '../../models/vehiculo.model';
import { DialogoNuevaCargaComponent } from './dialogo-nueva-carga.component';
import { DialogoEditarCargaComponent } from './dialogo-editar-carga.component';
import { AuthService } from '../../auth/auth.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
    MatDialogModule,
    MatPaginatorModule
  ],
  providers: [
    CombustiblesService,
    VehiculosService
  ],
  templateUrl: './combustible.component.html',
  styleUrls: ['./combustible.component.css']
})
export class CombustibleComponent implements OnInit, OnDestroy {
  verFoto(ruta: string): void {
    if (ruta) {
      window.open(ruta, '_blank');
    }
  }
  // Datos
  cargas: CargaCombustible[] = [];
  cargasFiltradas: CargaCombustible[] = [];
  vehiculos: Vehiculo[] = [];
  estadisticas: any = {};

  // Estado
  cargando = false;
  errorCarga = '';
  successMessage = '';
  // Responsive
  isMobile = false;
  // Permisos
  isOperador = false;

  // Paginación y filtro
  pageSize = 20;
  pageIndex = 0;
  mesFiltro: number | null = null;
  anioFiltro: number | null = null;

  // Filtros
  vehiculoSeleccionado: number | null = null;
  fechaDesdeSeleccionada: Date | null = null;
  fechaHastaSeleccionada: Date | null = null;

  // Configuración de la tabla
  columnasDisplayed: string[] = [
  'fecha', 'fecha_registro', 'usuario', 'vehiculo', 'combustible', 'galones', 
  'precio', 'total', 'kilometraje', 'proveedor', 'observaciones', 'acciones'
  ];

  constructor(
    private combustiblesService: CombustiblesService,
    private vehiculosService: VehiculosService,
    private dialog: MatDialog,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
    console.log('⛽ Inicializando gestión de combustible');
  const usuario = this.auth.getUsuario();
  // Detectar "Conductor" de forma robusta por si cambia la forma del objeto
  const rolTexto = (usuario?.rol || usuario?.nombre_rol || '').toString().toLowerCase().trim();
  const idRol = (usuario?.id_rol ?? '').toString().trim();
  // Restringir acciones para rol "conductor" (texto o id 3)
  this.isOperador = rolTexto === 'conductor' || rolTexto.includes('conductor') || idRol === '3';
  // Si es conductor, ocultar la columna de acciones
  if (this.isOperador) {
    this.columnasDisplayed = this.columnasDisplayed.filter(c => c !== 'acciones');
  }
    this.updateIsMobile();
    window.addEventListener('resize', this.updateIsMobile);
    this.cargarDatos();
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.updateIsMobile);
  }

  private updateIsMobile = (): void => {
    this.isMobile = window.innerWidth <= 600;
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

  exportarExcel(): void {
    if (this.mesFiltro && this.anioFiltro) {
      this.combustiblesService.exportarCargas({ mes: this.mesFiltro, anio: this.anioFiltro }).subscribe({
        next: (response) => {
          const datos = response.data;
          console.log('Datos para exportar:', datos); // Log para depuración
            const exportData = datos.map((carga: any) => ({
              'Fecha de Carga': carga.fechaCarga ? carga.fechaCarga.slice(0, 10) : '',
              'Fecha de Registro': carga.fechaRegistro ? carga.fechaRegistro.slice(0, 10) : '',
              Vehiculo: carga.placa + ' ' + carga.marca + ' ' + carga.modelo,
              Tipo: carga.tipoCombustible,
              Galones: carga.galonesCargados,
              PrecioGalon: carga.precioGalon,
              Total: carga.totalPagado,
              Kilometraje: carga.kilometrajeActual,
              Proveedor: carga.proveedorCombustible,
              NumeroFactura: carga.numeroFactura,
              Usuario: (carga.nombreUsuario ? carga.nombreUsuario : '') + (carga.apellidoUsuario ? ' ' + carga.apellidoUsuario : '')
            }));
          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Cargas');
          const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
          const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
          saveAs(blob, 'cargas_combustible.xlsx');
        },
        error: () => {
          alert('Error al exportar los datos');
        }
      });
    } else {
      alert('Selecciona mes y año para exportar');
    }
  }

  abrirDialogoCarga(): void {
    const dialogRef = this.dialog.open(DialogoNuevaCargaComponent, {
      width: '95vw',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { vehiculos: this.vehiculos }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('✅ Carga guardada desde diálogo:', result);
        this.successMessage = '¡Carga de combustible registrada exitosamente!';
        this.cargarCargas(); // Recargar la lista de cargas
        setTimeout(() => this.successMessage = '', 5000); // Ocultar mensaje después de 5 segundos
      }
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
      // Si hay vehículo seleccionado, obtener todas sus cargas (sin paginar) para que el filtro no se limite por página
      if (this.vehiculoSeleccionado !== null && this.vehiculoSeleccionado !== undefined) {
        this.combustiblesService.obtenerCargasPorVehiculo(this.vehiculoSeleccionado).subscribe({
          next: (response) => {
            if (response.success) {
              // Normalizar claves snake_case -> camelCase para que coincidan con el modelo/plantilla
              const toCamel = (s: string) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
              const mapRow = (row: any) => {
                const mapped: any = {};
                Object.keys(row).forEach(k => {
                  mapped[toCamel(k)] = (row as any)[k];
                });
                return mapped;
              };
              this.cargas = Array.isArray(response.data) ? response.data.map(mapRow) : [];
              this.aplicarFiltros();
              console.log('⛽ Cargas por vehículo cargadas:', this.cargas.length);
              resolve();
            } else {
              reject('Error en respuesta de cargas por vehículo');
            }
          },
          error: (error) => {
            console.error('❌ Error cargando cargas por vehículo:', error);
            reject(error);
          }
        });
        return;
      }

      // Sin vehículo seleccionado: usar paginación general (ordenado por fecha desc en backend)
      const params: any = {
        limit: this.pageSize,
        offset: this.pageIndex * this.pageSize
      };
      if (this.mesFiltro) params.mes = this.mesFiltro;
      if (this.anioFiltro) params.anio = this.anioFiltro;
      this.combustiblesService.obtenerCargas(params).subscribe({
        next: (response) => {
          if (response.success) {
            this.cargas = response.data;
            this.aplicarFiltros();
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

  cambiarPagina(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarCargas();
  }

  filtrarPorMes(): void {
    this.pageIndex = 0;
    this.cargarCargas();
  }

  obtenerAnios(): number[] {
    const anioActual = new Date().getFullYear();
    const anios: number[] = [];
    for (let i = anioActual; i >= anioActual - 10; i--) {
      anios.push(i);
    }
    return anios;
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
    // Reiniciar paginación y volver a cargar para no limitar por página cuando hay selección
    this.pageIndex = 0;
    this.cargarCargas();
  }

  aplicarFiltros(): void {
    const desde = this.fechaDesdeSeleccionada ? new Date(this.fechaDesdeSeleccionada) : null;
    const hasta = this.fechaHastaSeleccionada ? new Date(this.fechaHastaSeleccionada) : null;
    if (desde) desde.setHours(0,0,0,0);
    if (hasta) hasta.setHours(23,59,59,999);

    this.cargasFiltradas = this.cargas.filter(carga => {
      // Filtro por vehículo
      if (this.vehiculoSeleccionado !== null && this.vehiculoSeleccionado !== undefined) {
        if (Number(carga.idVehiculo) !== Number(this.vehiculoSeleccionado)) {
          return false;
        }
      }

      // Filtro por fecha desde
      const fechaCarga = new Date(carga.fechaCarga);
      if (desde && fechaCarga < desde) {
        return false;
      }

      // Filtro por fecha hasta
      if (hasta && fechaCarga > hasta) {
        return false;
      }

      return true;
    });

    console.log(`🔍 Filtros aplicados. Mostrando ${this.cargasFiltradas.length} de ${this.cargas.length} cargas`);
  }

  editarCarga(carga: CargaCombustible): void {
    if (this.isOperador) {
      alert('Tu rol no tiene permisos para editar cargas.');
      return;
    }
    const dialogRef = this.dialog.open(DialogoEditarCargaComponent, {
      width: '95vw',
      maxWidth: '95vw',
      maxHeight: '90vh',
      data: { carga }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        this.successMessage = '¡Carga de combustible actualizada exitosamente!';
        this.cargarCargas(); // Recargar la lista de cargas
        setTimeout(() => this.successMessage = '', 5000);
      }
    });
  }

  eliminarCarga(carga: CargaCombustible): void {
    if (this.isOperador) {
      alert('Tu rol no tiene permisos para eliminar cargas.');
      return;
    }
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

  formatearFecha(fecha: string | Date): string {
    if (!fecha) return '';
    let soloFecha = '';
    if (fecha instanceof Date) {
      soloFecha = fecha.toISOString().substring(0, 10);
    } else {
      soloFecha = fecha.substring(0, 10);
    }
    const partes = soloFecha.split('-');
    if (partes.length === 3) {
      // Mostrar la fecha tal como viene del backend, sin sumar días
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return soloFecha;
  }
}
