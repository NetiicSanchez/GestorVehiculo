import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
import { Router } from '@angular/router';
import { VehiculosService } from '../../services/vehiculos.service';
import { CatalogosService } from '../../services/catalogos.service';
import { Vehiculo, TipoVehiculo, GrupoVehiculo, EstadoVehiculo, TipoCombustible } from '../../models/vehiculo.model';

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
export class InventarioComponent implements OnInit {
  displayedColumns: string[] = ['placa', 'marca', 'modelo', 'anio', 'tipoVehiculo', 'estado', 'acciones'];
  dataSource = new MatTableDataSource<Vehiculo>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filtroTexto: string = '';
  cargando: boolean = false;

  // Catálogos para mostrar nombres en lugar de IDs
  tiposVehiculos: TipoVehiculo[] = [];
  gruposVehiculos: GrupoVehiculo[] = [];
  estadosVehiculos: EstadoVehiculo[] = [];
  tiposCombustible: TipoCombustible[] = [];

  constructor(
    private vehiculosService: VehiculosService,
    private catalogosService: CatalogosService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarCatalogos();
    this.cargarVehiculos();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarVehiculos(): void {
    this.cargando = true;
    this.vehiculosService.obtenerVehiculos().subscribe({
      next: (response: any) => {
        this.dataSource.data = response.data || response;
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('Error al cargar vehículos:', error);
        this.mostrarMensaje('Error al cargar los vehículos');
        this.cargando = false;
      }
    });
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
    this.router.navigate(['/vehiculos/detalle', vehiculo.id]);
  }

  editarVehiculo(vehiculo: Vehiculo): void {
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

  cargarCatalogos(): void {
    // Cargar tipos de vehículos
    this.catalogosService.obtenerTiposVehiculo().subscribe({
      next: (tipos: TipoVehiculo[]) => this.tiposVehiculos = tipos,
      error: (error: any) => console.error('Error cargando tipos:', error)
    });

    // Cargar grupos
    this.catalogosService.obtenerGruposVehiculo().subscribe({
      next: (grupos: GrupoVehiculo[]) => this.gruposVehiculos = grupos,
      error: (error: any) => console.error('Error cargando grupos:', error)
    });

    // Cargar estados
    this.catalogosService.obtenerEstadosVehiculo().subscribe({
      next: (estados: EstadoVehiculo[]) => this.estadosVehiculos = estados,
      error: (error: any) => console.error('Error cargando estados:', error)
    });

    // Cargar tipos de combustible
    this.catalogosService.obtenerTiposCombustible().subscribe({
      next: (tipos: TipoCombustible[]) => this.tiposCombustible = tipos,
      error: (error: any) => console.error('Error cargando combustibles:', error)
    });
  }

  // Métodos helper para convertir IDs a nombres
  obtenerNombreTipo(id: number): string {
    const tipo = this.tiposVehiculos.find(t => t.id === id);
    return tipo ? tipo.nombre : `ID: ${id}`;
  }

  obtenerNombreGrupo(id: number): string {
    const grupo = this.gruposVehiculos.find(g => g.id === id);
    return grupo ? grupo.nombre : `ID: ${id}`;
  }

  obtenerNombreEstado(id: number): string {
    const estado = this.estadosVehiculos.find(e => e.id === id);
    return estado ? estado.nombre : `ID: ${id}`;
  }

  obtenerNombreCombustible(id: number): string {
    const combustible = this.tiposCombustible.find(c => c.id === id);
    return combustible ? combustible.nombre : `ID: ${id}`;
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
