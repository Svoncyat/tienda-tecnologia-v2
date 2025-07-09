-- Script para corregir los enums de la tabla clientes

-- Primero, agregar las columnas faltantes si no existen
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS ultimo_acceso DATETIME DEFAULT NULL;

-- Actualizar los enums para que coincidan con los valores de Java
ALTER TABLE clientes 
MODIFY COLUMN tipo_cliente ENUM('PERSONA_NATURAL', 'EMPRESA') NOT NULL;

ALTER TABLE clientes 
MODIFY COLUMN tipo_documento ENUM('DNI', 'RUC', 'CE', 'PASAPORTE') NOT NULL;

-- Actualizar datos existentes si los hay (convertir valores antiguos)
UPDATE clientes SET tipo_cliente = 'PERSONA_NATURAL' WHERE tipo_cliente = 'Persona Natural';
UPDATE clientes SET tipo_cliente = 'EMPRESA' WHERE tipo_cliente = 'Empresa';

-- Actualizar registros existentes para fecha_registro
UPDATE clientes SET fecha_registro = CURRENT_TIMESTAMP WHERE fecha_registro IS NULL;

-- Mostrar la estructura actualizada
DESCRIBE clientes;
