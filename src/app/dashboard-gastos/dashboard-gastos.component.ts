import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardService } from '../services/dashboard.service';
import { Color, ScaleType } from '@swimlane/ngx-charts';


@Component({
  selector: 'app-dashboard-gastos',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxChartsModule],
  templateUrl: './dashboard-gastos.component.html',
  styleUrls: ['./dashboard-gastos.component.css']
})
export class DashboardGastosComponent implements OnInit {
  // Controla si se muestra el historial completo por vehículo
  mostrarHistorial: { [vehiculoId: number]: boolean } = {};
  // Guarda los datos completos e históricos por vehículo
  individualChartDataFull: Array<Array<{ name: string, series: Array<{ name: string, value: number }> }>> = [];
  // Formatea los ticks del eje Y con la moneda Q (Quetzal)
  yAxisTickFormatting = (value: number): string => {
    return `Q${value.toLocaleString('es-GT')}`;
  };
  // Formatea los data labels con la moneda Q (Quetzal)
  dataLabelFormatting = (value: number): string => {
    return `Q${value.toLocaleString('es-GT')}`;
  };
  totalGalonesData: any[] = [];
  gastosPorVehiculo = new Map<number, {
  vehiculo_id: number,
  placa: string,
  marca: string,
  modelo: string,
  labels: string[],
  combustible: number[],
  repuestos: number[],
  manoObra: number[],
  galones: number[]
  }>();
  individualChartData: Array<Array<{ name: string, series: Array<{ name: string, value: number }> }>> = [];
  aggregatedChartData: Array<{ name: string, series: Array<{ name: string, value: number }> }> = [];
  aggregatedChartDataFull: Array<{ name: string, series: Array<{ name: string, value: number }> }> = [];
  aggregatedColorScheme: Color = {
    name: 'aggregatedScheme',
    selectable: false,
    group: ScaleType.Ordinal,
    // Combustible, Otros Gastos, Galones (alineado con colores de contorno)
  domain: ['#1a7431', '#6930c3', '#ff6d00', '#808080']
  };
  aggregatedCustomColors = [
  { name: 'Combustible', value: '#1a7431' },
  { name: 'Otros Gastos', value: '#6930c3' },
  { name: 'Mano de Obra', value: '#ff6d00' },
  { name: 'Galones', value: '#808080' }
  ];
  individualColorScheme: Color = {
    name: 'individualScheme',
    selectable: false,
    group: ScaleType.Ordinal,
    // Combustible, Repuestos, Mano de Obra, galones
  domain: ['#1a7431', '#6930c3', '#ff6d00', '#808080']
  };
  individualCustomColors = [
  { name: 'Combustible', value: '#1a7431' },
  { name: 'Repuestos', value: '#6930c3' },
  { name: 'Mano de Obra', value: '#ff6d00' },
  { name: 'Galones', value: '#808080' }
  ];

  constructor(private dashboardService: DashboardService) { }
  private monthNames: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  monthTickFormatting = (val: string): string => {
    const num = parseInt(val, 10);
    if (!isNaN(num) && num >= 1 && num <= 12) {
      return this.monthNames[num - 1];
    }
    return val;
  };

  ngOnInit(): void {
    this.dashboardService.getGastosMensuales().subscribe((resp: any) => {
      this.procesarDatos(resp.data);
      this.prepareIndividualChartData();
  this.prepareAggregatedChartData(resp.data);
    });
  }

  /**
   * Prepara datos individuales para cada vehículo en formato multiserie por mes
   */
  prepareIndividualChartData(): void {
    // Datos completos (historial)
    this.individualChartDataFull = Array.from(this.gastosPorVehiculo.values()).map(veh =>
      veh.labels.map((mes, i) => ({
        name: mes,
        series: [
          { name: 'Combustible', value: veh.combustible[i] },
          { name: 'Repuestos', value: veh.repuestos[i] },
          { name: 'Mano de Obra', value: veh.manoObra[i] },
          { name: 'Galones', value: veh.galones[i] }
        ]
      }))
    );
    // Solo últimos 3 meses por defecto
    this.individualChartData = this.individualChartDataFull.map(arr => arr.slice(-3));
  }
  // Alterna entre vista corta y completa por vehículo
  toggleHistorial(i: number): void {
    this.mostrarHistorial[i] = !this.mostrarHistorial[i];
    this.individualChartData[i] = this.mostrarHistorial[i]
      ? this.individualChartDataFull[i]
      : this.individualChartDataFull[i].slice(-3);
  }
  /**
   * Prepara datos agregados de combustible y otros gastos por mes para todos los vehículos
   */
  /**
   * Prepara datos agregados de combustible y otros gastos por mes en formato multiserie
   */
  prepareAggregatedChartData(data: any[]): void {
    // Recolectar todos los meses únicos y su nombre en español
    const mesesRaw: { mes: string, nombreMes: string }[] = [];
    const mesesSet = new Set<string>();
    data.forEach((item: any) => {
      if (!mesesSet.has(item.mes)) {
        mesesSet.add(item.mes);
        const mesNum = parseInt(item.mes.split('-')[1], 10);
        const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const nombreMes = monthNames[mesNum - 1] + ' ' + item.mes.split('-')[0];
        mesesRaw.push({ mes: item.mes, nombreMes });
      }
    });
    // Ordenar por fecha
    mesesRaw.sort((a, b) => a.mes.localeCompare(b.mes));
    // Inicializar totales por mes usando clave 'mes' (YYYY-MM)
    const totalCombustible: { [mes: string]: number } = {};
    const totalRepuestos: { [mes: string]: number } = {};
    const totalManoObra: { [mes: string]: number } = {};
    const totalGalones: { [mes: string]: number } = {};
    mesesRaw.forEach(({ mes }) => {
      totalCombustible[mes] = 0;
      totalRepuestos[mes] = 0;
      totalManoObra[mes] = 0;
      totalGalones[mes] = 0;
    });
    // Sumar valores de todos los vehículos
    this.gastosPorVehiculo.forEach(veh => {
      veh.labels.forEach((mes, i) => {
        // Sumar directamente por el mes 'YYYY-MM'
        if (totalCombustible.hasOwnProperty(mes)) {
          totalCombustible[mes] += veh.combustible[i];
          totalRepuestos[mes] += veh.repuestos[i];
          totalManoObra[mes] += veh.manoObra[i];
          if (veh.galones && veh.galones[i] !== undefined) {
            totalGalones[mes] += veh.galones[i];
          }
        }
      });
    });
    // Guardar historial completo
    this.aggregatedChartDataFull = mesesRaw.map(({ mes, nombreMes }) => ({
      name: nombreMes,
      series: [
        { name: 'Combustible', value: totalCombustible[mes] },
        { name: 'Repuestos', value: totalRepuestos[mes] },
        { name: 'Mano de Obra', value: totalManoObra[mes] },
        { name: 'Galones', value: totalGalones[mes] }
      ]
    }));
    // Solo últimos 3 meses por defecto
    this.aggregatedChartData = this.aggregatedChartDataFull.slice(-3);
  }

  procesarDatos(data: any[]): void {
    data.forEach(item => {
      if (!this.gastosPorVehiculo.has(item.vehiculo_id)) {
        this.gastosPorVehiculo.set(item.vehiculo_id, {
          vehiculo_id: item.vehiculo_id,
          placa: item.placa,
          marca: item.marca,
          modelo: item.modelo,
          labels: [],
          combustible: [],
          repuestos: [],
          manoObra: [],
          galones: []
        });
      }
      const vehiculo = this.gastosPorVehiculo.get(item.vehiculo_id);
      if (vehiculo) {
        // Guardar el label como 'YYYY-MM' directamente
        vehiculo.labels.push(item.mes);
        // Asegurar tipo number para evitar NaN en gráficos
        const comb = Number(item.total_combustible);
        const rep = Number(item.total_repuestos);
        const mano = Number(item.total_mano_obra);
        const gal = Number(item.total_galones);
        vehiculo.combustible.push(isNaN(comb) ? 0 : comb);
        vehiculo.repuestos.push(isNaN(rep) ? 0 : rep);
        vehiculo.manoObra.push(isNaN(mano) ? 0 : mano);
        vehiculo.galones.push(isNaN(gal) ? 0 : gal);
      }
    });
  }
}
