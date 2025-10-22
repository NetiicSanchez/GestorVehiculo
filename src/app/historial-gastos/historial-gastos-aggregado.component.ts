import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-historial-gastos-aggregado',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './historial-gastos-aggregado.component.html',
  styleUrls: ['./historial-gastos-aggregado.component.css']
})
export class HistorialGastosAggregadoComponent implements OnInit {
  historial: Array<{ mes: string, combustible: number, repuestos: number, manoObra: number, galones: number }> = [];

  constructor(private dashboardService: DashboardService, private router: Router) {}
  volverDashboard() {
    this.router.navigate(['/dashboard-gastos']);
  }

  ngOnInit(): void {
    this.dashboardService.getGastosMensuales().subscribe((resp: any) => {
      // Agrupar y sumar por mes para todos los vehículos
      const meses: { [mes: string]: { combustible: number, repuestos: number, manoObra: number, galones: number } } = {};
      resp.data.forEach((item: any) => {
        let nombreMes = item.mes;
        const mesNum = parseInt(item.mes, 10);
        if (!isNaN(mesNum) && mesNum >= 1 && mesNum <= 12) {
          const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
          nombreMes = monthNames[mesNum - 1];
        }
        if (!meses[nombreMes]) {
          meses[nombreMes] = { combustible: 0, repuestos: 0, manoObra: 0, galones: 0 };
        }
        meses[nombreMes].combustible += Number(item.total_combustible) || 0;
        meses[nombreMes].repuestos += Number(item.total_repuestos) || 0;
        meses[nombreMes].manoObra += Number(item.total_mano_obra) || 0;
        meses[nombreMes].galones += Number(item.total_galones) || 0;
      });
      // Convertir a array y ordenar por mes
      this.historial = Object.entries(meses).map(([mes, totales]) => ({ mes, ...totales }));
      this.historial.sort((a, b) => {
        const idxA = this.getMonthIndex(a.mes);
        const idxB = this.getMonthIndex(b.mes);
        return idxA - idxB;
      });
    });
  }

  getMonthIndex(mes: string): number {
    const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return monthNames.indexOf(mes);
  }
}
