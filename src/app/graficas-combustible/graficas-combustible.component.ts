import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { curveBasis } from 'd3-shape';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { VehiculosService } from '../services/vehiculos.service';
import { CombustibleService } from '../services/combustible.service';
import { Vehiculo } from '../models/vehiculo.model';

import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-graficas-combustible',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxChartsModule],
  templateUrl: './graficas-combustible.component.html',
  styleUrls: ['./graficas-combustible.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class GraficasCombustibleComponent implements OnInit {

  vehiculos: Vehiculo[] = [];
  selectedVehiculoId: number | null = null;

  // Gráfico de Gastos
  gastosData: any[] = [];
  gastosColorScheme: Color = {
    name: 'gastosScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#00bfff'] // azul vibrante
  };

  // Gráfico de Rendimiento
  rendimientoData: any[] = [];
  rendimientoColorScheme: Color = {
    name: 'rendimientoScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#00bfff'] // azul vibrante
  };

  // Opciones de los gráficos
  view: [number, number] = [700, 400];
  showXAxis = true;
  showYAxis = true;
  gradient = false; // sin relleno
  curve = curveBasis; // curva suave para ngx-charts
  timeline = true; // eje X tipo tiempo
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabelGastos = 'Fecha de Carga';
  xAxisLabelRendimiento = 'Fecha de Carga';
  showYAxisLabel = true;
  yAxisLabelGastos = 'Costo de Carga';
  yAxisLabelRendimiento = 'Rendimiento (Km/Galón)';

  constructor(
    private vehiculosService: VehiculosService,
    private combustibleService: CombustibleService,
    private router: Router
  ) { }
  registrarGastoAdicional() {
    // Aquí puedes poner la lógica para registrar gasto adicional
    // Por ahora solo muestra un alert
    alert('Funcionalidad de registrar gasto adicional');
  }

  irAGraficaRendimiento() {
    // Cambia la ruta a la gráfica de rendimiento por galón
    this.router.navigate(['/graficas-rendimiento']);
  }

  ngOnInit(): void {
    this.loadVehiculos();
  }

  loadVehiculos(): void {
    console.log('Obteniendo vehículos...');
    this.vehiculosService.getVehiculos().subscribe(response => {
      if (response.success) {
        this.vehiculos = response.data;
        console.log('Vehículos recibidos:', response);
      } else {
        console.error('Error al obtener vehículos:', response.message);
      }
    });
  }

  onVehiculoChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const vehiculoId = target.value ? parseInt(target.value, 10) : null;
    this.selectedVehiculoId = vehiculoId;
    if (vehiculoId) {
      this.loadGraficasData(vehiculoId);
    } else {
      this.gastosData = [];
      this.rendimientoData = [];
    }
  }

  loadGraficasData(vehiculoId: number): void {
    // Cargar datos de gastos
    this.combustibleService.getGastosCombustiblePorVehiculo(vehiculoId).subscribe(response => {
      console.log('Gastos recibidos:', response);
      if (response.success) {
        const data = response.data.map((item: any) => ({
          name: new Date(item.fecha_carga),
          value: item.costo_total
        }));
        this.gastosData = [{ name: 'Costo de Carga', series: data }];
      } else {
        this.gastosData = [];
      }
    });

    // Cargar datos de rendimiento
    this.combustibleService.getRendimientoVehiculo(vehiculoId).subscribe(response => {
      console.log('Rendimiento recibido:', response);
      if (response.success) {
        const data = response.data.map((item: any) => ({
          name: new Date(item.fecha),
          value: item.rendimiento
        }));
        this.rendimientoData = [{ name: 'Rendimiento (Km/Galón)', series: data }];
      } else {
        this.rendimientoData = [];
      }
    });
  }
}
