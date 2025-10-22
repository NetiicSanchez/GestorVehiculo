import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BitacoraGraficaComponent } from './bitacora-grafica.component';
import { BitacoraService } from '../services/bitacora.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-bitacora-grafica-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, BitacoraGraficaComponent],
  template: `
    <div class="grafica-page-container">
      <mat-card>
        <mat-card-title>
          <mat-icon>bar_chart</mat-icon>
          Gráfica de cumplimiento de mantenimiento
        </mat-card-title>
        <div class="grafica-filtros">
          <label>Mes:</label>
          <select [(ngModel)]="mesFiltro">
            <option [ngValue]="null">Todos</option>
            <option *ngFor="let m of [1,2,3,4,5,6,7,8,9,10,11,12]" [ngValue]="m">{{ m }}</option>
          </select>
          <label style="margin-left:16px;">Año:</label>
          <select [(ngModel)]="anioFiltro">
            <option [ngValue]="null">Todos</option>
            <option *ngFor="let y of obtenerAnios()" [ngValue]="y">{{ y }}</option>
          </select>
          <button mat-stroked-button color="primary" style="margin-left:16px;vertical-align:middle;" (click)="consultarCumplimiento()">
            <mat-icon>search</mat-icon> Consultar
          </button>
        </div>
        <div class="grafica-content">
          <div *ngIf="loading" class="grafica-loading">
            <mat-spinner diameter="40"></mat-spinner>
            <span>Cargando...</span>
          </div>
          <div *ngIf="!loading && error" class="grafica-error">
            {{ error }}
          </div>
          <app-bitacora-grafica *ngIf="!loading && !error && data?.length" [data]="data"></app-bitacora-grafica>
          <div *ngIf="!loading && !error && !data?.length" class="grafica-placeholder">
            No hay datos para mostrar.
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styleUrls: ['./bitacora-grafica-page.component.css']
})
export class BitacoraGraficaPageComponent {
  mesFiltro: number | null = new Date().getMonth() + 1;
  anioFiltro: number | null = new Date().getFullYear();
  data: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(private bitacoraService: BitacoraService) {}

  obtenerAnios(): number[] {
    const actual = new Date().getFullYear();
    return [actual - 2, actual - 1, actual, actual + 1];
  }

  consultarCumplimiento(): void {
    this.error = null;
    this.loading = true;
    this.data = [];
    const params: any = {};
    if (this.mesFiltro) params.mes = this.mesFiltro;
    if (this.anioFiltro) params.anio = this.anioFiltro;
    this.bitacoraService.obtenerCumplimiento(params).subscribe({
      next: (res) => {
        this.data = res?.data ?? res ?? [];
        this.loading = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar la gráfica. Intenta nuevamente.';
        this.loading = false;
      }
    });
  }

  ngOnInit() {
    this.consultarCumplimiento();
  }
}
