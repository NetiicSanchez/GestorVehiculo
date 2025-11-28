// ...existing imports...
import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { PerfilComponent } from './auth/perfil.component';
import { AuthGuard } from './auth/auth.guard';

import { BitacoraGraficaPageComponent } from './bitacora/bitacora-grafica-page.component';
import { BitacoraTablaComponent } from './bitacora/bitacora-tabla.component';
import { DebugComponent } from './debug.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'debug', component: DebugComponent },
  {
    path: 'bitacora/tabla',
    component: BitacoraTablaComponent
  },
  {
    path: 'bitacora/grafica',
    component: BitacoraGraficaPageComponent
  },
  {
    path: 'historial-gastos/agregado',
    loadComponent: () => import('./historial-gastos/historial-gastos-aggregado.component').then(m => m.HistorialGastosAggregadoComponent),
    canActivate: [AuthGuard]
  },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  {
    path: 'usuarios',
    loadComponent: () => import('./usuarios/usuarios-list/usuarios-list.component').then(m => m.UsuariosListComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'vehiculos/inventario',
    loadComponent: () => import('./vehiculos/inventario/inventario.component').then(m => m.InventarioComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'vehiculos/agregar',
    loadComponent: () => import('./vehiculos/agregar-vehiculo/agregar-vehiculo.component').then(m => m.AgregarVehiculoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'vehiculos/editar/:id',
    loadComponent: () => import('./vehiculos/editar-vehiculo/editar-vehiculo.component').then(m => m.EditarVehiculoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'vehiculos/detalle/:id',
    loadComponent: () => import('./vehiculos/detalle-vehiculo/detalle-vehiculo.component').then(m => m.DetalleVehiculoComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'vehiculos/estados',
    loadComponent: () => import('./vehiculos/estados/estados-vehiculos.component').then(m => m.EstadosVehiculosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'vehiculos/tipos',
    loadComponent: () => import('./vehiculos/tipos/tipos-vehiculos.component').then(m => m.TiposVehiculosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'vehiculos/grupos',
    loadComponent: () => import('./vehiculos/grupos/grupos-vehiculos.component').then(m => m.GruposVehiculosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'vehiculos/combustible',
    loadComponent: () => import('./vehiculos/combustible/combustible.component').then(m => m.CombustibleComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'graficas-combustible',
    loadComponent: () => import('./graficas-combustible/graficas-combustible.component').then(m => m.GraficasCombustibleComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard-gastos',
    loadComponent: () => import('./dashboard-gastos/dashboard-gastos.component').then(m => m.DashboardGastosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'historial-gastos/:id',
    loadComponent: () => import('./historial-gastos/historial-gastos.component').then(m => m.HistorialGastosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'gastos-adicional',
    loadComponent: () => import('./gastos-adicional/gastos-adicional.component').then(m => m.GastosAdicionalComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'bitacora',
    loadComponent: () => import('./bitacora/bitacora.component').then(m => m.BitacoraComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'incidentes',
    loadComponent: () => import('./incidentes/incidentes.component').then(m => m.IncidentesComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'graficas-gastos',
    loadComponent: () => import('./graficas-gastos/graficas-gastos').then(m => m.GraficasGastos)
  },
  { path: '**', redirectTo: '/login' }
];
