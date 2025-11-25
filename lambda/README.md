# Portfolio Chatbot Lambda

Deployment de Lambda + API Gateway para el chatbot con IA (Gemini).

## Deployment

```bash
# 1. Instalar dependencias
cd lambda
npm install

# 2. Ejecutar deployment
npm run deploy

# 3. El script te pedirá tu API Key de Gemini
# Ingrésala cuando se te solicite

# 4. Al finalizar, copia la URL del endpoint
# Ejemplo: https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/chat

# 5. Actualiza el archivo config.js con la URL
# Reemplaza: window.CHATBOT_API_ENDPOINT = null;
# Por: window.CHATBOT_API_ENDPOINT = 'TU_URL_AQUI';
```

## Estructura

- `chatbot-handler.js` - Función Lambda
- `deploy.js` - Script de deployment automático
- `package.json` - Dependencias

## Requisitos

- AWS CLI configurado
- Node.js 18+
- API Key de Google Gemini
