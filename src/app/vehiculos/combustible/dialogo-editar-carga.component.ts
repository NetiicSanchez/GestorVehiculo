import { Component, Inject, OnInit } from '@angular/core';
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
  selector: 'app-dialogo-editar-carga',
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
  template: `
    <h2 mat-dialog-title>Editar Carga de Combustible</h2>
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
        </mat-form-field>
        <!-- Tipo de Combustible -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Tipo de Combustible</mat-label>
          <mat-select formControlName="idTipoCombustible" required>
            <mat-option *ngFor="let tipo of tiposCombustible" [value]="tipo.id">
              {{tipo.nombre}}
            </mat-option>
          </mat-select>
        </mat-form-field>
        <!-- Fecha de Carga -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Fecha de Carga</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="fechaCarga" required>
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>
        <!-- Galones -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Galones</mat-label>
          <input matInput type="number" step="0.01" formControlName="galones" required>
        </mat-form-field>
        <!-- Precio por Galón -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Precio por Galón</mat-label>
          <input matInput type="number" step="0.01" formControlName="precioGalon" required>
        </mat-form-field>
        <!-- Kilometraje -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Kilometraje</mat-label>
          <input matInput type="number" formControlName="kilometraje" required>
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
          <mat-select formControlName="proveedor">
              <mat-option value="DON ARTURO">DON ARTURO</mat-option>
              <mat-option value="FORMULA 1">FORMULA 1</mat-option>
              <mat-option value="SHELL">SHELL</mat-option>
              <mat-option value="TEXACO">TEXACO</mat-option>
              <mat-option value="PUMA">PUMA</mat-option>
              <mat-option value="OTRO">OTRO</mat-option>
          </mat-select>
        </mat-form-field>
        <!-- Observaciones -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Observaciones</mat-label>
          <textarea matInput formControlName="observaciones" rows="3"></textarea>
        </mat-form-field>
        <!-- Total Calculado -->
        <div class="total-section" *ngIf="totalCalculado > 0">
          <strong>Total: {{totalCalculado | number:'1.2-2'}}</strong>
        </div>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="cancelar()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="formulario.invalid || guardando">
          <span *ngIf="!guardando">Guardar Cambios</span>
          <span *ngIf="guardando">Guardando...</span>
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .dialog-content { width: 100%; max-width: 520px; }
    .full-width { width: 100%; margin-bottom: 16px; }
    .total-section { padding: 16px; background-color: #f5f5f5; border-radius: 4px; margin-top: 16px; text-align: center; font-size: 18px; color: #2e7d32; }
    mat-dialog-actions { padding: 16px 0; margin: 0; }
    @media (max-width: 480px) { .dialog-content { max-width: 100vw; } }
  `]
})
export class DialogoEditarCargaComponent implements OnInit {
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
        observaciones: ['']
      });
    }

    configurarCalculoTotal(): void {
      this.formulario.get('galones')?.valueChanges.subscribe(() => this.calcularTotal());
      this.formulario.get('precioGalon')?.valueChanges.subscribe(() => this.calcularTotal());
    }

    calcularTotal(): void {
      const galones = this.formulario.get('galones')?.value || 0;
      const precio = this.formulario.get('precioGalon')?.value || 0;
      this.totalCalculado = galones * precio;
    }

    cargarDatos(): void {
      this.vehiculosService.obtenerVehiculos().subscribe({
        next: (response: any) => {
          if (response.success) {
            this.vehiculos = response.data;
          }
        }
      });
      this.catalogosService.obtenerTiposCombustible().subscribe({
        next: (response: any) => {
          if (Array.isArray(response)) {
            this.tiposCombustible = response;
          } else if (response && Array.isArray(response.data)) {
            this.tiposCombustible = response.data;
          } else {
            this.tiposCombustible = [];
          }
        }
      });
      this.usuariosService.obtenerUsuarios().subscribe({
        next: (response: any) => {
          if (response.success) {
            this.usuarios = response.data;
          }
        }
      });
    }

    guardar(): void {
      if (this.formulario.valid && this.data && this.data.carga) {
        this.guardando = true;
        let foto = this.fotoActual;
        if (this.archivoSeleccionado) {
          foto = this.archivoSeleccionado.name;
          // Aquí podrías agregar la lógica para subir la imagen si lo deseas
        }
        const payload = {
          id_vehiculo: this.formulario.value.idVehiculo,
          id_tipo_combustible: this.formulario.value.idTipoCombustible,
          id_usuario: this.formulario.value.idUsuario ?? null,
          fecha_carga: new Date(this.formulario.value.fechaCarga).toISOString(),
          galones_cargados: this.formulario.value.galones,
          precio_galon: this.formulario.value.precioGalon,
          total_pagado: this.totalCalculado,
          kilometraje_actual: this.formulario.value.kilometraje,
          numero_factura: this.formulario.value.numeroFactura ?? null,
          proveedor_combustible: (this.formulario.value.proveedor === undefined || this.formulario.value.proveedor === '') ? null : this.formulario.value.proveedor,
          observaciones: (this.formulario.value.observaciones === undefined || this.formulario.value.observaciones === '') ? null : this.formulario.value.observaciones,
          foto_factura: foto ?? null
        };
        this.combustiblesService.actualizarCarga(this.data.carga.id, payload).subscribe({
          next: (response: any) => {
            if (response.success) {
              this.dialogRef.close(response);
            } else {
              alert('Error al actualizar la carga');
              this.guardando = false;
            }
          },
          error: () => {
            alert('Error al actualizar la carga');
            this.guardando = false;
          }
        });
      } else {
        Object.keys(this.formulario.controls).forEach(key => {
          this.formulario.get(key)?.markAsTouched();
        });
      }
    }

    cancelar(): void {
      this.dialogRef.close();
    }
  fotoActual: string | null = null;
  archivoSeleccionado: File | null = null;
  previewUrl: string | null = null;
  formulario!: FormGroup;
  vehiculos: Vehiculo[] = [];
  tiposCombustible: any[] = [];
  usuarios: any[] = [];
  guardando = false;
  totalCalculado = 0;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<DialogoEditarCargaComponent>,
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
    if (this.data && this.data.carga) {
      this.formulario.patchValue({
        idVehiculo: this.data.carga.idVehiculo,
        idTipoCombustible: this.data.carga.idTipoCombustible,
        idUsuario: this.data.carga.idUsuario,
        fechaCarga: new Date(this.data.carga.fechaCarga),
        galones: this.data.carga.galonesCargados,
        precioGalon: this.data.carga.precioGalon,
        kilometraje: this.data.carga.kilometrajeActual,
        numeroFactura: this.data.carga.numeroFactura,
        proveedor: this.data.carga.proveedorCombustible,
        observaciones: this.data.carga.observaciones
      });
      this.fotoActual = this.data.carga.fotoFactura || this.data.carga.foto_factura || null;
      this.calcularTotal();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (!file.type.startsWith('image/')) {
        alert('Por favor seleccione un archivo de imagen válido.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB permitido.');
        return;
      }
      this.archivoSeleccionado = file;
      try {
        if (this.previewUrl) {
          URL.revokeObjectURL(this.previewUrl);
        }
        this.previewUrl = URL.createObjectURL(file);
      } catch {}
    }
  }

  removerArchivo(): void {
    if (this.previewUrl) {
      try { URL.revokeObjectURL(this.previewUrl); } catch {}
    }
    this.previewUrl = null;
    this.archivoSeleccionado = null;
  }
  // ...existing code...

  // ...existing code...
}
