# BUSNET Trip Planner

## Objetivo

El Trip Planner recomienda rutas de bus cercanas entre un origen y un destino.
Trabaja con los recorridos GeoJSON disponibles y Turf.js. No utiliza ni
presenta paradas oficiales.

## Funcionamiento

1. Convierte origen y destino en puntos Turf.
2. Normaliza `LineString`, `MultiLineString` y `GeometryCollection`.
3. Proyecta cada punto sobre las rutas con `nearestPointOnLine`.
4. Considera radios de 100 en 100 metros, hasta un máximo configurable.
5. Prioriza una ruta directa cercana a ambos puntos.
6. Si no existe una directa, busca una combinación con un transbordo.
7. Acepta intersecciones o una caminata de transbordo máxima de 200 metros.
8. Ordena las opciones por caminata estimada, radio y transbordos.

Los puntos calculados se llaman **punto de abordaje aproximado** y **punto de
descenso aproximado**.

## Ejecutar el proyecto

Desde dos terminales:

```bash
cd backend
pnpm install
pnpm start
```

```bash
cd frontend
pnpm install
pnpm dev
```

Frontend: `http://127.0.0.1:5173/`

Backend: `http://localhost:3000/`

## Probar POST /plan

```bash
curl -X POST http://localhost:3000/plan \
  -H "Content-Type: application/json" \
  -d '{
    "origin": {
      "latitude": 13.672956,
      "longitude": -89.30011
    },
    "destination": {
      "latitude": 13.702576,
      "longitude": -89.196386
    },
    "options": {
      "maximumRadiusMeters": 1000
    }
  }'
```

El endpoint responde:

- `200` cuando encuentra una opción válida.
- `400` cuando faltan coordenadas, no son numéricas o están fuera de rango.
- `404` cuando no encuentra una conexión dentro del radio máximo.

## Pruebas

```bash
cd backend
pnpm test
```

Las pruebas cubren ruta directa, expansión de radio, transbordo,
`GeometryCollection`, coordenadas inválidas, ausencia de rutas y límite máximo.

## Limitaciones actuales

- Los puntos de abordaje y descenso son aproximaciones geométricas.
- No hay catálogo de paradas oficiales.
- Solo se permite un transbordo.
- Los sentidos de recorrido no están completos en todos los GeoJSON.
- No se consideran horarios, tráfico, frecuencia, tarifa ni disponibilidad.
- El destino se selecciona haciendo clic en el mapa.

## Próximos pasos

1. Incorporar paradas validadas y sentido de circulación.
2. Calcular el tramo útil recorrido dentro de cada línea.
3. Añadir tiempos, frecuencia y tarifa cuando existan datos confiables.
4. Integrar búsqueda de destinos en una fase posterior.
