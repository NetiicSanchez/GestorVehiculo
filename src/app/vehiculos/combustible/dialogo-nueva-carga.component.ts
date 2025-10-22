import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

import { CombustiblesService } from '../../services/combustibles.service';
import { VehiculosService } from '../../services/vehiculos.service';
import { CatalogosService } from '../../services/catalogos.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Vehiculo } from '../../models/vehiculo.model';

@Component({
  selector: 'app-dialogo-nueva-carga',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  providers: [
    CombustiblesService,
    VehiculosService,
    CatalogosService,
    UsuariosService
  ],
  template: `
    <h2 mat-dialog-title>Nueva Carga de Combustible</h2>
    
    <form [formGroup]="formulario" (ngSubmit)="guardar()">
      <mat-dialog-content class="dialog-content">
        
        <!-- Vehículo -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Vehículo</mat-label>
          <mat-select formControlName="idVehiculo" required>
            <mat-option *ngFor="let vehiculo of vehiculos" [value]="vehiculo.id">
              {{vehiculo.placa}} - {{vehiculo.marca}} {{vehiculo.modelo}}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="formulario.get('idVehiculo')?.hasError('required')">
            Seleccione un vehículo
          </mat-error>
        </mat-form-field>

        <!-- Tipo de Combustible -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo de Combustible</mat-label>
          <mat-select formControlName="idTipoCombustible" required>
            <mat-option *ngFor="let tipo of tiposCombustible" [value]="tipo.id">
              {{tipo.nombre}}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="formulario.get('idTipoCombustible')?.hasError('required')">
            Seleccione el tipo de combustible
          </mat-error>
        </mat-form-field>

        <!-- Fecha de Carga -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Fecha de Carga</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="fechaCarga" required>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="formulario.get('fechaCarga')?.hasError('required')">
            Seleccione la fecha
          </mat-error>
        </mat-form-field>

        <!-- Galones -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Galones</mat-label>
          <input matInput type="number" step="0.01" formControlName="galones" required>
          <mat-error *ngIf="formulario.get('galones')?.hasError('required')">
            Ingrese los galones
          </mat-error>
          <mat-error *ngIf="formulario.get('galones')?.hasError('min')">
            Los galones deben ser mayor a 0
          </mat-error>
        </mat-form-field>

        <!-- Precio por Galón -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Precio por Galón</mat-label>
          <input matInput type="number" step="0.01" formControlName="precioGalon" required>
          <mat-error *ngIf="formulario.get('precioGalon')?.hasError('required')">
            Ingrese el precio por galón
          </mat-error>
          <mat-error *ngIf="formulario.get('precioGalon')?.hasError('min')">
            El precio debe ser mayor a 0
          </mat-error>
        </mat-form-field>

        <!-- Kilometraje -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Kilometraje</mat-label>
          <input matInput type="number" formControlName="kilometraje" required>
          <mat-error *ngIf="formulario.get('kilometraje')?.hasError('required')">
            Ingrese el kilometraje
          </mat-error>
          <mat-error *ngIf="formulario.get('kilometraje')?.hasError('min')">
            El kilometraje debe ser mayor a 0
          </mat-error>
        </mat-form-field>

        <!-- Usuario Responsable -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Usuario Responsable</mat-label>
          <mat-select formControlName="idUsuario">
            <mat-option *ngFor="let usuario of usuarios" [value]="usuario.id">
              {{usuario.nombre}} {{usuario.apellido}}
            </mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Número de Factura -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Número de Vale/Factura</mat-label>
          <input matInput formControlName="numeroFactura">
        </mat-form-field>

        <!-- Proveedor -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Proveedor/Estación</mat-label>
          <mat-select formControlName="proveedor" required>
              <mat-option value="DON ARTURO">DON ARTURO</mat-option>
              <mat-option value="FORMULA 1">FORMULA 1</mat-option>
              <mat-option value="SHELL">SHELL</mat-option>
              <mat-option value="TEXACO">TEXACO</mat-option>
              <mat-option value="PUMA">PUMA</mat-option>
              <mat-option value="OTRO">OTRO</mat-option>
          </mat-select>
        </mat-form-field>

        <!-- Foto de Factura -->
        <div class="upload-section full-width">
          <label class="upload-label">Foto de Factura</label>
          <input #fileInput type="file" accept="image/*" class="file-input" (change)="onFileSelected($event)" style="display:none">
          <button type="button" mat-raised-button color="primary" class="upload-button" (click)="fileInput.click()">
            <mat-icon>cloud_upload</mat-icon>
            {{ archivoSeleccionado ? archivoSeleccionado.name : 'Seleccionar Foto' }}
          </button>
          <div *ngIf="archivoSeleccionado" class="file-info">
            <small>{{ archivoSeleccionado.name }} ({{ (archivoSeleccionado.size / 1024 / 1024) | number:'1.1-1' }} MB)</small>
          </div>
          <div class="file-error" *ngIf="formulario.get('fotoFactura')?.invalid && (formulario.get('fotoFactura')?.touched || formulario.touched)">
            <mat-icon color="warn">error</mat-icon>
            <span>Selecciona una imagen (máx 5MB).</span>
          </div>
          <!-- Preview -->
          <div *ngIf="previewUrl" class="preview-container">
            <img [src]="previewUrl" alt="Preview factura" class="preview-image" />
            <button type="button" mat-mini-fab color="warn" class="preview-remove" (click)="removerArchivo()" matTooltip="Quitar imagen">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </div>

        <!-- Observaciones -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Observaciones</mat-label>
          <textarea matInput formControlName="observaciones" rows="3"></textarea>
        </mat-form-field>

        <!-- Total Calculado -->
        <div class="total-section" *ngIf="totalCalculado > 0">
          <strong>Total: \${{totalCalculado | number:'1.2-2'}}</strong>
        </div>

      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="cancelar()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" 
                [disabled]="formulario.invalid || guardando">
          <span *ngIf="!guardando">Guardar</span>
          <span *ngIf="guardando">Guardando...</span>
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .dialog-content { width: 100%; max-width: 520px; }
    
    .full-width {
      width: 100%;
      margin-bottom: 16px;
    }
    
    .total-section {
      padding: 16px;
      background-color: #f5f5f5;
      border-radius: 4px;
      margin-top: 16px;
      text-align: center;
      font-size: 18px;
      color: #2e7d32;
    }
    
    mat-dialog-actions { padding: 16px 0; margin: 0; }

    /* Upload styles */
    .upload-section { display: flex; flex-direction: column; gap: 8px; overflow-x: hidden; }
    .file-input { display: none; }
    .upload-button { display: inline-flex; align-items: center; gap: 8px; }
    .file-info small { color: #666; }
    .file-error { display:flex; align-items:center; gap:6px; color: #d32f2f; }
    .preview-container { position: relative; display: block; margin-top: 8px; }
    .preview-image { max-width: 100%; width: 100%; height: auto; border-radius: 6px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
    .preview-remove { position: absolute; top: 6px; right: 6px; }

    /* Mobile tweaks */
    @media (max-width: 480px) {
      .dialog-content { max-width: 100vw; }
      .upload-button { width: 100%; justify-content: center; }
      .preview-image { max-height: 45vh; object-fit: contain; }
    }
  `]
})
export class DialogoNuevaCargaComponent implements OnInit {
  verFoto(ruta: string): void {
    if (ruta) {
      window.open(ruta, '_blank');
    }
  }
  formulario!: FormGroup;
  vehiculos: Vehiculo[] = [];
  tiposCombustible: any[] = [];
  usuarios: any[] = [];
  guardando = false;
  totalCalculado = 0;
  // Propiedades para manejo de archivos
  archivoSeleccionado: File | null = null;
  previewUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogoNuevaCargaComponent>,
    private combustiblesService: CombustiblesService,
    private vehiculosService: VehiculosService,
    private catalogosService: CatalogosService,
    private usuariosService: UsuariosService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.crearFormulario();
    this.cargarDatos();
    this.configurarCalculoTotal();
  }

  crearFormulario(): void {
    this.formulario = this.fb.group({
      idVehiculo: ['', Validators.required],
      idTipoCombustible: ['', Validators.required],
      idUsuario: [''],
      fechaCarga: [new Date(), Validators.required],
      galones: ['', [Validators.required, Validators.min(0.01)]],
      precioGalon: ['', [Validators.required, Validators.min(0.01)]],
      kilometraje: ['', [Validators.required, Validators.min(0)]],
      numeroFactura: ['', Validators.required],
      proveedor: [''],
      fotoFactura: ['', Validators.required],
      observaciones: ['']
    });
  }

  configurarCalculoTotal(): void {
    // Calcular total automáticamente cuando cambien galones o precio
    this.formulario.get('galones')?.valueChanges.subscribe(() => this.calcularTotal());
    this.formulario.get('precioGalon')?.valueChanges.subscribe(() => this.calcularTotal());
  }

  calcularTotal(): void {
    const galones = this.formulario.get('galones')?.value || 0;
    const precio = this.formulario.get('precioGalon')?.value || 0;
    this.totalCalculado = galones * precio;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        alert('Por favor seleccione un archivo de imagen válido.');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB permitido.');
        return;
      }

      this.archivoSeleccionado = file;
      // Generar preview
      try {
        if (this.previewUrl) {
          URL.revokeObjectURL(this.previewUrl);
        }
        this.previewUrl = URL.createObjectURL(file);
      } catch {}
      // Actualizar validación del formulario
      this.formulario.get('fotoFactura')?.setValue(file.name);
      this.formulario.get('fotoFactura')?.markAsTouched();
    }
  }

  removerArchivo(): void {
    if (this.previewUrl) {
      try { URL.revokeObjectURL(this.previewUrl); } catch {}
    }
    this.previewUrl = null;
    this.archivoSeleccionado = null;
    this.formulario.get('fotoFactura')?.setValue('');
    this.formulario.get('fotoFactura')?.markAsTouched();
    this.formulario.get('fotoFactura')?.updateValueAndValidity();
  }

  cargarDatos(): void {
    // Cargar vehículos
    this.vehiculosService.obtenerVehiculos().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.vehiculos = response.data;
        } else {
          console.error('Error en respuesta de vehículos:', response);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar vehículos:', error);
      }
    });

    // Cargar tipos de combustible
    console.log('🔥 Cargando tipos de combustible...');
    this.catalogosService.obtenerTiposCombustible().subscribe({
      next: (response: any) => {
        // Permitir tanto array directo como objeto con data
        if (Array.isArray(response)) {
          this.tiposCombustible = response;
        } else if (response && Array.isArray(response.data)) {
          this.tiposCombustible = response.data;
        } else {
          this.tiposCombustible = [];
        }
        console.log('🔥 Tipos de combustible cargados:', this.tiposCombustible);
      },
      error: (error: any) => {
        console.error('Error al cargar tipos de combustible:', error);
      }
    });

    // Cargar usuarios
    this.usuariosService.obtenerUsuarios().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.usuarios = response.data;
        } else {
          console.error('Error en respuesta de usuarios:', response);
        }
      },
      error: (error: any) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  guardar(): void {
    if (this.formulario.valid) {
      this.guardando = true;
      const formData = new FormData();
      formData.append('id_vehiculo', this.formulario.value.idVehiculo);
      formData.append('id_tipo_combustible', this.formulario.value.idTipoCombustible);
      formData.append('id_usuario', this.formulario.value.idUsuario || '');
      formData.append('fecha_carga', new Date(this.formulario.value.fechaCarga).toISOString());
      formData.append('galones_cargados', this.formulario.value.galones);
      formData.append('precio_galon', this.formulario.value.precioGalon);
      formData.append('total_pagado', this.totalCalculado.toString());
      formData.append('kilometraje_actual', this.formulario.value.kilometraje);
      formData.append('numero_factura', this.formulario.value.numeroFactura || '');
      formData.append('proveedor_combustible', this.formulario.value.proveedor || '');
      formData.append('observaciones', this.formulario.value.observaciones || '');
      formData.append('activo', 'true');
      if (this.archivoSeleccionado) {
        formData.append('foto_factura', this.archivoSeleccionado);
      }

      console.log('💾 Guardando carga de combustible (FormData):', formData);

      this.combustiblesService.registrarCarga(formData).subscribe({
        next: (response: any) => {
          console.log('✅ Carga guardada exitosamente:', response);
          if (response.success) {
            this.dialogRef.close(response);
          } else {
            console.error('❌ Error en respuesta:', response);
            alert('Error al guardar la carga de combustible');
            this.guardando = false;
          }
        },
        error: (error: any) => {
          console.error('❌ Error al guardar carga:', error);
          alert('Error al guardar la carga de combustible');
          this.guardando = false;
        }
      });
    } else {
      console.warn('⚠️ Formulario inválido:', this.formulario.errors);
      Object.keys(this.formulario.controls).forEach(key => {
        this.formulario.get(key)?.markAsTouched();
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
