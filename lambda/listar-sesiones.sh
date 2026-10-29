#!/bin/bash

# Script para listar todas las sesiones con su sessionId
# Uso: ./listar-sesiones.sh

echo "📋 Sesiones disponibles:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

aws dynamodb scan --table-name portfolio-chatbot-messages --output json | \
jq -r '
  .Items |
  group_by(.sessionId.S) |
  to_entries |
  .[] |
  "[\(.key + 1)] 🆔 SessionId: \(.value[0].sessionId.S)
    📍 IP: \(.value[0].ipAddress.S // "unknown")
    💬 Mensajes: \((.value | length))
    🌐 Idioma: \(.value[0].language.S)
    📅 Fecha: \(.value[0].timestamp.S[0:10]) \(.value[0].timestamp.S[11:19])
"
'

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Para ver una sesión específica, copia el SessionId y ejecuta:"
echo "  ./ver-sesion.sh [SessionId]"
echo ""
echo "Ejemplo:"
echo "  ./ver-sesion.sh <sessionId>"
echo ""
