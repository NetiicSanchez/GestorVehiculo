import { Routes } from '@angular/router';
import { AgregarVehiculoComponent } from './vehiculos/agregar-vehiculo/agregar-vehiculo.component';

export const routes: Routes = [
  { path: '', redirectTo: '/test-routing', pathMatch: 'full' },
  { 
    path: 'test-routing', 
    loadComponent: () => import('./test-routing.component').then(m => m.TestRoutingComponent)
  },
  { 
    path: 'test', 
    loadComponent: () => import('./test.component').then(m => m.TestComponent)
  },
  { 
    path: 'vehiculos/agregar-simple', 
    loadComponent: () => import('./vehiculos/agregar-vehiculo/agregar-vehiculo-simple.component').then(m => m.AgregarVehiculoSimpleComponent)
  },
  { 
    path: 'vehiculos/inventario', 
    loadComponent: () => import('./vehiculos/inventario/inventario.component').then(m => m.InventarioComponent)
  },
  { 
    path: 'vehiculos/agregar', 
    component: AgregarVehiculoComponent
  },
  { 
    path: 'vehiculos/editar/:id', 
    loadComponent: () => import('./vehiculos/editar-vehiculo/editar-vehiculo.component').then(m => m.EditarVehiculoComponent)
  },
  { 
    path: 'vehiculos/detalle/:id', 
    loadComponent: () => import('./vehiculos/detalle-vehiculo/detalle-vehiculo.component').then(m => m.DetalleVehiculoComponent)
  },
  { 
    path: 'vehiculos/tipos', 
    loadComponent: () => import('./vehiculos/tipos/tipos-vehiculos.component').then(m => m.TiposVehiculosComponent)
  },
  { 
    path: 'vehiculos/grupos', 
    loadComponent: () => import('./vehiculos/grupos/grupos-vehiculos.component').then(m => m.GruposVehiculosComponent)
  },
  { 
    path: 'vehiculos/estados', 
    loadComponent: () => import('./vehiculos/estados/estados-vehiculos.component').then(m => m.EstadosVehiculosComponent)
  },
  { 
    path: 'vehiculos/combustible', 
    loadComponent: () => import('./vehiculos/combustible/combustible.component').then(m => m.CombustibleComponent)
  },
  { path: '**', redirectTo: '/vehiculos/inventario' }
];
