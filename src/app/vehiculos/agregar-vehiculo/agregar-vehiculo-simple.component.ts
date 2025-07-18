import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-agregar-vehiculo-simple',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div style="padding: 20px; background: #f0f0f0; margin: 20px; border: 2px solid #000;">
      <h1 style="color: red;">COMPONENTE SIMPLE DE PRUEBA</h1>
      
      <div style="margin: 20px 0; padding: 10px; background: yellow;">
        <h3>Estado del formulario:</h3>
        <p>Formulario existe: {{ !!miForm }}</p>
        <p>Formulario válido: {{ miForm?.valid }}</p>
      </div>
      
      <div style="border: 1px solid blue; padding: 20px; margin: 20px 0;">
        <h3>Formulario:</h3>
        <form [formGroup]="miForm" (ngSubmit)="enviar()">
          <div style="margin: 10px 0;">
            <label>Placa:</label>
            <input type="text" formControlName="placa" style="margin-left: 10px; padding: 5px; border: 1px solid #ccc;">
          </div>
          
          <div style="margin: 10px 0;">
            <label>Marca:</label>
            <input type="text" formControlName="marca" style="margin-left: 10px; padding: 5px; border: 1px solid #ccc;">
          </div>
          
          <button type="submit" style="padding: 10px 20px; background: green; color: white; border: none;">
            Enviar
          </button>
        </form>
      </div>
    </div>
  `
})
export class AgregarVehiculoSimpleComponent implements OnInit {
  miForm: FormGroup;

  constructor(private fb: FormBuilder) {
    console.log('Constructor simple ejecutado');
    this.miForm = this.fb.group({
      placa: ['', Validators.required],
      marca: ['', Validators.required]
    });
    console.log('Formulario simple creado:', this.miForm);
  }

  ngOnInit() {
    console.log('ngOnInit simple ejecutado');
  }

  enviar() {
    console.log('Formulario enviado:', this.miForm.value);
    alert('Formulario enviado: ' + JSON.stringify(this.miForm.value));
  }
}
