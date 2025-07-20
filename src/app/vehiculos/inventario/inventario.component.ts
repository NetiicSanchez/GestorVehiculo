import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { VehiculosService } from '../../services/vehiculos.service';
import { Vehiculo } from '../../models/vehiculo.model';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['placa', 'marca', 'modelo', 'anio', 'tipoVehiculo', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Vehiculo>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filtroTexto: string = '';
  cargando: boolean = false;
  errorCarga: string = '';
  maxReintentos: number = 3;
  reintentoActual: number = 0;
  private routerSubscription: Subscription = new Subscription();

  constructor(
    private vehiculosService: VehiculosService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    // Escuchar cambios de navegación para recargar datos cuando regrese de agregar vehículo
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log('🔄 Navegación detectada a:', event.url);
      if (event.url === '/vehiculos/inventario') {
        console.log('📋 Recargando inventario por navegación...');
        // Pequeño delay para asegurar que el componente esté listo
        setTimeout(() => {
          this.cargarVehiculos();
        }, 100);
      }
    });
  }

  ngOnInit(): void {
    this.cargarVehiculos();
  }

  ngOnDestroy(): void {
    this.routerSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarVehiculos(): void {
    this.cargando = true;
    this.errorCarga = '';
    console.log('🔄 Cargando vehículos...');
    
    // Timeout manual adicional
    const timeoutId = setTimeout(() => {
      this.cargando = false;
      this.errorCarga = 'La carga está tardando demasiado. Verifique su conexión.';
    }, 15000); // 15 segundos
    
    this.vehiculosService.obtenerVehiculos().subscribe({
      next: (response: any) => {
        clearTimeout(timeoutId);
        console.log('📋 Respuesta del servidor:', response);
        
        // Manejar diferentes formatos de respuesta
        let vehiculos = [];
        if (response.success && response.data) {
          vehiculos = response.data;
        } else if (Array.isArray(response)) {
          vehiculos = response;
        } else {
          console.warn('⚠️ Formato de respuesta inesperado:', response);
          vehiculos = [];
        }
        
        this.dataSource.data = vehiculos;
        console.log(`✅ ${vehiculos.length} vehículos cargados`);
        this.cargando = false;
        this.reintentoActual = 0;
      },
      error: (error: any) => {
        clearTimeout(timeoutId);
        console.error('❌ Error al cargar vehículos:', error);
        this.manejarErrorCarga(error);
      }
    });
  }

  private manejarErrorCarga(error: any): void {
    this.cargando = false;
    this.reintentoActual++;
    
    const mensaje = error.message || 'Error al cargar los vehículos';
    this.errorCarga = mensaje;
    
    if (this.reintentoActual < this.maxReintentos) {
      console.log(`🔄 Reintentando carga (${this.reintentoActual}/${this.maxReintentos})...`);
      this.mostrarMensaje(`${mensaje}. Reintentando... (${this.reintentoActual}/${this.maxReintentos})`);
      
      // Esperar un poco antes de reintentar
      setTimeout(() => {
        this.cargarVehiculos();
      }, 2000);
    } else {
      this.dataSource.data = [];
      this.mostrarMensaje(`${mensaje}. Use el botón Reintentar para volver a cargar.`);
    }
  }

  reintentarCarga(): void {
    this.reintentoActual = 0;
    this.cargarVehiculos();
  }

  // Método para forzar recarga manual
  actualizarInventario(): void {
    console.log('🔄 Actualización manual del inventario solicitada');
    this.cargarVehiculos();
  }

  aplicarFiltro(): void {
    this.dataSource.filter = this.filtroTexto.trim().toLowerCase();
  }

  limpiarFiltro(): void {
    this.filtroTexto = '';
    this.dataSource.filter = '';
  }

  agregarVehiculo(): void {
    this.router.navigate(['/vehiculos/agregar']);
  }

  verDetalle(vehiculo: Vehiculo): void {
    console.log('🔍 Ver detalle del vehículo:', vehiculo);
    console.log('🔍 ID del vehículo:', vehiculo.id);
    console.log('🔍 Navegando a:', `/vehiculos/detalle/${vehiculo.id}`);
    this.router.navigate(['/vehiculos/detalle', vehiculo.id]);
  }

  editarVehiculo(vehiculo: Vehiculo): void {
    console.log('✏️ Editar vehículo:', vehiculo);
    console.log('✏️ ID del vehículo:', vehiculo.id);
    console.log('✏️ Navegando a:', `/vehiculos/editar/${vehiculo.id}`);
    this.router.navigate(['/vehiculos/editar', vehiculo.id]);
  }

  eliminarVehiculo(vehiculo: Vehiculo): void {
    if (confirm(`¿Está seguro de eliminar el vehículo con placa ${vehiculo.placa}?`)) {
      this.vehiculosService.eliminarVehiculo(vehiculo.id!).subscribe({
        next: () => {
          this.mostrarMensaje('Vehículo eliminado exitosamente');
          this.cargarVehiculos();
        },
        error: (error: any) => {
          console.error('Error al eliminar vehículo:', error);
          this.mostrarMensaje('Error al eliminar el vehículo');
        }
      });
    }
  }

  exportarDatos(): void {
    // Implementar exportación a Excel/PDF
    this.mostrarMensaje('Funcionalidad en desarrollo');
  }

  private mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}
