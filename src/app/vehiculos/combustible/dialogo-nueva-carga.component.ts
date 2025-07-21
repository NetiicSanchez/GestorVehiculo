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
    MatProgressSpinnerModule
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
          <mat-label>Número de Factura</mat-label>
          <input matInput formControlName="numeroFactura">
        </mat-form-field>

        <!-- Proveedor -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Proveedor/Estación</mat-label>
          <input matInput formControlName="proveedor">
        </mat-form-field>

        <!-- Foto de Factura -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>URL Foto de Factura</mat-label>
          <input matInput formControlName="fotoFactura">
        </mat-form-field>

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
    .dialog-content {
      min-width: 400px;
      max-width: 500px;
    }
    
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
    
    mat-dialog-actions {
      padding: 16px 0;
      margin: 0;
    }
  `]
})
export class DialogoNuevaCargaComponent implements OnInit {
  formulario!: FormGroup;
  vehiculos: Vehiculo[] = [];
  tiposCombustible: any[] = [];
  usuarios: any[] = [];
  guardando = false;
  totalCalculado = 0;

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
      numeroFactura: [''],
      proveedor: [''],
      fotoFactura: [''],
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
        console.log('🔥 Respuesta tipos combustible:', response);
        if (response.success) {
          this.tiposCombustible = response.data;
          console.log('🔥 Tipos de combustible cargados:', this.tiposCombustible);
        } else {
          console.error('Error en respuesta de tipos combustible:', response);
        }
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
      
      const carga = {
        id_vehiculo: this.formulario.value.idVehiculo,
        id_tipo_combustible: this.formulario.value.idTipoCombustible,
        id_usuario: this.formulario.value.idUsuario || null,
        fecha_carga: this.formulario.value.fechaCarga,
        galones_cargados: this.formulario.value.galones,
        precio_galon: this.formulario.value.precioGalon,
        total_pagado: this.totalCalculado,
        kilometraje_actual: this.formulario.value.kilometraje,
        numero_factura: this.formulario.value.numeroFactura || null,
        proveedor_combustible: this.formulario.value.proveedor || null,
        foto_factura: this.formulario.value.fotoFactura || null,
        observaciones: this.formulario.value.observaciones || null,
        activo: true
      };

      console.log('💾 Guardando carga de combustible:', carga);

      this.combustiblesService.registrarCarga(carga as any).subscribe({
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
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.formulario.controls).forEach(key => {
        this.formulario.get(key)?.markAsTouched();
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close();
  }
}
