import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dialogo-ver-imagen',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <h2 mat-dialog-title style="display:flex;align-items:center;gap:8px">
      <mat-icon>photo</mat-icon>
      Ver imagen de la carga
    </h2>
    <div mat-dialog-content style="max-width:80vw;max-height:70vh;display:flex;align-items:center;justify-content:center">
      <ng-container *ngIf="url; else noImg">
        <img [src]="url" alt="Imagen de la carga" style="max-width:100%;max-height:65vh;object-fit:contain" (error)="onError()" />
      </ng-container>
      <ng-template #noImg>
        <div style="text-align:center;padding:16px;color:#666">
          <mat-icon style="font-size:40px">image_not_supported</mat-icon>
          <p>No hay una imagen disponible para esta carga.</p>
        </div>
      </ng-template>
    </div>
    <div mat-dialog-actions style="justify-content:flex-end">
      <button mat-button (click)="abrirEnNuevaPestana()" *ngIf="url"><mat-icon>open_in_new</mat-icon>&nbsp;Abrir en nueva pestaña</button>
      <button mat-raised-button color="primary" (click)="cerrar()">Cerrar</button>
    </div>
  `
})
export class DialogoVerImagenComponent {
  url: string | null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { url?: string | null },
    private dialogRef: MatDialogRef<DialogoVerImagenComponent>
  ) {
    this.url = data?.url ?? null;
  }

  onError(): void {
    // Si la imagen falla, ocultamos la url para mostrar el mensaje de no disponible
    this.url = null;
  }

  abrirEnNuevaPestana(): void {
    if (this.url) {
      window.open(this.url, '_blank');
    }
  }

  cerrar(): void {
    this.dialogRef.close();
  }
}
