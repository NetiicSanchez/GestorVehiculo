import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-debug',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding:24px;max-width:900px;margin:40px auto;font-family:system-ui, -apple-system, Segoe UI, Roboto, sans-serif;">
      <h1>Ruta de diagnóstico</h1>
      <p>Si ves este texto, el router y el renderizado funcionan correctamente.</p>
      <p>Fecha: {{ now | date:'medium' }}</p>
      <p>Versión app: (build runtime)</p>
      <hr/>
      <p>Prueba también navegar a <a href="/login">/login</a> para validar el login.</p>
    </div>
  `
})
export class DebugComponent {
  now = new Date();
}
