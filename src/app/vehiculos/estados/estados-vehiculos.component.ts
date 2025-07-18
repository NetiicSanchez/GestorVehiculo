import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { CatalogosService } from '../../services/catalogos.service';
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

  constructor(private catalogosService: CatalogosService) { }

  ngOnInit(): void {
    this.cargarEstados();
  }

  cargarEstados(): void {
    this.catalogosService.obtenerEstadosVehiculo().subscribe({
      next: (estados: EstadoVehiculo[]) => this.estados = estados,
      error: (error: any) => console.error('Error cargando estados:', error)
    });
  }

  agregarEstado(): void {
    if (this.nuevoEstado.nombre.trim()) {
      this.catalogosService.agregarEstadoVehiculo(this.nuevoEstado).subscribe({
        next: (response: any) => {
          // Recargar la lista después de agregar
          this.cargarEstados();
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
    this.catalogosService.eliminarEstadoVehiculo(id).subscribe({
      next: (response: any) => {
        // Recargar la lista después de eliminar
        this.cargarEstados();
      },
      error: (error: any) => console.error('Error eliminando estado:', error)
    });
  }
}
