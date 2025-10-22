  // ...existing code...
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiculosService } from '../services/vehiculos.service';
import { CombustibleService } from '../services/combustible.service';
import { Vehiculo } from '../models/vehiculo.model';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { curveLinear } from 'd3-shape';

@Component({
  selector: 'app-graficas-gastos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxChartsModule
  ],
  templateUrl: './graficas-gastos.html',
  styleUrls: ['./graficas-gastos.css']
})
export class GraficasGastos implements OnInit {
  // Límites por nombre de vehículo
  limitesCombustible: { [nombre: string]: number } = {
    'TOYOTA 22R - 22R': 300,
    'YAMAHA CRUX 110 - CRUX JZQ': 50,
    'CHEVROLET CMV - PANEL FJG': 150,
    'HAOUJUE NK150 - NK KHK': 70,
    'SUZUKI GN125F - GN LBW':60,
  };
  referenciaCombustible: any[] = [];
  errorGastos: string | null = null;
  errorRendimiento: string | null = null;
    // Devuelve la posición Y en píxeles para la línea horizontal del límite
    getYPosLimite(): number {
      if (!this.gastosData || this.gastosData.length === 0 || !this.view || this.view.length < 2) return 0;
      const limiteSerie = this.gastosData[0];
      if (!limiteSerie || !limiteSerie.series || limiteSerie.series.length === 0) return 0;
      const limite = limiteSerie.series[0].value;
      // Calcular el rango del eje Y
    const allValues = this.gastosData.flatMap(s => s.series.map((p: any) => p.value));
      const minY = Math.min(...allValues);
      const maxY = Math.max(...allValues);
      // Altura del gráfico en píxeles
      const chartHeight = this.view[1];
      // Posición Y invertida (SVG: 0 arriba)
      const y = chartHeight * (1 - (limite - minY) / (maxY - minY));
      return y;
    }
    // Devuelve la posición Y en píxeles para un valor dado (ejemplo: 300)
    getYPosValor(valor: number): number {
      if (!this.gastosData || this.gastosData.length === 0 || !this.view || this.view.length < 2) return 0;
      const allValues = this.gastosData.flatMap((s: any) => s.series.map((p: any) => p.value));
      const minY = Math.min(...allValues);
      const maxY = Math.max(...allValues);
      const chartHeight = this.view[1];
      // Posición Y invertida (SVG: 0 arriba)
      const y = chartHeight * (1 - (valor - minY) / (maxY - minY));
      return y;
    }
  // ...existing code...

  trackByVehiculoId(index: number, vehiculo: Vehiculo): number {
  return vehiculo.id ?? index;
  }
  vehiculos: Vehiculo[] = [];
  selectedVehiculoId: number | null = null;

  // Gráfica de Gastos (NGX-CHARTS)
  gastosData: any[] = [];
  gastosColorScheme: Color = {
    name: 'gastosScheme',
    selectable: true,
    group: ScaleType.Ordinal,
  domain: ['#ff0000', '#00bfff'] // rojo para límite, azul para datos
  };

  // Personalización de estilos para la línea de límite
  gastosCustomColors = [
    { name: 'Límite permitido', value: '#ff0000' }
  ];

  // Gráfica de Rendimiento (NGX-CHARTS)
  rendimientoData: any[] = [];
  rendimientoColorScheme: Color = {
    name: 'rendimientoScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#00bfff'] // azul vibrante
  };
  view: [number, number] = [window.innerWidth > 1200 ? 1100 : window.innerWidth - 80, 450];
  showLegend: boolean = window.innerWidth > 700;
  showXAxis: boolean = true;
  showYAxis: boolean = true;
  gradient: boolean = false;
  curve: any = curveLinear;
  timeline: boolean = true;
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  xAxisLabelGastos: string = 'Fecha de Carga';
  yAxisLabelGastos: string = 'Costo de Carga';
  xAxisLabelRendimiento: string = 'Fecha de Carga';
  yAxisLabelRendimiento: string = 'Distancia recorrida (Km)';

  onResize(event: any) {
    const width = (event?.target as Window)?.innerWidth > 1200 ? 1100 : (event?.target as Window)?.innerWidth - 80;
    this.view = [width, 450];
    this.showLegend = (event?.target as Window)?.innerWidth > 700;
  }


  constructor(
    private vehiculosService: VehiculosService,
    private combustibleService: CombustibleService,
    private cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    window.addEventListener('resize', this.onResize.bind(this));
    this.vehiculosService.obtenerVehiculos().subscribe((response: any) => {
      this.vehiculos = response && response.data ? response.data : [];
      if (this.vehiculos.length > 0 && typeof this.vehiculos[0].id === 'number') {
        this.selectedVehiculoId = Number(this.vehiculos[0].id);
        this.onVehiculoChange();
      }
    });
  }

  onVehiculoChange(): void {
    let nombre = '';
    if (this.selectedVehiculoId) {
      const vehiculo = this.vehiculos.find(v => v.id === this.selectedVehiculoId);
      if (vehiculo) {
        nombre = `${vehiculo.marca} ${vehiculo.modelo} - ${vehiculo.placa}`.trim();
      }
    }
    console.log('Valor de nombre antes de normalizar:', nombre);
      const normalizar = (str: string) => str.replace(/\s+/g, ' ').trim().toLowerCase();
      const nombreNormalizado = normalizar(nombre);
      let limite: number | undefined = undefined;
      if (!nombreNormalizado) {
        console.warn('No se seleccionó vehículo o el nombre está vacío.');
      } else {
        console.log('Vehículo seleccionado:', nombre, '| Normalizado:', nombreNormalizado);
        const clavesNormalizadas = Object.keys(this.limitesCombustible).map(k => normalizar(k));
        console.log('Nombre normalizado:', nombreNormalizado);
        console.log('Claves normalizadas:', clavesNormalizadas);
        for (const key of Object.keys(this.limitesCombustible)) {
          if (normalizar(key) === nombreNormalizado) {
            limite = this.limitesCombustible[key];
            break;
          }
        }
        console.log('Límite encontrado:', limite);
      }
  const idVehiculo = this.selectedVehiculoId ?? 0;
  this.combustibleService.getGastosCombustiblePorVehiculo(idVehiculo).subscribe({
        next: (response: any) => {
          let gastos = response && response.data ? response.data : [];
          let data = Array.isArray(gastos)
            ? gastos
                .map(item => {
                  const fechaValida = item.fecha_carga && String(item.fecha_carga).trim() !== '';
                  let valor = null;
                  if (item.total_pagado !== undefined) {
                    valor = Number(item.total_pagado);
                  } else if (item.costo_total !== undefined) {
                    valor = Number(item.costo_total);
                  }
                  let fechaStr = '';
                  if (fechaValida) {
                    if (typeof item.fecha_carga === 'string') {
                      const match = item.fecha_carga.match(/^\d{4}-\d{2}-\d{2}/);
                      fechaStr = match ? match[0] : item.fecha_carga;
                    } else if (item.fecha_carga instanceof Date) {
                      fechaStr = item.fecha_carga.toISOString().slice(0, 10);
                    } else {
                      const d = new Date(item.fecha_carga);
                      fechaStr = isNaN(d.getTime()) ? String(item.fecha_carga) : d.toISOString().slice(0, 10);
                    }
                  }
                  return fechaValida && Number.isFinite(valor)
                    ? {
                        name: fechaStr,
                        value: valor
                      }
                    : null;
                })
                .filter(point => point !== null)
            : [];
          // Serie de límite horizontal SIEMPRE
          let limiteSerie = null;
          if (data.length > 0) {
            limiteSerie = {
              name: 'Límite permitido', // nombre exacto para customColors
              series: data.map(d => ({ name: d.name, value: limite !== undefined ? limite : 0 }))
            };
            // Ordenar: primero el límite (rojo), luego los datos (azul)
            this.gastosData = [
              limiteSerie,
              { name: 'Costo de Carga', series: data }
            ];
            // Color scheme: rojo para límite, azul para datos
            this.gastosColorScheme = {
              name: 'gastosScheme',
              selectable: true,
              group: ScaleType.Ordinal,
              domain: ['#ff0000', '#00bfff']
            };
            // Custom color para forzar rojo en la serie de límite
            this.gastosCustomColors = [
              { name: 'Límite permitido', value: '#ff0000' }
            ];
            // Color scheme: rojo para límite, azul para datos
            this.gastosColorScheme = {
              name: 'gastosScheme',
              selectable: true,
              group: ScaleType.Ordinal,
              domain: ['#ff0000', '#00bfff']
            };
          } else {
            this.gastosData = [];
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorGastos = 'Error al obtener los datos de gastos.';
          this.gastosData = [];
        }
      });
  this.combustibleService.getRendimientoVehiculo(idVehiculo).subscribe({
        next: (response: any) => {
          console.log('Respuesta rendimiento:', response);
          const rendimiento = response && response.data ? response.data : [];
          console.log('Array rendimiento:', rendimiento);
          let data = Array.isArray(rendimiento)
            ? rendimiento
                .map(item => {
                  const fechaValida = item.fecha_carga && String(item.fecha_carga).trim() !== '';
                  let valor = item.rendimiento !== undefined && item.rendimiento !== null ? Number(item.rendimiento) : null;
                  let fechaStr = '';
                  if (fechaValida) {
                    if (typeof item.fecha_carga === 'string') {
                      const match = item.fecha_carga.match(/^\d{4}-\d{2}-\d{2}/);
                      fechaStr = match ? match[0] : item.fecha_carga;
                    } else if (item.fecha_carga instanceof Date) {
                      fechaStr = item.fecha_carga.toISOString().slice(0, 10);
                    } else {
                      const d = new Date(item.fecha_carga);
                      fechaStr = isNaN(d.getTime()) ? String(item.fecha_carga) : d.toISOString().slice(0, 10);
                    }
                  }
                  return fechaValida && Number.isFinite(valor)
                    ? {
                        name: fechaStr,
                        value: valor
                      }
                    : null;
                })
                .filter(point => point !== null)
            : [];
          console.log('Data procesada para gráfica rendimiento:', data);
          // Ordenar por fecha ascendente usando Date
          data.sort((a, b) => {
            const dateA = new Date(a.name);
            const dateB = new Date(b.name);
            return dateA.getTime() - dateB.getTime();
          });
          if (!data.length) {
            this.errorRendimiento = 'No hay datos de rendimiento para este vehículo.';
          } else {
            this.errorRendimiento = null;
          }
          this.rendimientoData = [{ name: 'Distancia recorrida (Km)', series: data }];
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.errorRendimiento = 'Error al obtener los datos de rendimiento.';
          this.rendimientoData = [];
        }
      });
    }
  }
