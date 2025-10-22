import { Component, OnInit } from '@angular/core';//nos sirve para crear componentes
import { CommonModule } from '@angular/common'; //nos sirve para poder usa directivas como *ngIf y *ngFor
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; //nos sirve para crear formularios reactivos o tradicionales

// Material sirve para estilizar componentes de angular material
import { MatCardModule } from '@angular/material/card';//sirve para crear tarjetas
import { MatFormFieldModule } from '@angular/material/form-field';//sirve para crear campos de formulario
import { MatInputModule } from '@angular/material/input';//sirve para crear inputs
import { MatButtonModule } from '@angular/material/button';//sirve para crear botones
import { MatSelectModule } from '@angular/material/select';//sirve para crear selects
import { MatRadioModule } from '@angular/material/radio';//sirve para crear botones de radio
import { MatDatepickerModule } from '@angular/material/datepicker';//sirve para crear campos de fecha. calendario
import { MatNativeDateModule } from '@angular/material/core';//sirve para los campos de fecha 
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; //sirve para mostrar mensajes emergentes
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BitacoraGraficaComponent } from './bitacora-grafica.component';
import { RouterModule } from '@angular/router';

// Servicios sirven para conectar con el backend
import { BitacoraService } from '../services/bitacora.service'; 
import { VehiculosService } from '../services/vehiculos.service';
import { UsuariosService } from '../services/usuarios.service';
import { Vehiculo } from '../models/vehiculo.model';


@Component({ // Componente principal de la bitácora nos sirve para crear la bitácora el @ sigue de un decorador que define el componente
  selector: 'app-bitacora', //nombre del componente con el que se va a llamar desde otro componente
  standalone: true, //indica que el componente es independiente y no necesita ser declarado en un módulo
  imports: [ //modulos que se van a usar en el componente

    //son las mismas importaciones que se hicieron al inicio del archivo

    CommonModule,//sirve para usar directivas como *ngIf y *ngFor
    FormsModule,//sirve para crear formularios
    ReactiveFormsModule,//sirve para crear formularios reactivos
    MatCardModule,//sirve para crear tarjetas
    MatFormFieldModule,//sirve para crear campos de formulario
    MatInputModule,//sirve para crear inputs
    MatButtonModule,//sirve para crear botones
    MatSelectModule,//sirve para crear selects
    MatRadioModule,//sirve para crear botones de radio
    MatDatepickerModule,//sirve para crear campos de fecha. calendario
    MatNativeDateModule,//sirve para los campos de fecha
    MatSnackBarModule,//sirve para mostrar mensajes emergentes
  MatIconModule,
  MatProgressSpinnerModule,
  RouterModule,
  BitacoraGraficaComponent
  ],
  templateUrl: './bitacora.component.html', //ruta del archivo html del componente
  styleUrls: ['./bitacora.component.css'], //ruta del archivo css del componente
 
})
export class BitacoraComponent implements OnInit {  
  mesFiltro: number | null = null;
  anioFiltro: number | null = null;
  obtenerAnios(): number[] {
    const actual = new Date().getFullYear();
    return [actual - 2, actual - 1, actual, actual + 1];
  }

  consultarCumplimiento(): void {
    this.graphError = null;
    this.graphLoading = true;
    this.graphData = [];
    const params: any = {};
    if (this.mesFiltro) params.mes = this.mesFiltro;
    if (this.anioFiltro) params.anio = this.anioFiltro;
    this.bitacoraService.obtenerCumplimiento(params).subscribe({
      next: (res) => {
        this.graphData = res?.data ?? res ?? [];
        this.graphLoading = false;
      },
      error: (err) => {
        this.graphError = 'No se pudo cargar la gráfica. Intenta nuevamente.';
        this.graphLoading = false;
      }
    });
  }
  bitacoraForm: FormGroup; //hace referencia al formulario reactivo que se va a crear
  vehiculos: Vehiculo[] = [];//llama al modelo vehiculo que se creo en models, espera un array de vehiculos
  usuarios: any[] = []; // Asumiendo que el servicio de usuarios devuelve un array de usuarios (deberia ser con una estructura definida igual que vehiculo)
  // Estado para el modal y la gráfica
  showGraphModal = false;
  graphLoading = false;
  graphError: string | null = null;
  graphData: any[] = [];
   

  preguntas = { //objeto que contiene las preguntas que se van a mostrar en el formulario (es objeto porque se usan llaves {})
    documentacion: [ //array porque se usan corchetes [], 
      { //obejto que contiene el array de documentacion (cada que hay una llave es un objeto)
        formControlName: 'vencimiento_licencia', //nombre del formControl que se va a usar en el formulario reactivo
        label: 'Licencia Vigente', 
        tipo: 'radio' 
      },

      { //objeto que contiene el array de documentacion (cada que hay una llave es un objeto)
        formControlName: 'tricket', //nombre del formControl que se va a usar en el formulario reactivo
        label: 'Tricket', 
        tipo: 'radio'
       },
    ],

    herramientas: [ //array porque se usan corchetes [] 
      {  //objeto que contiene el array de documentacion (cada que hay una llave es un objeto)
        formControlName: 'llanta_repuesto', 
        label: 'Llanta de Repuesto', 
        tipo: 'radio'
       },

      { //objeto que contiene el array de documentacion (cada que hay una llave es un objeto)
        formControlName: 'llave_cruz', 
        label: 'Llave de Cruz', 
        tipo: 'radio' },
    ],

    fluidos: [ //array porque se usan corchetes []
      { //objeto que contiene el array de documentacion (cada que hay una llave es un objeto)
        formControlName: 'combustible',
        label: 'Nivel de Combustible',
        tipo: 'radio',
        opciones: [ //array de opciones para el nivel de combustible
          { label: '1/4', value: 0 },
          { label: '1/2', value: 1 },
          { label: '3/4', value: 2 },
          { label: 'Full', value: 3 }
        ]
      },

      { //objeto que contiene el array de documentacion (cada que hay una llave es un objeto)
        formControlName: 'nivel_aceite', 
        label: 'Nivel de Aceite', 
        tipo: 'radio' 
      },

      { //objeto que contiene el array de documentacion (cada que hay una llave es un objeto)
        formControlName: 'agua', 
        label: 'Nivel de Agua/Refrigerante', 
        tipo: 'radio' 
      },

      { //objeto que contiene el array de documentacion (cada que hay una llave es un objeto)
        formControlName: 'liquido_freno', 
        label: 'Líquido de Frenos', 
        tipo: 'radio' 
      },
    ],
    luces: [
      {
        formControlName: 'luces_intermitentes',
        label: 'Luces Intermitentes',
        tipo: 'radio'
      },
      {
        formControlName: 'luz_stop',
        label: 'Luz de Stop',
        tipo: 'radio'
      },
      {
        formControlName: 'faros',
        label: 'Faros Delanteros',
        tipo: 'radio'
      },
    ],
    moto: [ //array porque se usan corchetes [] 
      { 
        formControlName: 'etiqueta_m', 
        label: 'Etiqueta "M"', 
        tipo: 'radio'
       },

      { 
        formControlName: 'lubricante_cadena',
         label: 'Lubricante de Cadena', 
         tipo: 'radio' 
        },

      { 
        formControlName: 'tiempo_casco',
         label: 'Casco (Tiempo > 5 años)',
         tipo: 'radio' },
      {
         formControlName: 'traje_imp', 
         label: 'Traje Impermeable', 
         tipo: 'radio' 
        },
    ]
  };

  constructor(
    private fb: FormBuilder,
    private bitacoraService: BitacoraService,
    private vehiculosService: VehiculosService,
    private usuariosService: UsuariosService,
    private snackBar: MatSnackBar
  ) {
    this.bitacoraForm = this.fb.group({
      id_vehiculo: ['', Validators.required],
      id_piloto: ['', Validators.required],
      id_copiloto: [''],
      fecha: [new Date(), Validators.required],
      hora: [new Date().toLocaleTimeString(), Validators.required],
      placa: [{value: '', disabled: true}],
      kilometraje: ['', Validators.required],
      proximo_servicio: [''],
      ren_por_galon: [''],
      observacion: [''],
      // Preguntas
  vencimiento_licencia: [0],
      tricket: [0, Validators.required],
      llanta_repuesto: [0, Validators.required],
      llave_cruz: [0, Validators.required],
      combustible: [0, Validators.required],
      limpieza: [0, Validators.required],
      nivel_aceite: [0, Validators.required],
      agua: [0, Validators.required],
      liquido_freno: [0, Validators.required],
  etiqueta_m: [0],
  lubricante_cadena: [0],
  luces_intermitentes: [0],
  luz_stop: [0],
  faros: [0],
  tiempo_casco: [0],
  traje_imp: [0],
    });
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
    this.bitacoraForm.get('id_vehiculo')?.valueChanges.subscribe(id => {
        const vehiculoSeleccionado = this.vehiculos.find(v => v.id === id);
        if(vehiculoSeleccionado) {
            this.bitacoraForm.get('placa')?.setValue((vehiculoSeleccionado as any).numero_serie);
        }
    });

    // Normaliza y monitorea el valor de combustible
    this.bitacoraForm.get('combustible')?.valueChanges.subscribe(v => {
      const n = Number(v);
      if (this.bitacoraForm.get('combustible')?.value !== n) {
        this.bitacoraForm.get('combustible')?.setValue(isNaN(n) ? 0 : n, { emitEvent: false });
      }
      // Debug (se puede retirar luego)
      try { console.debug('[Bitácora] combustible cambio a:', n); } catch {}
    });
  }

  // Abrir modal y cargar datos de la gráfica
  openGraphModal(): void {
    this.showGraphModal = true;
    this.mesFiltro = new Date().getMonth() + 1;
    this.anioFiltro = new Date().getFullYear();
    this.consultarCumplimiento();
  }

  // Cerrar modal
  closeGraphModal(): void {
    this.showGraphModal = false;
  }

  cargarDatosIniciales(): void {
    this.vehiculosService.obtenerVehiculos().subscribe(res => {
      if (res.success) this.vehiculos = res.data;
    });
    this.usuariosService.obtenerUsuarios().subscribe(res => {
      if (res.success) this.usuarios = res.data;
    });
  }

  onSubmit(): void {
    if (this.bitacoraForm.invalid) {
      this.snackBar.open('Por favor, completa todos los campos requeridos.', 'Cerrar', { duration: 3000 });
      return;
    }

    const formData = this.bitacoraForm.getRawValue();
    formData.placa = this.bitacoraForm.get('placa')?.value; // Asegurarse de que la placa se incluya
    // ...no se realiza mapeo extra, solo se envía el valor seleccionado...
    try { console.debug('[Bitácora] payload combustible:', formData['combustible']); } catch {}
    this.bitacoraService.crearBitacora(formData).subscribe({
      next: (res) => {
        if (res.success) {
          this.snackBar.open('Bitácora guardada exitosamente.', 'Cerrar', { duration: 3000 });
          this.bitacoraForm.reset({
            fecha: new Date(),
            hora: new Date().toLocaleTimeString()
          });
        } else {
          this.snackBar.open('Error al guardar la bitácora.', 'Cerrar', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Error en submit:', err);
        this.snackBar.open('Error de conexión al guardar la bitácora.', 'Cerrar', { duration: 3000 });
      }
    });
  }

  onFluidoChange(controlName: string, value: any) {
    if (controlName === 'combustible') {
      this.bitacoraForm.get('combustible')?.setValue(value, { emitEvent: false });
    }
  }
}
