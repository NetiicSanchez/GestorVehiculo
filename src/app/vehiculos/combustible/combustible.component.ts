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
import { TipoCombustible } from '../../models/vehiculo.model';

@Component({
  selector: 'app-combustible',
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
  templateUrl: './combustible.component.html',
  styleUrls: ['./combustible.component.css']
})
export class CombustibleComponent implements OnInit {
  tiposCombustible: TipoCombustible[] = [];
  nuevoTipo = {
    nombre: '',
    descripcion: '',
    activo: true,
    fechaCreacion: new Date()
  };

  constructor(private catalogosService: CatalogosService) { }

  ngOnInit(): void {
    this.cargarTipos();
  }

  cargarTipos(): void {
    this.catalogosService.obtenerTiposCombustible().subscribe({
      next: (tipos: TipoCombustible[]) => this.tiposCombustible = tipos,
      error: (error: any) => console.error('Error cargando tipos:', error)
    });
  }

  agregarTipo(): void {
    if (this.nuevoTipo.nombre.trim()) {
      this.catalogosService.agregarTipoCombustible(this.nuevoTipo).subscribe({
        next: (response: any) => {
          // Recargar la lista después de agregar
          this.cargarTipos();
          this.nuevoTipo = {
            nombre: '',
            descripcion: '',
            activo: true,
            fechaCreacion: new Date()
          };
        },
        error: (error: any) => console.error('Error agregando tipo:', error)
      });
    }
  }

  eliminarTipo(id: number): void {
    this.catalogosService.eliminarTipoCombustible(id).subscribe({
      next: (response: any) => {
        // Recargar la lista después de eliminar
        this.cargarTipos();
      },
      error: (error: any) => console.error('Error eliminando tipo:', error)
    });
  }
}
