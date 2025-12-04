#!/bin/bash

# Script para ver todos los mensajes de una sesión específica
# Uso: ./ver-sesion.sh [sessionId]

if [ -z "$1" ]; then
    echo "❌ Error: Debes proporcionar un sessionId"
    echo ""
    echo "Uso: ./ver-sesion.sh [sessionId]"
    echo ""
    echo "Para ver las sesiones disponibles, ejecuta: ./resumen-sesiones.sh"
    exit 1
fi

SESSION_ID="$1"

echo "🔍 Buscando mensajes de la sesión: $SESSION_ID"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

aws dynamodb scan \
    --table-name portfolio-chatbot-messages \
    --filter-expression "sessionId = :sid" \
    --expression-attribute-values "{\":sid\":{\"S\":\"$SESSION_ID\"}}" \
    --output json | \
jq -r '
    if (.Items | length) == 0 then
        "❌ No se encontraron mensajes para esta sesión\n"
    else
        .Items |
        sort_by(.timestamp.S) |
        to_entries |
        "📍 IP: \(.[0].value.ipAddress.S)
💬 Total de mensajes: \(length)
⏰ Primera interacción: \(.[0].value.timestamp.S)
⏰ Última interacción: \(.[-1].value.timestamp.S)
🌐 Idioma: \(.[0].value.language.S)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 CONVERSACIÓN:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\n\(.[] | "
[\(.key + 1)] ⏰ \(.value.timestamp.S[11:19])

👤 Usuario:
\(.value.userMessage.S)

🤖 Bot:
\(.value.botResponse.S)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
")"
    end
'

echo ""
