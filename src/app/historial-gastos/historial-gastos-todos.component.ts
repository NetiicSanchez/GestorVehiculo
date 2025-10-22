import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-historial-gastos-todos',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './historial-gastos-todos.component.html',
  styleUrls: ['./historial-gastos-todos.component.css']
})
export class HistorialGastosTodosComponent implements OnInit {
  getTotales(historial: any[]): { combustible: number, repuestos: number, manoObra: number, galones: number } {
    return {
      combustible: historial.reduce((acc, x) => acc + Number(x.total_combustible), 0),
      repuestos: historial.reduce((acc, x) => acc + Number(x.total_repuestos), 0),
      manoObra: historial.reduce((acc, x) => acc + Number(x.total_mano_obra), 0),
      galones: historial.reduce((acc, x) => acc + Number(x.total_galones), 0)
    };
  }
  historialPorVehiculo: any[] = [];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getGastosMensuales().subscribe((resp: any) => {
      // Agrupar por vehículo y ordenar los meses
      const agrupado: { [id: number]: any[] } = {};
      resp.data.forEach((item: any) => {
        if (!agrupado[item.vehiculo_id]) agrupado[item.vehiculo_id] = [];
        agrupado[item.vehiculo_id].push(item);
      });
      this.historialPorVehiculo = Object.values(agrupado).map((items: any[]) => ({
        vehiculo: items[0],
        historial: items.sort((a, b) => {
          // Ordenar por mes numérico si existe, sino por string
          const mesA = parseInt(a.mes, 10);
          const mesB = parseInt(b.mes, 10);
          if (!isNaN(mesA) && !isNaN(mesB)) return mesA - mesB;
          return a.mes.localeCompare(b.mes);
        })
      }));
    });
  }
}
