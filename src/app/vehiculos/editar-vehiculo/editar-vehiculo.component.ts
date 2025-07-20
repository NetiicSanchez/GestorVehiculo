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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
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
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './editar-vehiculo.component.html',
  styleUrls: ['./editar-vehiculo.component.css']
})
export class EditarVehiculoComponent implements OnInit {
  vehiculoForm: FormGroup;
  vehiculoId: number;
  cargando: boolean = false;
  cargandoCatalogos: boolean = false;
  cargandoUsuarios: boolean = false;
  tiposVehiculos: any[] = [];
  gruposVehiculos: any[] = [];
  estadosVehiculos: any[] = [];
  tiposCombustible: any[] = [];
  usuarios: any[] = [];
  
  // Estados para manejar errores
  errorCarga: string = '';
  maxReintentos: number = 3;
  reintentoActual: number = 0;
  
  // Fechas límite para el selector
  fechaMaxima: string;
  fechaMinima: string;

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
    
    // Configurar fechas límite para el selector
    const hoy = new Date();
    const hace20Anos = new Date();
    hace20Anos.setFullYear(hoy.getFullYear() - 20);
    
    this.fechaMaxima = hoy.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    this.fechaMinima = hace20Anos.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  ngOnInit(): void {
    console.log('🔄 Inicializando editar vehículo, ID:', this.vehiculoId);
    this.inicializarComponente();
  }

  private inicializarComponente(): void {
    this.errorCarga = '';
    this.reintentoActual = 0;
    this.cargarDatosIniciales();
  }

  private cargarDatosIniciales(): void {
    this.cargandoCatalogos = true;
    this.cargandoUsuarios = true;
    
    // Cargar en paralelo para mayor eficiencia
    Promise.all([
      this.cargarCatalogos(),
      this.cargarUsuarios()
    ]).then(() => {
      console.log('✅ Todos los catálogos y usuarios cargados');
      this.cargarVehiculo();
    }).catch(error => {
      console.error('❌ Error al cargar datos iniciales:', error);
      this.manejarErrorCarga(error);
    });
  }

  private cargarCatalogos(): Promise<any> {
    return new Promise((resolve, reject) => {
      let catalogosPendientes = 4;
      let errores: any[] = [];

      const completarCarga = () => {
        catalogosPendientes--;
        if (catalogosPendientes === 0) {
          this.cargandoCatalogos = false;
          if (errores.length > 0) {
            reject(errores);
          } else {
            resolve(true);
          }
        }
      };

      // Cargar tipos de vehículos
      this.catalogosService.obtenerTiposVehiculo().subscribe({
        next: (data: any) => {
          this.tiposVehiculos = data;
          completarCarga();
        },
        error: (error: any) => {
          console.error('Error al cargar tipos de vehículos:', error);
          errores.push(error);
          completarCarga();
        }
      });

      // Cargar grupos de vehículos
      this.catalogosService.obtenerGruposVehiculo().subscribe({
        next: (data: any) => {
          this.gruposVehiculos = data;
          completarCarga();
        },
        error: (error: any) => {
          console.error('Error al cargar grupos de vehículos:', error);
          errores.push(error);
          completarCarga();
        }
      });

      // Cargar estados de vehículos
      this.catalogosService.obtenerEstadosVehiculo().subscribe({
        next: (data: any) => {
          this.estadosVehiculos = data;
          completarCarga();
        },
        error: (error: any) => {
          console.error('Error al cargar estados de vehículos:', error);
          errores.push(error);
          completarCarga();
        }
      });

      // Cargar tipos de combustible
      this.catalogosService.obtenerTiposCombustible().subscribe({
        next: (data: any) => {
          this.tiposCombustible = data;
          completarCarga();
        },
        error: (error: any) => {
          console.error('Error al cargar tipos de combustible:', error);
          errores.push(error);
          completarCarga();
        }
      });
    });
  }

  private cargarUsuarios(): Promise<any> {
    return new Promise((resolve, reject) => {
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
          console.log('📝 Estado final del array usuarios:', this.usuarios);
          console.log('🔍 Cantidad de usuarios:', this.usuarios.length);
          this.cargandoUsuarios = false;
          resolve(true);
        },
        error: (error: any) => {
          console.error('❌ Error al cargar usuarios:', error);
          this.usuarios = [];
          this.cargandoUsuarios = false;
          reject(error);
        }
      });
    });
  }

  cargarVehiculo(): void {
    console.log('🚗 Cargando vehículo con ID:', this.vehiculoId);
    this.cargando = true;
    this.errorCarga = '';
    
    this.vehiculosService.obtenerVehiculoPorId(this.vehiculoId).subscribe({
      next: (response: any) => {
        console.log('✅ Vehículo cargado:', response);
        
        // Manejar diferentes formatos de respuesta
        let vehiculo = response;
        if (response.success && response.data) {
          vehiculo = response.data;
        }
        
        console.log('📅 DEBUG FECHA AL CARGAR:', {
          fechaAsignacionOriginal: vehiculo.fecha_asignacion,
          fechaAsignacionLocal: vehiculo.fecha_asignacion_local,
          tipoFecha: typeof vehiculo.fecha_asignacion,
          fechaFormateada: this.formatearFechaParaInput(vehiculo.fecha_asignacion)
        });
        
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
        this.reintentoActual = 0;
      },
      error: (error: any) => {
        console.error('❌ Error al cargar vehículo:', error);
        this.manejarErrorCarga(error);
      }
    });
  }

  private manejarErrorCarga(error: any): void {
    this.cargando = false;
    this.reintentoActual++;
    
    const mensaje = error.message || 'Error al cargar datos';
    this.errorCarga = mensaje;
    
    if (this.reintentoActual < this.maxReintentos) {
      console.log(`🔄 Reintentando carga (${this.reintentoActual}/${this.maxReintentos})...`);
      this.snackBar.open(
        `${mensaje}. Reintentando... (${this.reintentoActual}/${this.maxReintentos})`, 
        'Cerrar', 
        { duration: 3000 }
      );
      
      // Esperar un poco antes de reintentar
      setTimeout(() => {
        this.cargarDatosIniciales();
      }, 2000);
    } else {
      const snackBarRef = this.snackBar.open(
        `${mensaje}. Por favor recargue la página.`, 
        'Recargar', 
        { 
          duration: 0 // No cerrar automáticamente
        }
      );
      
      snackBarRef.onAction().subscribe(() => {
        window.location.reload();
      });
    }
  }

  reintentarCarga(): void {
    this.reintentoActual = 0;
    this.inicializarComponente();
  }

  onSubmit(): void {
    if (this.vehiculoForm.valid) {
      this.cargando = true;
      this.errorCarga = '';
      console.log('📝 Actualizando vehículo:', this.vehiculoForm.value);
      
      // Mapear los datos del formulario al formato del backend - ASEGURAR valores válidos
      const fechaFormulario = this.vehiculoForm.value.fecha_asignacion;
      let fechaParaEnviar = null;
      
      // Procesar fecha de asignación
      if (fechaFormulario && fechaFormulario !== '') {
        try {
          // El input type="date" devuelve una cadena en formato YYYY-MM-DD
          const fechaParaProcesar = new Date(fechaFormulario);
          
          // Establecer hora a mediodía para evitar problemas de zona horaria
          fechaParaProcesar.setHours(12, 0, 0, 0);
          fechaParaEnviar = fechaParaProcesar.toISOString();
          
          console.log('📅 Fecha procesada para envío:', {
            original: fechaFormulario,
            procesada: fechaParaProcesar,
            convertida: fechaParaEnviar,
            tipo: typeof fechaParaEnviar
          });
        } catch (error) {
          console.error('❌ Error al procesar fecha:', error);
          fechaParaEnviar = null;
        }
      } else {
        console.log('⚠️ Fecha vacía o no válida:', fechaFormulario);
      }
      
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
        fechaAsignacion: fechaParaEnviar,
        idUsuarioAsignado: this.vehiculoForm.value.id_usuario_asignado ? parseInt(this.vehiculoForm.value.id_usuario_asignado) : null
      };
      
      // DEBUG ESPECÍFICO PARA FECHA
      console.log('📅 DEBUG FECHA DETALLADO:', {
        valorFormulario: this.vehiculoForm.value.fecha_asignacion,
        tipoValor: typeof this.vehiculoForm.value.fecha_asignacion,
        esVacio: this.vehiculoForm.value.fecha_asignacion === '',
        esNull: this.vehiculoForm.value.fecha_asignacion === null,
        fechaEnData: vehiculoData.fechaAsignacion,
        fechaOriginal: this.vehiculoForm.get('fecha_asignacion')?.value
      });
      
      console.log('📝 DEBUG FRONTEND - Valores del formulario:', this.vehiculoForm.value);
      console.log('🔍 DEBUG FRONTEND - Datos mapeados:', vehiculoData);
      console.log('🔍 DEBUG FRONTEND - Tipos de datos:', {
        tipo_id: typeof this.vehiculoForm.value.tipo_id,
        grupo_id: typeof this.vehiculoForm.value.grupo_id,
        estado_id: typeof this.vehiculoForm.value.estado_id,
        combustible_id: typeof this.vehiculoForm.value.combustible_id,
        fecha_asignacion: typeof this.vehiculoForm.value.fecha_asignacion,
        id_usuario_asignado: typeof this.vehiculoForm.value.id_usuario_asignado
      });
      
      console.log('📤 Enviando datos al backend:', vehiculoData);
      
      // Agregar timeout manual adicional
      const timeoutId = setTimeout(() => {
        this.cargando = false;
        this.snackBar.open('La operación está tardando demasiado. Intente nuevamente.', 'Cerrar', { duration: 5000 });
      }, 20000); // 20 segundos
      
      this.vehiculosService.actualizarVehiculo(this.vehiculoId, vehiculoData).subscribe({
        next: (response) => {
          clearTimeout(timeoutId);
          console.log('✅ Vehículo actualizado:', response);
          this.snackBar.open('Vehículo actualizado exitosamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/vehiculos/inventario']);
        },
        error: (error: any) => {
          clearTimeout(timeoutId);
          console.error('❌ Error al actualizar vehículo:', error);
          
          const mensajeError = error.message || 'Error al actualizar el vehículo';
          this.snackBar.open(mensajeError, 'Cerrar', { duration: 5000 });
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

  // Método para formatear fecha para input de tipo date
  private formatearFechaParaInput(fecha: string): string {
    console.log('🔧 formatearFechaParaInput recibió:', fecha, typeof fecha);
    
    if (!fecha || fecha === null || fecha === 'null') {
      console.log('⚠️ Fecha vacía o null, retornando cadena vacía');
      return '';
    }
    
    try {
      const fechaObj = new Date(fecha);
      if (isNaN(fechaObj.getTime())) {
        console.log('❌ Fecha inválida después de new Date()');
        return '';
      }
      
      // Formatear a YYYY-MM-DD para input type="date"
      const fechaFormateada = fechaObj.toISOString().split('T')[0];
      console.log('✅ Fecha formateada exitosamente:', fechaFormateada);
      return fechaFormateada;
    } catch (error) {
      console.error('❌ Error al formatear fecha:', error);
      return '';
    }
  }
}
