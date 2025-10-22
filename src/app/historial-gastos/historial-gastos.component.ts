import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-historial-gastos',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './historial-gastos.component.html',
  styleUrls: ['./historial-gastos.component.css']
})
export class HistorialGastosComponent implements OnInit {
  vehiculoId: number | null = null;
  vehiculo: any = null;
  historial: any[] = [];

  constructor(private route: ActivatedRoute, private dashboardService: DashboardService, private router: Router) {}
  volverDashboard() {
    this.router.navigate(['/dashboard-gastos']);
  }

  ngOnInit(): void {
    this.vehiculoId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.vehiculoId) {
      this.dashboardService.getGastosMensuales().subscribe((resp: any) => {
        const veh = resp.data.find((v: any) => v.vehiculo_id === this.vehiculoId);
        if (veh) {
          this.vehiculo = veh;
          this.historial = resp.data.filter((v: any) => v.vehiculo_id === this.vehiculoId);
        }
      });
    }
  }
}
