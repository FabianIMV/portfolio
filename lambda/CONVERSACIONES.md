# 📊 Ver Conversaciones del Chatbot

Ahora cada mensaje se guarda con:
- **sessionId**: Identifica conversaciones del mismo usuario (basado en IP + User-Agent)
- **ipAddress**: IP del usuario que escribió

## 🚀 Ver resumen rápido

```bash
./resumen-sesiones.sh
```

Muestra:
- Lista de sesiones únicas
- Cuántos mensajes por sesión
- IP, idioma y fecha
- Total de sesiones y mensajes

## 📋 Ver conversaciones completas

```bash
./ver-conversaciones.sh
```

Muestra:
- Todas las conversaciones agrupadas por sesión
- Cada mensaje con su respuesta
- Timestamps completos
- Fácil de leer

## 💻 Queries personalizados

### Ver mensajes de una IP específica:
```bash
aws dynamodb scan --table-name portfolio-chatbot-messages \
  --filter-expression "ipAddress = :ip" \
  --expression-attribute-values '{":ip":{"S":"190.22.39.239"}}'
```

### Ver mensajes de hoy:
```bash
aws dynamodb scan --table-name portfolio-chatbot-messages \
  --filter-expression "createdAt > :today" \
  --expression-attribute-values "{\":today\":{\"N\":\"$(date -d 'today 00:00' +%s)\"}}"
```

### Ver mensajes en español:
```bash
aws dynamodb scan --table-name portfolio-chatbot-messages \
  --filter-expression "language = :lang" \
  --expression-attribute-values '{":lang":{"S":"es"}}'
```

### Contar sesiones únicas:
```bash
aws dynamodb scan --table-name portfolio-chatbot-messages | \
  jq '[.Items[].sessionId.S] | unique | length'
```

## 📊 Estructura de datos

Cada mensaje tiene:
```json
{
  "messageId": "1764103085447-ntw2p9iur",
  "sessionId": "MTkwLjIyLjM5LjIz",       // Hash de IP+UserAgent
  "ipAddress": "190.22.39.239",          // IP del usuario
  "timestamp": "2025-11-25T20:38:05.447Z",
  "userMessage": "cuentame de fabian",
  "botResponse": "Fabián es...",
  "language": "es",
  "createdAt": 1764103085                // Unix timestamp
}
```

## ✅ Ventajas de este diseño

- ✅ Una sola tabla (simple y barato)
- ✅ Fácil identificar conversaciones
- ✅ Puedes filtrar por IP, fecha, idioma, etc.
- ✅ Escala a millones de mensajes
- ✅ No tienes que gestionar múltiples tablas
