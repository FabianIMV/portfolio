#!/bin/bash

# Script para ver conversaciones del chatbot agrupadas por sesión
# Uso: ./ver-conversaciones.sh

echo "🔍 Obteniendo todas las conversaciones..."
echo ""

# Obtener todos los mensajes y agruparlos por sessionId
aws dynamodb scan --table-name portfolio-chatbot-messages \
  --output json | \
jq -r '
  .Items |
  group_by(.sessionId.S) |
  .[] |
  "
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 Sesión: \(.[0].sessionId.S)
🌐 IP: \(.[0].ipAddress.S // "unknown")
💬 Mensajes: \(length)
Primer mensaje: \(.[0].timestamp.S)
Último mensaje: \(.[-1].timestamp.S)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

\(. | to_entries | .[] | "
[\(.key + 1)] ⏰ \(.value.timestamp.S)
👤 Usuario (\(.value.language.S)): \(.value.userMessage.S)
🤖 Bot: \(.value.botResponse.S)
")
  "
'

echo ""
echo "✅ Fin del reporte"
