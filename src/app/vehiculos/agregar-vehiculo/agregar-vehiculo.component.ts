import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VehiculosService } from '../../services/vehiculos.service';
import { Vehiculo, TipoVehiculo, GrupoVehiculo, EstadoVehiculo, TipoCombustible } from '../../models/vehiculo.model';

@Component({
  selector: 'app-agregar-vehiculo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './agregar-vehiculo.component.html',
  styleUrls: ['./agregar-vehiculo.component.css']
})
export class AgregarVehiculoComponent implements OnInit {
  vehiculoForm: FormGroup;
  cargando: boolean = false;
  
  // Catálogos
  tiposVehiculos: TipoVehiculo[] = [];
  gruposVehiculos: GrupoVehiculo[] = [];
  estadosVehiculos: EstadoVehiculo[] = [];
  tiposCombustible: TipoCombustible[] = [];

  // Marcas comunes (puedes expandir esta lista)
  marcasComunes: string[] = [
    'Toyota', 'Honda', 'Chevrolet', 'Nissan', 'Hyundai', 'Kia', 'Mazda',
    'Foton','Daewoo','Bajaj','Zusuki','Haojue', 'Yamaha','Italika'
  ];

  anioActual = new Date().getFullYear();

  constructor(
    private fb: FormBuilder,
    private vehiculosService: VehiculosService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.vehiculoForm = this.createForm();
  }

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      // Información básica (obligatoria)
      placa: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      marca: ['', [Validators.required, Validators.minLength(2)]],
      modelo: ['', [Validators.required, Validators.minLength(2)]],
      anio: ['', [Validators.required, Validators.min(1950), Validators.max(new Date().getFullYear() + 1)]],
      
      // Clasificación (IDs)
      idTipoVehiculo: ['', Validators.required],
      idGrupoVehiculo: ['', Validators.required],
      idEstadoVehiculo: ['', Validators.required],
      idTipoCombustible: ['', Validators.required],
      
      // Información opcional
      color: [''],
      numeroSerie: [''],
      kilometrajeInicial: ['', [Validators.min(0)]],
      
      // Estado del sistema
      activo: [true]
    });
  }

  cargarCatalogos(): void {
    // Cargar tipos de vehículos
    this.vehiculosService.getTiposVehiculo().subscribe({
      next: (tipos: TipoVehiculo[]) => this.tiposVehiculos = tipos,
      error: (error: any) => console.error('Error cargando tipos:', error)
    });

    // Cargar grupos
    this.vehiculosService.getGruposVehiculo().subscribe({
      next: (grupos: GrupoVehiculo[]) => this.gruposVehiculos = grupos,
      error: (error: any) => console.error('Error cargando grupos:', error)
    });

    // Cargar estados
    this.vehiculosService.getEstadosVehiculo().subscribe({
      next: (estados: EstadoVehiculo[]) => this.estadosVehiculos = estados,
      error: (error: any) => console.error('Error cargando estados:', error)
    });

    // Cargar tipos de combustible
    this.vehiculosService.getTiposCombustible().subscribe({
      next: (tipos: TipoCombustible[]) => this.tiposCombustible = tipos,
      error: (error: any) => console.error('Error cargando combustibles:', error)
    });
  }

  onSubmit(): void {
    if (this.vehiculoForm.valid) {
      this.cargando = true;
      
      const vehiculo: Vehiculo = {
        ...this.vehiculoForm.value,
        fechaCreacion: new Date()
      };

      this.vehiculosService.agregarVehiculo(vehiculo).subscribe({
        next: (nuevoVehiculo: Vehiculo) => {
          this.mostrarMensaje('Vehículo creado exitosamente');
          this.router.navigate(['/vehiculos/detalle', nuevoVehiculo.id]);
        },
        error: (error: any) => {
          console.error('Error al crear vehículo:', error);
          this.mostrarMensaje('Error al crear el vehículo');
          this.cargando = false;
        }
      });
    } else {
      this.marcarCamposInvalidos();
    }
  }

  onCancel(): void {
    this.router.navigate(['/vehiculos/inventario']);
  }

  validarPlacaUnica(): void {
    const placa = this.vehiculoForm.get('placa')?.value;
    if (placa && placa.length >= 6) {
      this.vehiculosService.validarPlacaUnica(placa).subscribe({
        next: (esUnica: boolean) => {
          if (!esUnica) {
            this.vehiculoForm.get('placa')?.setErrors({ 'placaExistente': true });
          }
        },
        error: (error: any) => console.error('Error validando placa:', error)
      });
    }
  }

  private marcarCamposInvalidos(): void {
    Object.keys(this.vehiculoForm.controls).forEach(key => {
      const control = this.vehiculoForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
  }

  private mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  // Getters para validaciones
  get placa() { return this.vehiculoForm.get('placa'); }
  get marca() { return this.vehiculoForm.get('marca'); }
  get modelo() { return this.vehiculoForm.get('modelo'); }
  get anio() { return this.vehiculoForm.get('anio'); }
  get tipoVehiculo() { return this.vehiculoForm.get('tipoVehiculo'); }
  get grupo() { return this.vehiculoForm.get('grupo'); }
  get estado() { return this.vehiculoForm.get('estado'); }
  get combustible() { return this.vehiculoForm.get('combustible'); }
}
