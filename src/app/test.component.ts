import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; background: #f0f0f0; margin: 20px;">
      <h1>Test Component</h1>
      <p>Si puedes ver esto, Angular está funcionando correctamente.</p>
      <button (click)="testClick()">Probar Click</button>
      <div *ngIf="clicked">¡Funciona!</div>
    </div>
  `
})
export class TestComponent {
  clicked = false;
  
  testClick() {
    this.clicked = true;
    console.log('Test click funcionando');
  }
}
