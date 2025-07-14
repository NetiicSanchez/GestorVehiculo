import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'vehiculos/inventario',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'vehiculos/agregar',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'vehiculos/tipos',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'vehiculos/grupos',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'vehiculos/estados',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'vehiculos/combustible',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'vehiculos/editar/**',
    renderMode: RenderMode.Server
  },
  {
    path: 'vehiculos/detalle/**',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
