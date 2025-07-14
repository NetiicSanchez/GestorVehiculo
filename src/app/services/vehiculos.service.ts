import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Vehiculo, TipoVehiculo, GrupoVehiculo, EstadoVehiculo, TipoCombustible } from '../models/vehiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VehiculosService {
  private vehiculos: Vehiculo[] = [
    {
      id: 1,
      placa: 'ABC-123',
      marca: 'Toyota',
      modelo: 'Corolla',
      anio: 2020,
      color: 'Blanco',
      numeroSerie: 'TOY123456789',
      idTipoVehiculo: 1,
      idGrupoVehiculo: 1,
      idEstadoVehiculo: 1,
      idTipoCombustible: 1,
      kilometrajeInicial: 25000,
      fechaCreacion: new Date('2020-01-15'),
      activo: true
    },
    {
      id: 2,
      placa: 'DEF-456',
      marca: 'Honda',
      modelo: 'Civic',
      anio: 2019,
      color: 'Azul',
      numeroSerie: 'HON987654321',
      idTipoVehiculo: 1,
      idGrupoVehiculo: 2,
      idEstadoVehiculo: 1,
      idTipoCombustible: 1,
      kilometrajeInicial: 35000,
      fechaCreacion: new Date('2019-03-20'),
      activo: true
    }
  ];

  private tiposVehiculo: TipoVehiculo[] = [
    { id: 1, nombre: 'Automóvil', descripcion: 'Vehículo de uso personal', activo: true, fechaCreacion: new Date() },
    { id: 2, nombre: 'Motocicleta', descripcion: 'Vehículo de dos ruedas', activo: true, fechaCreacion: new Date() },
    { id: 3, nombre: 'Camión', descripcion: 'Vehículo de carga pesada', activo: true, fechaCreacion: new Date() },
    { id: 4, nombre: 'Van', descripcion: 'Vehículo de transporte múltiple', activo: true, fechaCreacion: new Date() }
  ];

  private gruposVehiculo: GrupoVehiculo[] = [
    { id: 1, nombre: 'Administrativo', descripcion: 'Vehículos para uso administrativo', activo: true, fechaCreacion: new Date() },
    { id: 2, nombre: 'Operativo', descripcion: 'Vehículos para operaciones diarias', activo: true, fechaCreacion: new Date() },
    { id: 3, nombre: 'Gerencial', descripcion: 'Vehículos para uso gerencial', activo: true, fechaCreacion: new Date() },
    { id: 4, nombre: 'Transporte', descripcion: 'Vehículos de transporte público', activo: true, fechaCreacion: new Date() }
  ];

  private estadosVehiculo: EstadoVehiculo[] = [
    { id: 1, nombre: 'Activo', descripcion: 'Vehículo en servicio', color: 'green', activo: true, fechaCreacion: new Date() },
    { id: 2, nombre: 'Inactivo', descripcion: 'Vehículo fuera de servicio', color: 'gray', activo: true, fechaCreacion: new Date() },
    { id: 3, nombre: 'En Mantenimiento', descripcion: 'Vehículo en reparación', color: 'orange', activo: true, fechaCreacion: new Date() },
    { id: 4, nombre: 'Fuera de Servicio', descripcion: 'Vehículo dado de baja', color: 'red', activo: true, fechaCreacion: new Date() }
  ];

  private tiposCombustible: TipoCombustible[] = [
    { id: 1, nombre: 'Gasolina', descripcion: 'Combustible gasolina', activo: true, fechaCreacion: new Date() },
    { id: 2, nombre: 'Diésel', descripcion: 'Combustible diésel', activo: true, fechaCreacion: new Date() },
    { id: 3, nombre: 'Eléctrico', descripcion: 'Vehículo eléctrico', activo: true, fechaCreacion: new Date() },
    { id: 4, nombre: 'Híbrido', descripcion: 'Vehículo híbrido', activo: true, fechaCreacion: new Date() }
  ];

  private nextId = 3;

  constructor() { }

  // Métodos para vehículos
  getVehiculos(): Observable<Vehiculo[]> {
    return of(this.vehiculos).pipe(delay(500));
  }

  getVehiculoPorId(id: number): Observable<Vehiculo> {
    const vehiculo = this.vehiculos.find(v => v.id === id);
    if (vehiculo) {
      return of(vehiculo).pipe(delay(300));
    }
    return throwError(() => new Error('Vehículo no encontrado'));
  }

  agregarVehiculo(vehiculo: Vehiculo): Observable<Vehiculo> {
    const nuevoVehiculo = { ...vehiculo, id: this.nextId++ };
    this.vehiculos.push(nuevoVehiculo);
    return of(nuevoVehiculo).pipe(delay(500));
  }

  actualizarVehiculo(id: number, vehiculo: Vehiculo): Observable<Vehiculo> {
    const index = this.vehiculos.findIndex(v => v.id === id);
    if (index !== -1) {
      this.vehiculos[index] = { ...vehiculo, id };
      return of(this.vehiculos[index]).pipe(delay(500));
    }
    return throwError(() => new Error('Vehículo no encontrado'));
  }

  eliminarVehiculo(id: number): Observable<boolean> {
    const index = this.vehiculos.findIndex(v => v.id === id);
    if (index !== -1) {
      this.vehiculos.splice(index, 1);
      return of(true).pipe(delay(500));
    }
    return throwError(() => new Error('Vehículo no encontrado'));
  }

  validarPlacaUnica(placa: string, idExcluir?: number): Observable<boolean> {
    const placaExiste = this.vehiculos.some(v => 
      v.placa.toLowerCase() === placa.toLowerCase() && v.id !== idExcluir
    );
    return of(!placaExiste).pipe(delay(300));
  }

  // Métodos para catálogos
  getTiposVehiculo(): Observable<TipoVehiculo[]> {
    return of(this.tiposVehiculo).pipe(delay(200));
  }

  getGruposVehiculo(): Observable<GrupoVehiculo[]> {
    return of(this.gruposVehiculo).pipe(delay(200));
  }

  getEstadosVehiculo(): Observable<EstadoVehiculo[]> {
    return of(this.estadosVehiculo).pipe(delay(200));
  }

  getTiposCombustible(): Observable<TipoCombustible[]> {
    return of(this.tiposCombustible).pipe(delay(200));
  }

  // Métodos para gestión de catálogos
  agregarTipoVehiculo(tipoData: Omit<TipoVehiculo, 'id'>): Observable<TipoVehiculo[]> {
    const nextId = Math.max(...this.tiposVehiculo.map(t => t.id)) + 1;
    const nuevoTipo: TipoVehiculo = { ...tipoData, id: nextId };
    this.tiposVehiculo.push(nuevoTipo);
    return this.getTiposVehiculo();
  }

  eliminarTipoVehiculo(id: number): Observable<TipoVehiculo[]> {
    const index = this.tiposVehiculo.findIndex(t => t.id === id);
    if (index > -1) {
      this.tiposVehiculo.splice(index, 1);
    }
    return this.getTiposVehiculo();
  }

  agregarGrupoVehiculo(grupoData: Omit<GrupoVehiculo, 'id'>): Observable<GrupoVehiculo[]> {
    const nextId = Math.max(...this.gruposVehiculo.map(g => g.id)) + 1;
    const nuevoGrupo: GrupoVehiculo = { ...grupoData, id: nextId };
    this.gruposVehiculo.push(nuevoGrupo);
    return this.getGruposVehiculo();
  }

  eliminarGrupoVehiculo(id: number): Observable<GrupoVehiculo[]> {
    const index = this.gruposVehiculo.findIndex(g => g.id === id);
    if (index > -1) {
      this.gruposVehiculo.splice(index, 1);
    }
    return this.getGruposVehiculo();
  }

  agregarEstadoVehiculo(estadoData: Omit<EstadoVehiculo, 'id'>): Observable<EstadoVehiculo[]> {
    const nextId = Math.max(...this.estadosVehiculo.map(e => e.id)) + 1;
    const nuevoEstado: EstadoVehiculo = { ...estadoData, id: nextId };
    this.estadosVehiculo.push(nuevoEstado);
    return this.getEstadosVehiculo();
  }

  eliminarEstadoVehiculo(id: number): Observable<EstadoVehiculo[]> {
    const index = this.estadosVehiculo.findIndex(e => e.id === id);
    if (index > -1) {
      this.estadosVehiculo.splice(index, 1);
    }
    return this.getEstadosVehiculo();
  }

  agregarTipoCombustible(combustibleData: Omit<TipoCombustible, 'id'>): Observable<TipoCombustible[]> {
    const nextId = Math.max(...this.tiposCombustible.map(c => c.id)) + 1;
    const nuevoCombustible: TipoCombustible = { ...combustibleData, id: nextId };
    this.tiposCombustible.push(nuevoCombustible);
    return this.getTiposCombustible();
  }

  eliminarTipoCombustible(id: number): Observable<TipoCombustible[]> {
    const index = this.tiposCombustible.findIndex(c => c.id === id);
    if (index > -1) {
      this.tiposCombustible.splice(index, 1);
    }
    return this.getTiposCombustible();
  }
}
