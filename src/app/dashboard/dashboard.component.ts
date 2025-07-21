import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { DashboardService, GastoVehiculo, VehiculoDashboard, ResumenDashboard } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatDividerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  loading = true;
  error: string | null = null;
  
  resumenDashboard: ResumenDashboard | null = null;
  gastosVehiculos: GastoVehiculo[] = [];
  vehiculosDashboard: VehiculoDashboard[] = [];

  // Configuración de la tabla de gastos
  displayedColumnsGastos: string[] = [
    'placa',
    'marca',
    'modelo',
    'combustible_mes_actual',
    'otros_gastos_mes_actual',
    'gasto_total_mes_actual',
    'combustible_anio_actual',
    'otros_gastos_anio_actual'
  ];

  // Configuración de la tabla de vehículos
  displayedColumnsVehiculos: string[] = [
    'placa',
    'marca',
    'modelo',
    'estado_vehiculo',
    'tipo_vehiculo',
    'kilometraje_actual'
  ];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.cargarDatosDashboard();
  }

  cargarDatosDashboard(): void {
    this.loading = true;
    this.error = null;

    this.dashboardService.obtenerResumenDashboard().subscribe({
      next: (response: any) => {
        console.log('📊 Respuesta del dashboard:', response);
        if (response.success && response.data) {
          this.resumenDashboard = response.data;
          this.gastosVehiculos = response.data.gastosDetalle || [];
          this.vehiculosDashboard = response.data.vehiculosDetalle || [];
          console.log('📊 Dashboard data cargada:', this.resumenDashboard);
        } else {
          console.error('❌ Respuesta inesperada del servidor:', response);
          this.error = 'Formato de respuesta inesperado del servidor';
        }
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar datos del dashboard:', error);
        this.error = 'Error al cargar los datos del dashboard';
        this.loading = false;
      }
    });
  }

  formatearMoneda(valor: any): string {
    if (!valor || valor === 'null' || valor === '0.00' || valor === '0') {
      return '$0.00';
    }
    
    // Convertir a número y formatear
    const numero = parseFloat(valor.toString());
    if (isNaN(numero)) {
      return '$0.00';
    }
    
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ',
      minimumFractionDigits: 2
    }).format(numero);
  }

  formatearNumero(valor: any): string {
    if (!valor || valor === 'null') {
      return '0';
    }
    
    const numero = parseInt(valor.toString());
    if (isNaN(numero)) {
      return '0';
    }
    
    return numero.toLocaleString('es-GT');
  }

  obtenerColorEstado(estado: string): string {
    const estados: { [key: string]: string } = {
      'Activo': 'primary',
      'Inactivo': 'warn',
      'Mantenimiento': 'accent',
      'Disponible': 'primary'
    };
    return estados[estado] || 'default';
  }

  calcularTotalMes(combustible: string, otros: string): number {
    const combNum = parseFloat(combustible || '0');
    const otrosNum = parseFloat(otros || '0');
    return combNum + otrosNum;
  }

  reintentar(): void {
    this.cargarDatosDashboard();
  }
}
