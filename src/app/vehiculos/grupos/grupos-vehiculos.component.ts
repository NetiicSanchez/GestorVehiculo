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
import { GrupoVehiculo } from '../../models/vehiculo.model';

@Component({
  selector: 'app-grupos-vehiculos',
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
  templateUrl: './grupos-vehiculos.component.html',
  styleUrls: ['./grupos-vehiculos.component.css']
})
export class GruposVehiculosComponent implements OnInit {
  grupos: GrupoVehiculo[] = [];
  nuevoGrupo = {
    nombre: '',
    descripcion: '',
    activo: true,
    fechaCreacion: new Date()
  };

  constructor(private vehiculosService: VehiculosService) { }

  ngOnInit(): void {
    this.cargarGrupos();
  }

  cargarGrupos(): void {
    this.vehiculosService.getGruposVehiculo().subscribe({
      next: (grupos: GrupoVehiculo[]) => this.grupos = grupos,
      error: (error: any) => console.error('Error cargando grupos:', error)
    });
  }

  agregarGrupo(): void {
    if (this.nuevoGrupo.nombre.trim()) {
      this.vehiculosService.agregarGrupoVehiculo(this.nuevoGrupo).subscribe({
        next: (grupos: GrupoVehiculo[]) => {
          this.grupos = grupos;
          this.nuevoGrupo = {
            nombre: '',
            descripcion: '',
            activo: true,
            fechaCreacion: new Date()
          };
        },
        error: (error: any) => console.error('Error agregando grupo:', error)
      });
    }
  }

  eliminarGrupo(id: number): void {
    this.vehiculosService.eliminarGrupoVehiculo(id).subscribe({
      next: (grupos: GrupoVehiculo[]) => this.grupos = grupos,
      error: (error: any) => console.error('Error eliminando grupo:', error)
    });
  }
}
