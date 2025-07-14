import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { VehiculosService } from '../../services/vehiculos.service';
import { EstadoVehiculo } from '../../models/vehiculo.model';

@Component({
  selector: 'app-estados-vehiculos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule
  ],
  templateUrl: './estados-vehiculos.component.html',
  styleUrls: ['./estados-vehiculos.component.css']
})
export class EstadosVehiculosComponent implements OnInit {
  estados: EstadoVehiculo[] = [];
  nuevoEstado = {
    nombre: '',
    descripcion: '',
    color: '',
    activo: true,
    fechaCreacion: new Date()
  };

  constructor(private vehiculosService: VehiculosService) { }

  ngOnInit(): void {
    this.cargarEstados();
  }

  cargarEstados(): void {
    this.vehiculosService.getEstadosVehiculo().subscribe({
      next: (estados: EstadoVehiculo[]) => this.estados = estados,
      error: (error: any) => console.error('Error cargando estados:', error)
    });
  }

  agregarEstado(): void {
    if (this.nuevoEstado.nombre.trim()) {
      this.vehiculosService.agregarEstadoVehiculo(this.nuevoEstado).subscribe({
        next: (estados: EstadoVehiculo[]) => {
          this.estados = estados;
          this.nuevoEstado = {
            nombre: '',
            descripcion: '',
            color: '',
            activo: true,
            fechaCreacion: new Date()
          };
        },
        error: (error: any) => console.error('Error agregando estado:', error)
      });
    }
  }

  eliminarEstado(id: number): void {
    this.vehiculosService.eliminarEstadoVehiculo(id).subscribe({
      next: (estados: EstadoVehiculo[]) => this.estados = estados,
      error: (error: any) => console.error('Error eliminando estado:', error)
    });
  }
}
