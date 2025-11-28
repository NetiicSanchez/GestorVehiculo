import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { GastosAdicionalService, GastoAdicional } from '../services/gastos-adicional.service';
import { VehiculosService } from '../services/vehiculos.service';

@Component({
  selector: 'app-gastos-adicional',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule
  ],
  templateUrl: './gastos-adicional.component.html',
  styleUrls: ['./gastos-adicional.component.css']
})
export class GastosAdicionalComponent implements OnInit {
    vehiculoBuscado: string = '';
    gastosFiltrados: any[] = [];
  displayedColumns: string[] = [
    'fecha_gasto', 'vehiculo', 'tipo_gasto', 'monto', 'kilometraje', 'descripcion', 'proveedor', 'acciones'
  ];
  gastosAdicionales: any[] = [];
  gastoForm!: FormGroup;
  vehiculos: any[] = [];
  submitting = false;
  successMessage = '';
  errorMessage = '';
  archivoSeleccionado: File | null = null;
  nombreArchivoSeleccionado = '';
  mostrarVistaPrevia = false;
  gastoEditando: any = null;

  // Paginación y filtro
  pageSize = 20;
  pageIndex = 0;
  mesFiltro: number | null = null;
  anioFiltro: number | null = null;

  constructor(
    private fb: FormBuilder,
    private gastosService: GastosAdicionalService,
    private vehiculosService: VehiculosService
  ) {}

  ngOnInit(): void {
    this.cargarGastosAdicionales();
    this.gastoForm = this.fb.group({
      id_vehiculo: [null, Validators.required],
      tipo_gasto: ['', Validators.required],
      fecha_gasto: ['', Validators.required],
      descripcion: [''],
      monto: [null, [Validators.required, Validators.min(0)]],
      proveedor: [''],
      observaciones: [''],
      foto_factura: [''],
      kilometraje: [null, [Validators.required, Validators.min(0)]],
      precio_mano_obra: [null],
      repuestos: this.fb.array([])
    });
    this.inicializarRepuestos();
    this.vehiculosService.obtenerVehiculos().subscribe(
      (res) => this.vehiculos = res.data || res,
      (err) => console.error('Error al cargar vehículos:', err)
    );
  }

  get repuestos(): FormArray {
    return this.gastoForm.get('repuestos') as FormArray;
  }

  crearRepuesto(): FormGroup {
    return this.fb.group({
      nombre: [''],
      precio: [null]
    });
  }

  inicializarRepuestos(): void {
    for (let i = 0; i < 5; i++) {
      this.repuestos.push(this.crearRepuesto());
    }
  }

  // Método para manejar la selección de archivos
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona solo archivos de imagen');
        return;
      }
      
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB');
        return;
      }
      
      this.archivoSeleccionado = file;
      this.nombreArchivoSeleccionado = file.name;
      this.mostrarVistaPrevia = true;
      
      console.log('📁 Archivo seleccionado:', file.name, file.size, 'bytes');
    }
  }

  // Método para limpiar el archivo seleccionado
  limpiarArchivo(): void {
    this.archivoSeleccionado = null;
    this.nombreArchivoSeleccionado = '';
    this.mostrarVistaPrevia = false;
  }

  onSubmit(): void {
    if (this.gastoForm.invalid) {
      this.gastoForm.markAllAsTouched();
      return;
    }
    
    this.submitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    // Si hay archivo seleccionado, primero lo subimos
    if (this.archivoSeleccionado) {
      this.subirArchivo().then((urlArchivo) => {
        this.guardarGasto(urlArchivo);
      }).catch((error) => {
        console.error('❌ Error al subir archivo:', error);
        this.errorMessage = 'Error al subir el archivo';
        this.submitting = false;
      });
    } else {
      // Guardar sin foto
      this.guardarGasto(null);
    }
  }

  private async subirArchivo(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!this.archivoSeleccionado) {
        return reject('No hay archivo seleccionado');
      }

      const formData = new FormData();
      formData.append('foto', this.archivoSeleccionado);

      // La URL debe coincidir con la ruta del backend: /api/upload/factura
      const uploadUrl = '/api/upload/factura';

      fetch(uploadUrl, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al subir archivo');
        }
        return response.json();
      })
      .then(data => {
        if (data.success && data.url) {
          console.log('✅ Archivo subido, URL:', data.url);
          resolve(data.url);
        } else {
          reject('La respuesta del servidor no fue exitosa o no contiene la URL');
        }
      })
      .catch(error => {
        console.error('❌ Error en fetch:', error);
        reject(error);
      });
    });
  }

  private guardarGasto(fotoUrl: string | null): void {
  const gasto: GastoAdicional = {
    ...this.gastoForm.value,
    foto_factura: fotoUrl
  };
  if (this.gastoEditando) {
    // Llama al método de actualización en el servicio
    this.gastosService.actualizarGasto(this.gastoEditando.id, gasto).subscribe(
      res => {
        this.successMessage = 'Gasto adicional actualizado correctamente.';
        this.gastoForm.reset();
        this.gastoEditando = null;
        this.limpiarArchivo();
        this.submitting = false;
        this.cargarGastosAdicionales();
        setTimeout(() => this.successMessage = '', 3000);
      },
      err => {
        this.errorMessage = 'Error al actualizar el gasto adicional.';
        this.submitting = false;
      }
    );
  } else {
    this.gastosService.crearGasto(gasto).subscribe(
      res => {
        this.successMessage = 'Gasto adicional guardado correctamente.';
        this.gastoForm.reset();
        this.limpiarArchivo(); // Limpiar archivo seleccionado
        this.submitting = false;
        this.cargarGastosAdicionales(); // Actualizar la tabla
        setTimeout(() => this.successMessage = '', 3000); // Ocultar mensaje de éxito
      },
      err => {
        this.errorMessage = 'Error al guardar el gasto adicional.';
        console.error(err);
        this.submitting = false;
      }
    );
  }
}
  cargarGastosAdicionales(): void {
    const params: any = {
      limit: this.pageSize,
      offset: this.pageIndex * this.pageSize
    };
    if (this.mesFiltro) params.mes = this.mesFiltro;
    if (this.anioFiltro) params.anio = this.anioFiltro;
    this.gastosService.obtenerGastos(params).subscribe(
      (res: any) => {
        this.gastosAdicionales = res.data || res;
        this.gastosFiltrados = [...this.gastosAdicionales];
        if (this.vehiculoBuscado) {
          this.filtrarPorVehiculo();
        }
      },
      (err: any) => console.error('Error al cargar gastos adicionales:', err)
    );
  }

  cambiarPagina(event: any): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.cargarGastosAdicionales();
  }

  filtrarPorMes(): void {
    this.pageIndex = 0;
    this.cargarGastosAdicionales();
  }

  filtrarPorVehiculo(): void {
    if (!this.vehiculoBuscado) {
      this.gastosFiltrados = [...this.gastosAdicionales];
    } else {
      this.gastosFiltrados = this.gastosAdicionales.filter(g => String(g.id_vehiculo) === String(this.vehiculoBuscado));
    }
  }

  obtenerAnios(): number[] {
    const anioActual = new Date().getFullYear();
    const anios: number[] = [];
    for (let i = anioActual; i >= anioActual - 10; i--) {
      anios.push(i);
    }
    return anios;
  }

  editarGasto(gasto: any): void {
    this.gastoEditando = gasto;
    // Formatear la fecha para el input type='date'
    let fechaFormateada = '';
    if (gasto.fecha_gasto) {
      const d = new Date(gasto.fecha_gasto);
      // yyyy-MM-dd
      fechaFormateada = d.toISOString().slice(0, 10);
    }
    this.gastoForm.patchValue({
      ...gasto,
      fecha_gasto: fechaFormateada
    });
  }

  eliminarGasto(gasto: any): void {
    // Implementar lógica de eliminación si lo necesitas
    alert('Funcionalidad de eliminación pendiente');
  }
}
