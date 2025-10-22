import { Component, Input, OnChanges, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-bitacora-grafica',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <ngx-charts-bar-vertical
      [results]="chartData"
      [xAxis]="true"
      [yAxis]="true"
      [legend]="false"
      [showDataLabel]="true"
      [colorScheme]="colorScheme"
      [yScaleMax]="100"
      [roundEdges]="true"
      [barPadding]="8"
      [animations]="true"
      [tooltipDisabled]="false"
      [showXAxisLabel]="true"
      [showYAxisLabel]="true"
      xAxisLabel="Vehículo"
      yAxisLabel="% Cumplimiento"
      style="height:320px;width:100%;display:block;"
    >
    </ngx-charts-bar-vertical>
  `
})
export class BitacoraGraficaComponent implements OnChanges {
  @Input() data: any[] = [];
  chartData: any[] = [];

  colorScheme = {
    domain: ['#388e3c'] // solo verde
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data']) {
      this.chartData = (this.data || []).map(d => ({
        name: d.vehiculo,
        value: Number(d.porcentaje) || 0
      }));
    }
  }

  dataLabelFormat(data: any): string {
    return `${data.value}%`;
  }
}
