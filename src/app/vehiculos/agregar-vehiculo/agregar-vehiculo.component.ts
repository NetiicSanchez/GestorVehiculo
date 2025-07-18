import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VehiculosService } from '../../services/vehiculos.service';
import { CatalogosService } from '../../services/catalogos.service';
import { Vehiculo, TipoVehiculo, GrupoVehiculo, EstadoVehiculo, TipoCombustible } from '../../models/vehiculo.model';

@Component({
  selector: 'app-agregar-vehiculo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agregar-vehiculo.component.html',
  styleUrls: ['./agregar-vehiculo.component.css']
})
export class AgregarVehiculoComponent implements OnInit {
  vehiculoForm!: FormGroup;
  tiposVehiculo: TipoVehiculo[] = [];
  gruposVehiculo: GrupoVehiculo[] = [];
  estadosVehiculo: EstadoVehiculo[] = [];
  tiposCombustible: TipoCombustible[] = [];
  
  isLoading = false;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private vehiculosService: VehiculosService,
    private catalogosService: CatalogosService,
    private router: Router
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  createForm(): void {
    this.vehiculoForm = this.fb.group({
      placa: ['', [Validators.required]],
      marca: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      anio: [new Date().getFullYear(), [Validators.required, Validators.min(1900), Validators.max(2030)]],
      color: ['', Validators.required],
      numeroSerie: [''],
      idTipoVehiculo: ['', Validators.required],
      idGrupoVehiculo: ['', Validators.required],
      idEstadoVehiculo: [1], // Disponible por defecto
      idTipoCombustible: ['', Validators.required],
      kilometrajeInicial: [0, [Validators.min(0)]]
    });
  }

  cargarCatalogos(): void {
    this.isLoading = true;
    this.errorMessage = '';

    // Cargar tipos de vehículo
    this.catalogosService.obtenerTiposVehiculo().subscribe({
      next: (tipos) => {
        this.tiposVehiculo = tipos;
        console.log('Tipos de vehículo cargados:', tipos);
      },
      error: (error) => {
        console.error('Error cargando tipos:', error);
        this.errorMessage = 'Error cargando tipos de vehículo';
      }
    });

    // Cargar grupos de vehículo
    this.catalogosService.obtenerGruposVehiculo().subscribe({
      next: (grupos) => {
        this.gruposVehiculo = grupos;
        console.log('Grupos de vehículo cargados:', grupos);
      },
      error: (error) => {
        console.error('Error cargando grupos:', error);
        this.errorMessage = 'Error cargando grupos de vehículo';
      }
    });

    // Cargar estados de vehículo
    this.catalogosService.obtenerEstadosVehiculo().subscribe({
      next: (estados) => {
        this.estadosVehiculo = estados;
        console.log('Estados de vehículo cargados:', estados);
      },
      error: (error) => {
        console.error('Error cargando estados:', error);
        this.errorMessage = 'Error cargando estados de vehículo';
      }
    });

    // Cargar tipos de combustible
    this.catalogosService.obtenerTiposCombustible().subscribe({
      next: (combustibles) => {
        this.tiposCombustible = combustibles;
        console.log('Tipos de combustible cargados:', combustibles);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error cargando combustibles:', error);
        this.errorMessage = 'Error cargando tipos de combustible';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.vehiculoForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const vehiculoData: Vehiculo = {
      ...this.vehiculoForm.value,
      anio: parseInt(this.vehiculoForm.value.anio),
      idTipoVehiculo: parseInt(this.vehiculoForm.value.idTipoVehiculo),
      idGrupoVehiculo: parseInt(this.vehiculoForm.value.idGrupoVehiculo),
      idEstadoVehiculo: parseInt(this.vehiculoForm.value.idEstadoVehiculo),
      idTipoCombustible: parseInt(this.vehiculoForm.value.idTipoCombustible),
      kilometrajeInicial: parseInt(this.vehiculoForm.value.kilometrajeInicial) || 0
    };

    console.log('Enviando vehículo:', vehiculoData);

    this.vehiculosService.crearVehiculo(vehiculoData).subscribe({
      next: (response) => {
        console.log('Vehículo creado exitosamente:', response);
        this.successMessage = 'Vehículo agregado exitosamente';
        this.isSubmitting = false;
        
        // Redirigir inmediatamente al inventario
        setTimeout(() => {
          console.log('🔄 Navegando de vuelta al inventario...');
          this.router.navigate(['/vehiculos/inventario']).then(() => {
            console.log('✅ Navegación completada');
          });
        }, 1500);
      },
      error: (error) => {
        console.error('Error creando vehículo:', error);
        this.errorMessage = error.error?.message || 'Error al agregar el vehículo';
        this.isSubmitting = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.vehiculoForm.controls).forEach(key => {
      const control = this.vehiculoForm.get(key);
      control?.markAsTouched();
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.vehiculoForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.vehiculoForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) return `${fieldName} es requerido`;
      if (field.errors['minlength']) return `${fieldName} debe tener al menos ${field.errors['minlength'].requiredLength} caracteres`;
      if (field.errors['maxlength']) return `${fieldName} no puede exceder ${field.errors['maxlength'].requiredLength} caracteres`;
      if (field.errors['min']) return `${fieldName} debe ser mayor a ${field.errors['min'].min}`;
      if (field.errors['max']) return `${fieldName} debe ser menor a ${field.errors['max'].max}`;
    }
    return '';
  }

  cancelar(): void {
    this.router.navigate(['/vehiculos/inventario']);
  }

  // Método para debugging - mostrar estado del formulario
  getFormStatus(): string {
    if (!this.vehiculoForm) return 'Formulario no inicializado';
    
    const invalidFields: string[] = [];
    Object.keys(this.vehiculoForm.controls).forEach(key => {
      const control = this.vehiculoForm.get(key);
      if (control && control.invalid) {
        invalidFields.push(`${key}: ${Object.keys(control.errors || {}).join(', ')}`);
      }
    });
    
    if (invalidFields.length > 0) {
      return `Campos inválidos: ${invalidFields.join(' | ')}`;
    }
    
    return 'Formulario válido';
  }

  // Verificar si el formulario está listo para enviar
  isFormReady(): boolean {
    return this.vehiculoForm && this.vehiculoForm.valid && !this.isSubmitting;
  }
}
