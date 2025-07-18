import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-routing',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="
      background: #ff0000;
      color: white;
      padding: 50px;
      margin: 20px;
      font-size: 24px;
      text-align: center;
      border: 5px solid #000;
    ">
      <h1>🎯 TEST ROUTING FUNCIONANDO 🎯</h1>
      <p>Si ves esto, el routing está funcionando correctamente</p>
    </div>
  `
})
export class TestRoutingComponent {
  constructor() {
    console.log('TestRoutingComponent cargado');
  }
}
