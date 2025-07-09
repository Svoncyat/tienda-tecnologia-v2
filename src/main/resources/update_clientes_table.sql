-- Añadir columnas faltantes a la tabla clientes si no existen
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS ultimo_acceso DATETIME DEFAULT NULL;

-- Actualizar registros existentes si los hay
UPDATE clientes SET fecha_registro = CURRENT_TIMESTAMP WHERE fecha_registro IS NULL;
