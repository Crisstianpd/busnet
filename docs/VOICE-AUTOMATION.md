# Automatización de voz para alertas de tráfico

## Estado

Esta integración está solamente diseñada y documentada. BUSNET no realiza
actualmente llamadas a n8n, ElevenLabs ni otros servicios externos.

El objetivo futuro es emitir una alerta de voz calmada cuando una ruta
seleccionada tenga tráfico alto reportado por la comunidad.

## 1. Cuándo se dispara la alerta

El evento `traffic_alert` podrá generarse cuando se cumplan todas estas
condiciones:

1. El Trip Planner tiene una ruta seleccionada.
2. `POST /traffic/analyze-plan` devuelve `trafficLevel: "high"`.
3. Existe al menos un reporte comunitario activo cerca de la ruta.
4. La alerta no ha sido enviada recientemente para la misma ruta y zona.
5. El usuario tiene habilitadas las alertas de voz.

La automatización no debe activarse para niveles `none`, `low` o `medium`
durante el MVP. Tampoco debe bloquear la planificación si n8n o ElevenLabs no
están disponibles.

Se recomienda aplicar una ventana de deduplicación de 10 a 15 minutos para
evitar mensajes repetitivos.

## 2. Payload sugerido para n8n

```json
{
  "schemaVersion": 1,
  "event": "traffic_alert",
  "occurredAt": "2026-07-04T18:30:00.000Z",
  "source": "community",
  "userRoute": "29-E",
  "trafficLevel": "high",
  "location": "zona aproximada",
  "reportCount": 2,
  "alternativeRoute": "Alternativa 2",
  "recommendation": "Considera la alternativa 2",
  "message": "Se reporta tráfico alto en tu ruta. Puedes considerar una alternativa cercana."
}
```

Campos:

| Campo | Descripción |
|---|---|
| `schemaVersion` | Versión del contrato para futuras migraciones. |
| `event` | Siempre `traffic_alert` para este flujo. |
| `occurredAt` | Fecha ISO en que BUSNET generó el evento. |
| `source` | Siempre `community`; nunca debe indicar fuente oficial. |
| `userRoute` | Ruta o combinación seleccionada por el usuario. |
| `trafficLevel` | Para alertas de voz será `high`. |
| `location` | Referencia general, sin exponer ubicación personal precisa. |
| `reportCount` | Cantidad de reportes comunitarios relacionados. |
| `alternativeRoute` | Alternativa opcional con menor afectación. |
| `recommendation` | Sugerencia breve y no obligatoria. |
| `message` | Texto final o base para síntesis de voz. |

Si no existe una alternativa, `alternativeRoute` debe enviarse como `null` y
la recomendación debe limitarse a pedir precaución.

## 3. Mensaje para ElevenLabs

Texto base:

> Se reporta tráfico alto por la comunidad en tu ruta. Puedes considerar una
> alternativa cercana.

Con alternativa conocida:

> Hay tráfico alto reportado por la comunidad en la ruta 29-E. Si lo deseas,
> considera la alternativa 2 para evitar la zona afectada.

Sin alternativa:

> Hay tráfico alto reportado por la comunidad cerca de tu ruta. Continúa con
> precaución y revisa el mapa antes de avanzar.

Configuración futura recomendada:

- idioma: español;
- tono: calmado, claro y neutral;
- velocidad: normal;
- volumen: moderado;
- formato preferido: MP3;
- evitar efectos dramáticos o sonidos de emergencia.

## 4. Ejemplos de mensajes

### Tráfico alto

> Se reporta tráfico alto por la comunidad en tu ruta. Considera revisar las
> alternativas disponibles.

### Accidente

> La comunidad reportó un accidente cerca de tu recorrido. Puedes considerar
> una ruta alternativa.

### Calle cerrada

> Se reporta un posible cierre de calle cerca de tu ruta. Revisa el mapa y
> considera otra opción.

### Inundación

> La comunidad reportó una posible inundación cerca del recorrido. Considera
> evitar la zona y consulta las alternativas.

### Bus detenido

> Se reporta un bus detenido cerca de tu recorrido. Puede haber demoras en la
> zona.

## 5. Reglas de seguridad y comunicación

1. Utilizar siempre la frase **“tráfico reportado por la comunidad”**.
2. No presentar los reportes como información oficial o confirmada.
3. No usar expresiones alarmistas como “peligro extremo” o “evacúa ahora”.
4. Sugerir alternativas; nunca ordenar al usuario que cambie su ruta.
5. No afirmar que una calle está cerrada definitivamente. Usar “posible cierre
   reportado”.
6. No leer coordenadas precisas, identificadores internos ni datos personales.
7. No enviar información de ubicación personal más precisa de lo necesario.
8. Permitir que el usuario desactive las alertas de voz.
9. Limitar mensajes repetidos mediante deduplicación.
10. Si la automatización falla, BUSNET debe continuar funcionando en silencio.

## 6. Variables futuras

```dotenv
N8N_WEBHOOK_URL=
ELEVENLABS_API_KEY=
```

Estas variables no deben agregarse con valores reales al repositorio.

Reglas:

- almacenar únicamente en el entorno del backend;
- nunca enviarlas al frontend;
- no imprimirlas en logs;
- usar secretos administrados en producción;
- rotarlas si se exponen accidentalmente.

## Flujo futuro propuesto

```text
Trip Planner
    -> análisis comunitario devuelve high
    -> BUSNET construye traffic_alert
    -> webhook privado de n8n
    -> validación y deduplicación
    -> ElevenLabs genera audio
    -> n8n devuelve referencia temporal del audio
    -> frontend reproduce solo con permiso del usuario
```

## Pendientes antes de implementar

1. Definir consentimiento del usuario para audio.
2. Proteger el webhook de n8n con autenticación.
3. Establecer límites de frecuencia.
4. Definir expiración y almacenamiento temporal de audio.
5. Agregar pruebas de fallos y tiempos de espera.
6. Revisar costos, cuotas y privacidad de ElevenLabs.
