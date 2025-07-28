import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { PerfilComponent } from './auth/perfil.component';

export const routes: Routes = [
  { path: '', redirectTo: '/inventario', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'perfil', component: PerfilComponent },
  { 
    path: 'vehiculos/inventario', 
    loadComponent: () => import('./vehiculos/inventario/inventario.component').then(m => m.InventarioComponent)
  },
  { 
    path: 'vehiculos/agregar', 
    loadComponent: () => import('./vehiculos/agregar-vehiculo/agregar-vehiculo.component').then(m => m.AgregarVehiculoComponent)
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
  { 
    path: 'dashboard', 
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  { path: '**', redirectTo: '/vehiculos/inventario' }
];
