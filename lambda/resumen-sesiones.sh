#!/bin/bash

# Script para ver resumen de sesiones
# Uso: ./resumen-sesiones.sh

echo "📊 Resumen de sesiones del chatbot"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

aws dynamodb scan --table-name portfolio-chatbot-messages \
  --output json | \
jq -r '
  .Items |
  group_by(.sessionId.S) |
  .[] |
  "🔹 Sesión: \(.[0].sessionId.S)
   IP: \(.[0].ipAddress.S // "unknown")
   Mensajes: \(length)
   Idioma: \(.[0].language.S)
   Fecha: \(.[0].timestamp.S[0:10])
   Hora: \(.[0].timestamp.S[11:19])
"
' | head -n 50

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Contar sesiones únicas
TOTAL_SESIONES=$(aws dynamodb scan --table-name portfolio-chatbot-messages --output json | jq '[.Items[].sessionId.S] | unique | length')
TOTAL_MENSAJES=$(aws dynamodb scan --table-name portfolio-chatbot-messages --select COUNT --output json | jq '.Count')

echo "📈 Estadísticas:"
echo "   Total de sesiones únicas: $TOTAL_SESIONES"
echo "   Total de mensajes: $TOTAL_MENSAJES"
echo ""
