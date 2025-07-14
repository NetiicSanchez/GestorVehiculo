import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatChipsModule } from '@angular/material/chips';
import { VehiculosService } from '../../services/vehiculos.service';
import { Vehiculo } from '../../models/vehiculo.model';

@Component({
  selector: 'app-detalle-vehiculo',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatChipsModule
  ],
  templateUrl: './detalle-vehiculo.component.html',
  styleUrls: ['./detalle-vehiculo.component.css']
})
export class DetalleVehiculoComponent implements OnInit {
  vehiculo: Vehiculo | null = null;
  cargando: boolean = false;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private vehiculosService: VehiculosService
  ) { }

  ngOnInit(): void {
    this.cargarVehiculo();
  }

  cargarVehiculo(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cargando = true;
      this.vehiculosService.getVehiculoPorId(+id).subscribe({
        next: (vehiculo: Vehiculo) => {
          this.vehiculo = vehiculo;
          this.cargando = false;
        },
        error: (error: any) => {
          this.error = 'Error al cargar el vehículo';
          this.cargando = false;
        }
      });
    }
  }

  editarVehiculo(): void {
    if (this.vehiculo?.id) {
      this.router.navigate(['/vehiculos/editar', this.vehiculo.id]);
    }
  }

  volver(): void {
    this.router.navigate(['/vehiculos/inventario']);
  }
}
