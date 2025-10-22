import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BitacoraService } from '../services/bitacora.service';

@Component({
  selector: 'app-bitacora-tabla',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatTooltipModule],
  templateUrl: './bitacora-tabla.component.html',
  styleUrls: ['./bitacora-tabla.component.css']
})
export class BitacoraTablaComponent implements OnInit {
  registros: any[] = [];
  displayedColumns: string[] = [
    'fecha', 'hora', 'vehiculo', 'piloto', 'copiloto', 'kilometraje',
    'llanta_repuesto', 'llave_cruz', 'tricket', 'combustible', 'limpieza',
    'proximo_servicio', 'etiqueta_m', 'lubricante_cadena', 'nivel_aceite', 'agua',
    'vencimiento_licencia', 'luces_intermitentes', 'luz_stop', 'faros', 'liquido_freno',
    'tiempo_casco', 'traje_imp', 'ren_por_galon', 'observacion'
  ];

  constructor(private bitacoraService: BitacoraService) {}

  ngOnInit(): void {
    this.bitacoraService.obtenerBitacoras().subscribe(res => {
      if (res.success && Array.isArray(res.data)) {
        this.registros = res.data;
      } else {
        this.registros = [];
      }
    });
  }
}
