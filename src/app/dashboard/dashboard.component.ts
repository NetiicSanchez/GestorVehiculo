import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
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
    MatDividerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  mesFiltro: number | null = null;
  anioFiltro: number | null = null;
  meses = [
    { valor: 1, nombre: 'Enero' },
    { valor: 2, nombre: 'Febrero' },
    { valor: 3, nombre: 'Marzo' },
    { valor: 4, nombre: 'Abril' },
    { valor: 5, nombre: 'Mayo' },
    { valor: 6, nombre: 'Junio' },
    { valor: 7, nombre: 'Julio' },
    { valor: 8, nombre: 'Agosto' },
    { valor: 9, nombre: 'Septiembre' },
    { valor: 10, nombre: 'Octubre' },
    { valor: 11, nombre: 'Noviembre' },
    { valor: 12, nombre: 'Diciembre' }
  ];
  anios: number[] = [];

  loading = true;
  error: string | null = null;
  resumenDashboard: ResumenDashboard | null = null;
  gastosVehiculos: GastoVehiculo[] = [];
  vehiculosDashboard: VehiculoDashboard[] = [];
  totalGalonesMes: number = 0;

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
    const anioActual = new Date().getFullYear();
    for (let a = anioActual; a >= anioActual - 10; a--) {
      this.anios.push(a);
    }
    this.cargarDatosDashboard();
  }
  exportarCargas() {
    let url = '/api/exportar/exportar-cargas';
    const params: string[] = [];
    if (this.mesFiltro) params.push(`mes=${this.mesFiltro}`);
    if (this.anioFiltro) params.push(`anio=${this.anioFiltro}`);
    fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    })
      .then(response => {
        if (!response.ok) throw new Error('Error al descargar el archivo');
        return response.blob();
      })
      .then(blob => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'cargas_combustible.xlsx';
        link.click();
        window.URL.revokeObjectURL(link.href);
      })
      .catch(err => {
        alert('No se pudo descargar el archivo: ' + err.message);
      });
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
          // Asignar el total de galones del mes desde el resumen
          this.totalGalonesMes = response.data.totales.galonesMesActual || 0;
          console.log('📊 Total de galones del mes:', this.totalGalonesMes);
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

  formatearGalones(valor: any): string {
    const num = parseFloat((valor ?? 0).toString());
    if (isNaN(num)) return '0 gal';
    return new Intl.NumberFormat('es-GT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num) + ' gal';
  }

}
