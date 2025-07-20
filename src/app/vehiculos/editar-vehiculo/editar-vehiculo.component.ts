import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VehiculosService } from '../../services/vehiculos.service';
import { CatalogosService } from '../../services/catalogos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Vehiculo } from '../../models/vehiculo.model';

@Component({
  selector: 'app-editar-vehiculo',
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
    MatProgressSpinnerModule
  ],
  templateUrl: './editar-vehiculo.component.html',
  styleUrls: ['./editar-vehiculo.component.css']
})
export class EditarVehiculoComponent implements OnInit {
  vehiculoForm: FormGroup;
  vehiculoId: number;
  cargando: boolean = false;
  tiposVehiculos: any[] = [];
  gruposVehiculos: any[] = [];
  estadosVehiculos: any[] = [];
  tiposCombustible: any[] = [];
  usuarios: any[] = [];

  constructor(
    private fb: FormBuilder,
    private vehiculosService: VehiculosService,
    private catalogosService: CatalogosService,
    private usuariosService: UsuariosService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.vehiculoForm = this.fb.group({
      numero_placa: ['', [Validators.required, Validators.maxLength(30)]],
      marca: ['', [Validators.required, Validators.maxLength(50)]],
      modelo: ['', [Validators.required, Validators.maxLength(50)]],
      anio: ['', [Validators.required, Validators.min(1900), Validators.max(2030)]],
      color: ['', [Validators.required, Validators.maxLength(30)]],
      numero_motor: ['', [Validators.required, Validators.maxLength(50)]],
      kilometraje: ['', [Validators.required, Validators.min(0)]],
      tipo_id: ['', Validators.required],
      grupo_id: ['', Validators.required],
      estado_id: ['', Validators.required],
      combustible_id: ['', Validators.required],
      observaciones: [''],
      foto_vehiculo: [''],
      fecha_asignacion: [''],
      id_usuario_asignado: ['']
    });
    this.vehiculoId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    console.log('🔄 Inicializando editar vehículo, ID:', this.vehiculoId);
    this.cargarCatalogos();
    this.cargarUsuarios();
    this.cargarVehiculo();
  }

  cargarCatalogos(): void {
    // Cargar tipos de vehículos
    this.catalogosService.obtenerTiposVehiculo().subscribe({
      next: (data: any) => this.tiposVehiculos = data,
      error: (error: any) => console.error('Error al cargar tipos de vehículos:', error)
    });

    // Cargar grupos de vehículos
    this.catalogosService.obtenerGruposVehiculo().subscribe({
      next: (data: any) => this.gruposVehiculos = data,
      error: (error: any) => console.error('Error al cargar grupos de vehículos:', error)
    });

    // Cargar estados de vehículos
    this.catalogosService.obtenerEstadosVehiculo().subscribe({
      next: (data: any) => this.estadosVehiculos = data,
      error: (error: any) => console.error('Error al cargar estados de vehículos:', error)
    });

    // Cargar tipos de combustible
    this.catalogosService.obtenerTiposCombustible().subscribe({
      next: (data: any) => this.tiposCombustible = data,
      error: (error: any) => console.error('Error al cargar tipos de combustible:', error)
    });
  }

  cargarUsuarios(): void {
    console.log('👥 Cargando usuarios...');
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (response: any) => {
        console.log('✅ Respuesta completa del servicio de usuarios:', response);
        if (response.success && response.data) {
          this.usuarios = response.data;
          console.log('📝 usuarios asignados desde response.data:', this.usuarios);
        } else if (Array.isArray(response)) {
          this.usuarios = response;
          console.log('📝 usuarios asignados desde array directo:', this.usuarios);
        } else {
          console.log('❌ Formato de respuesta inesperado:', response);
          this.usuarios = [];
        }
        console.log('� Estado final del array usuarios:', this.usuarios);
        console.log('🔍 Cantidad de usuarios:', this.usuarios.length);
      },
      error: (error: any) => {
        console.error('❌ Error al cargar usuarios:', error);
        this.usuarios = [];
      }
    });
  }

  cargarVehiculo(): void {
    console.log('🚗 Cargando vehículo con ID:', this.vehiculoId);
    this.cargando = true;
    
    this.vehiculosService.obtenerVehiculoPorId(this.vehiculoId).subscribe({
      next: (response: any) => {
        console.log('✅ Vehículo cargado:', response);
        
        // Manejar diferentes formatos de respuesta
        let vehiculo = response;
        if (response.success && response.data) {
          vehiculo = response.data;
        }
        
        // Mapear los campos correctamente - ASEGURAR que todos tengan valores válidos
        this.vehiculoForm.patchValue({
          numero_placa: vehiculo.placa || '',
          marca: vehiculo.marca || '',
          modelo: vehiculo.modelo || '',
          anio: vehiculo.anio || new Date().getFullYear(),
          color: vehiculo.color || '',
          numero_motor: vehiculo.numero_serie || '',
          kilometraje: vehiculo.kilometraje_actual || vehiculo.kilometraje_inicial || 0,
          tipo_id: vehiculo.id_tipo_vehiculo || '',
          grupo_id: vehiculo.id_grupo_vehiculo || '',
          estado_id: vehiculo.id_estado_vehiculo || '',
          combustible_id: vehiculo.id_tipo_combustible || '',
          observaciones: vehiculo.observaciones || '',
          foto_vehiculo: vehiculo.foto_vehiculo || '',
          fecha_asignacion: this.formatearFechaParaInput(vehiculo.fecha_asignacion),
          id_usuario_asignado: vehiculo.id_usuario_asignado || ''
        });
        
        this.cargando = false;
      },
      error: (error: any) => {
        console.error('❌ Error al cargar vehículo:', error);
        this.snackBar.open('Error al cargar el vehículo', 'Cerrar', { duration: 3000 });
        this.cargando = false;
      }
    });
  }

  onSubmit(): void {
    if (this.vehiculoForm.valid) {
      this.cargando = true;
      console.log('📝 Actualizando vehículo:', this.vehiculoForm.value);
      
      // Mapear los datos del formulario al formato del backend - ASEGURAR valores válidos
      const vehiculoData = {
        placa: this.vehiculoForm.value.numero_placa || '',
        marca: this.vehiculoForm.value.marca || '',
        modelo: this.vehiculoForm.value.modelo || '',
        anio: parseInt(this.vehiculoForm.value.anio) || new Date().getFullYear(),
        color: this.vehiculoForm.value.color || '',
        numeroSerie: this.vehiculoForm.value.numero_motor || '',
        kilometrajeActual: parseInt(this.vehiculoForm.value.kilometraje) || 0,
        idTipoVehiculo: parseInt(this.vehiculoForm.value.tipo_id) || 1,
        idGrupoVehiculo: parseInt(this.vehiculoForm.value.grupo_id) || 1,
        idEstadoVehiculo: parseInt(this.vehiculoForm.value.estado_id) || 1,
        idTipoCombustible: parseInt(this.vehiculoForm.value.combustible_id) || 1,
        observaciones: this.vehiculoForm.value.observaciones || '',
        foto_vehiculo: this.vehiculoForm.value.foto_vehiculo || '',
        fechaAsignacion: this.vehiculoForm.value.fecha_asignacion || '',
        idUsuarioAsignado: this.vehiculoForm.value.id_usuario_asignado ? parseInt(this.vehiculoForm.value.id_usuario_asignado) : null
      };
      
      console.log('� DEBUG FRONTEND - Valores del formulario:', this.vehiculoForm.value);
      console.log('🔍 DEBUG FRONTEND - Datos mapeados:', vehiculoData);
      console.log('🔍 DEBUG FRONTEND - Tipos de datos:', {
        tipo_id: typeof this.vehiculoForm.value.tipo_id,
        grupo_id: typeof this.vehiculoForm.value.grupo_id,
        estado_id: typeof this.vehiculoForm.value.estado_id,
        combustible_id: typeof this.vehiculoForm.value.combustible_id,
        fecha_asignacion: typeof this.vehiculoForm.value.fecha_asignacion,
        id_usuario_asignado: typeof this.vehiculoForm.value.id_usuario_asignado
      });
      
      console.log('�📤 Enviando datos al backend:', vehiculoData);
      
      this.vehiculosService.actualizarVehiculo(this.vehiculoId, vehiculoData).subscribe({
        next: (response) => {
          console.log('✅ Vehículo actualizado:', response);
          this.snackBar.open('Vehículo actualizado exitosamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/vehiculos/inventario']);
        },
        error: (error: any) => {
          console.error('❌ Error al actualizar vehículo:', error);
          this.snackBar.open('Error al actualizar el vehículo', 'Cerrar', { duration: 3000 });
          this.cargando = false;
        }
      });
    } else {
      console.log('❌ Formulario inválido:', this.vehiculoForm.errors);
      this.snackBar.open('Por favor complete todos los campos requeridos', 'Cerrar', { duration: 3000 });
    }
  }

  onCancel(): void {
    this.router.navigate(['/vehiculos/inventario']);
  }

  // Método para formatear fecha para input datetime-local
  private formatearFechaParaInput(fecha: string): string {
    if (!fecha) return '';
    
    try {
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) return '';
      
      // Formato requerido: YYYY-MM-DDTHH:mm
      const año = fechaObj.getFullYear();
      const mes = String(fechaObj.getMonth() + 1).padStart(2, '0');
      const dia = String(fechaObj.getDate()).padStart(2, '0');
      const horas = String(fechaObj.getHours()).padStart(2, '0');
      const minutos = String(fechaObj.getMinutes()).padStart(2, '0');
      
      return `${año}-${mes}-${dia}T${horas}:${minutos}`;
    } catch (error) {
      console.error('Error al formatear fecha:', error);
      return '';
    }
  }
}
