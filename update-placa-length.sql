-- Script para actualizar el tamaño del campo placa
-- Ejecutar este script en tu base de datos si quieres permitir placas más largas

ALTER TABLE vehiculo ALTER COLUMN placa TYPE VARCHAR(30);
