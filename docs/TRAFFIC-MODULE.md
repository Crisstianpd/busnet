# Módulo de tráfico de BUSNET

## Estado

La idea de incorporar tráfico al Trip Planner se conserva como una mejora
futura, pero actualmente no existe un proveedor integrado ni un endpoint de
tráfico activo.

El motor actual continúa funcionando exclusivamente con Turf.js y los archivos
GeoJSON locales. El análisis de tráfico futuro deberá ser opcional y no podrá
bloquear `POST /plan`.

## Requisitos para seleccionar un proveedor

Antes de implementar una nueva integración se debe validar:

1. Cobertura real y útil en El Salvador.
2. Acceso legal y técnico a velocidades o congestión por segmento.
3. Límites de cuota apropiados para la competencia.
4. Uso seguro de credenciales únicamente desde backend.
5. Respuesta degradada cuando el proveedor falle.
6. Posibilidad de representar los resultados como GeoJSON.

## Arquitectura futura sugerida

- Una interfaz de proveedor desacoplada del Trip Planner.
- Muestreo de la geometría con Turf.js.
- Caché temporal para reducir solicitudes externas.
- Clasificación neutral: `low`, `medium`, `high` y `unknown`.
- Capa MapLibre independiente que mantenga visible la ruta recomendada.
- Payload opcional para automatizaciones futuras con n8n o ElevenLabs.

## Pendientes

1. Evaluar proveedores con cobertura demostrable en El Salvador.
2. Realizar una prueba de concepto aislada antes de modificar el frontend.
3. Definir costos, cuota y manejo de privacidad.
4. Agregar backend, pruebas y UI únicamente después de validar la fuente.
