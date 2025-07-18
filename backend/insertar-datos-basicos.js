const pool = require('./src/config/database');
require('dotenv').config();

async function insertarDatosBasicos() {
  try {
    console.log('Insertando datos básicos...');
    
    // Insertar tipos de vehículo
    const tiposVehiculo = [
      { nombre: 'Automóvil', descripcion: 'Vehículo de pasajeros' },
      { nombre: 'Camión', descripcion: 'Vehículo de carga' },
      { nombre: 'Motocicleta', descripcion: 'Vehículo de dos ruedas' },
      { nombre: 'Camioneta', descripcion: 'Vehículo utilitario' },
      { nombre: 'Autobús', descripcion: 'Vehículo de transporte público' }
    ];
    
    for (const tipo of tiposVehiculo) {
      try {
        await pool.query(
          'INSERT INTO tipo_vehiculo (nombre, descripcion) VALUES ($1, $2)',
          [tipo.nombre, tipo.descripcion]
        );
        console.log(`✅ Tipo de vehículo: ${tipo.nombre}`);
      } catch (error) {
        if (error.code !== '23505') { // Ignorar duplicados
          console.error(`❌ Error al insertar tipo ${tipo.nombre}:`, error.message);
        }
      }
    }
    
    // Insertar grupos de vehículo
    const gruposVehiculo = [
      { nombre: 'Flota Administrativa', descripcion: 'Vehículos para uso administrativo' },
      { nombre: 'Flota Operativa', descripcion: 'Vehículos para operaciones' },
      { nombre: 'Flota Comercial', descripcion: 'Vehículos para uso comercial' },
      { nombre: 'Flota Ejecutiva', descripcion: 'Vehículos para ejecutivos' }
    ];
    
    for (const grupo of gruposVehiculo) {
      try {
        await pool.query(
          'INSERT INTO grupo_vehiculo (nombre, descripcion) VALUES ($1, $2)',
          [grupo.nombre, grupo.descripcion]
        );
        console.log(`✅ Grupo de vehículo: ${grupo.nombre}`);
      } catch (error) {
        if (error.code !== '23505') {
          console.error(`❌ Error al insertar grupo ${grupo.nombre}:`, error.message);
        }
      }
    }
    
    // Insertar estados de vehículo
    const estadosVehiculo = [
      { nombre: 'Disponible', descripcion: 'Vehículo disponible para uso', color: '#28a745' },
      { nombre: 'En Uso', descripcion: 'Vehículo actualmente en uso', color: '#ffc107' },
      { nombre: 'Mantenimiento', descripcion: 'Vehículo en mantenimiento', color: '#fd7e14' },
      { nombre: 'Fuera de Servicio', descripcion: 'Vehículo fuera de servicio', color: '#dc3545' },
      { nombre: 'Reparación', descripcion: 'Vehículo en reparación', color: '#6f42c1' }
    ];
    
    for (const estado of estadosVehiculo) {
      try {
        await pool.query(
          'INSERT INTO estado_vehiculo (nombre, descripcion, color) VALUES ($1, $2, $3)',
          [estado.nombre, estado.descripcion, estado.color]
        );
        console.log(`✅ Estado de vehículo: ${estado.nombre}`);
      } catch (error) {
        if (error.code !== '23505') {
          console.error(`❌ Error al insertar estado ${estado.nombre}:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 Datos básicos insertados correctamente!');
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await pool.end();
  }
}

insertarDatosBasicos();
