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

  constructor(
    private fb: FormBuilder,
    private vehiculosService: VehiculosService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.vehiculoForm = this.fb.group({
      placa: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio: ['', Validators.required],
      // Agregar más campos según necesites
    });
    this.vehiculoId = +this.route.snapshot.paramMap.get('id')!;
  }

  ngOnInit(): void {
    this.cargarVehiculo();
  }

  cargarVehiculo(): void {
    this.vehiculosService.obtenerVehiculoPorId(this.vehiculoId).subscribe({
      next: (vehiculo: Vehiculo) => {
        this.vehiculoForm.patchValue(vehiculo);
      },
      error: (error: any) => {
        console.error('Error al cargar vehículo:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.vehiculoForm.valid) {
      this.cargando = true;
      const vehiculo: Vehiculo = this.vehiculoForm.value;
      
      this.vehiculosService.actualizarVehiculo(this.vehiculoId, vehiculo).subscribe({
        next: () => {
          this.snackBar.open('Vehículo actualizado exitosamente', 'Cerrar', { duration: 3000 });
          this.router.navigate(['/vehiculos/detalle', this.vehiculoId]);
        },
        error: (error: any) => {
          console.error('Error al actualizar vehículo:', error);
          this.cargando = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/vehiculos/detalle', this.vehiculoId]);
  }
}
