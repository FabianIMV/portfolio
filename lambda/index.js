/**
 * Lambda Function: AI Chatbot Handler
 *
 * Este handler recibe mensajes del chatbot y los procesa usando Google Gemini AI
 *
 * Environment Variables requeridas:
 * - GEMINI_API_KEY: Tu API key de Google Gemini
 */

const https = require('https');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

// Configurar DynamoDB
const client = new DynamoDBClient({ region: 'us-east-1' });
const dynamodb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'portfolio-chatbot-messages';
const SESSIONS_TABLE_NAME = 'portfolio-chatbot-sessions';

/**
 * Genera un sessionId único basado en IP y User-Agent
 */
function generateSessionId(event) {
    const ip = event.requestContext?.identity?.sourceIp || 'unknown';
    const userAgent = event.headers?.['User-Agent'] || event.headers?.['user-agent'] || 'unknown';

    // Hash simple para anonimizar pero mantener consistencia
    const sessionHash = Buffer.from(`${ip}-${userAgent}`).toString('base64').substring(0, 16);
    return sessionHash;
}

/**
 * Guarda un mensaje en DynamoDB
 */
async function saveMessageToDynamoDB(message, response, language, sessionId, ipAddress) {
    const item = {
        messageId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        sessionId: sessionId,           // ← Identificador de sesión
        ipAddress: ipAddress,           // ← IP del usuario
        timestamp: new Date().toISOString(),
        userMessage: message,
        botResponse: response,
        language: language,
        createdAt: Math.floor(Date.now() / 1000)
    };

    try {
        await dynamodb.send(new PutCommand({
            TableName: TABLE_NAME,
            Item: item
        }));
        console.log('Message saved to DynamoDB:', item.messageId, 'Session:', sessionId);
    } catch (error) {
        console.error('Error saving to DynamoDB:', error);
        // No fallar la Lambda si falla el guardado
    }
}

/**
 * Obtiene la sesión del visitante desde DynamoDB
 */
async function getSession(sessionId) {
    try {
        const result = await dynamodb.send(new GetCommand({
            TableName: SESSIONS_TABLE_NAME,
            Key: { sessionId: sessionId }
        }));
        return result.Item || null;
    } catch (error) {
        console.error('Error getting session from DynamoDB:', error);
        return null;
    }
}

/**
 * Actualiza o crea una sesión con el nombre del visitante
 */
async function updateSessionName(sessionId, visitorName, ipAddress) {
    try {
        await dynamodb.send(new PutCommand({
            TableName: SESSIONS_TABLE_NAME,
            Item: {
                sessionId: sessionId,
                visitorName: visitorName,
                ipAddress: ipAddress,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        }));
        console.log('Session updated with visitor name:', visitorName, 'Session:', sessionId);
        return true;
    } catch (error) {
        console.error('Error updating session in DynamoDB:', error);
        return false;
    }
}

/**
 * Detecta si el mensaje es un nombre (respuesta a la pregunta de nombre)
 */
function extractNameFromMessage(message) {
    const lowerMessage = message.toLowerCase().trim();

    // Patrones comunes de respuesta con nombre
    const namePatterns = [
        /^(?:me llamo|mi nombre es|soy|i am|my name is|i'm|im)\s+(.+)$/i,
        /^(?:hola,?\s*)?(?:me llamo|soy|i am|my name is)\s+(.+)$/i,
    ];

    for (const pattern of namePatterns) {
        const match = message.match(pattern);
        if (match) {
            return match[1].trim().split(/\s+/).slice(0, 3).join(' '); // Max 3 palabras para el nombre
        }
    }

    // Si el mensaje es corto (1-3 palabras) y no contiene palabras comunes, probablemente es solo el nombre
    const words = message.trim().split(/\s+/);
    const commonWords = ['hola', 'hello', 'hi', 'hey', 'que', 'what', 'como', 'how', 'quien', 'who', 'gracias', 'thanks', 'ok', 'si', 'yes', 'no'];

    if (words.length <= 3 && words.length >= 1) {
        const isJustName = !words.some(word => commonWords.includes(word.toLowerCase()));
        if (isJustName) {
            return message.trim();
        }
    }

    return null;
}

// Contexto del portfolio en español
const PORTFOLIO_CONTEXT_ES = `
PERFIL PROFESIONAL:
- Fabián Muñoz es Ingeniero en Computación y Analista Programador
- Actualmente SRE en Banco Falabella desde octubre 2025
- +3 años de experiencia en observabilidad y SRE
- Especializado en monitoreo de infraestructura bancaria digital

HISTORIAL LABORAL:
1. Banco Falabella (Oct 2025 - Presente) - SRE
   - Infraestructura de banca digital
   - Monitoreo con Kafka, Golden Signals
   - Respuesta a incidentes 24/7
   - Tecnologías: Kubernetes, Datadog, Grafana, Prometheus, Terraform, Kafka, Splunk, Nagios, AppDynamics

2. Innfinit SpA (Nov 2022 - Oct 2025) - SRE Consulting
   - Consultoría SRE para cliente de seguros grande
   - Plataformas de observabilidad multi-región
   - Tecnologías: AWS, Grafana, Prometheus, Terraform

3. Recomin SM (Jul 2022 - Nov 2022) - Soporte Técnico Básico
   - Soporte técnico a usuarios internos
   - Continuidad operativa diaria

TECNOLOGÍAS PRINCIPALES:
- Cloud: AWS, Kubernetes, Docker, Terraform
- Monitoreo: Grafana, Prometheus, Datadog, Splunk, AppDynamics, Nagios
- Otros: Kafka, Python, Jenkins, CI/CD

PROYECTOS PERSONALES:
- YouTube Music Playlist Creator (40+ stars en GitHub)
- NutriCombat - PWA con IA para nutrición deportiva
- Chile Dashboard en Grafana con datos oficiales
- Proyectos web: True Q, Ferremás, Psicóloga Valeria Améstica, BYF

CONTACTO:
- LinkedIn: https://linkedin.com/in/fabianimv
- Portfolio: https://fabianimv.github.io/portfolio`;

// Contexto del portfolio en inglés
const PORTFOLIO_CONTEXT_EN = `
PROFESSIONAL PROFILE:
- Fabián Muñoz is a Computer Engineer and Analyst Programmer
- Currently SRE at Banco Falabella since October 2025
- +3 years of experience in observability and SRE
- Specialized in digital banking infrastructure monitoring

WORK HISTORY:
1. Banco Falabella (Oct 2025 - Present) - SRE
   - Digital banking infrastructure
   - Kafka monitoring, Golden Signals
   - 24/7 incident response
   - Technologies: Kubernetes, Datadog, Grafana, Prometheus, Terraform, Kafka, Splunk, Nagios, AppDynamics

2. Innfinit SpA (Nov 2022 - Oct 2025) - SRE Consulting
   - SRE consulting for large insurance client
   - Multi-region observability platforms
   - Technologies: AWS, Grafana, Prometheus, Terraform

3. Recomin SM (Jul 2022 - Nov 2022) - Basic Technical Support
   - Technical support for internal users
   - Day-to-day operational continuity

MAIN TECHNOLOGIES:
- Cloud: AWS, Kubernetes, Docker, Terraform
- Monitoring: Grafana, Prometheus, Datadog, Splunk, AppDynamics, Nagios
- Other: Kafka, Python, Jenkins, CI/CD

PERSONAL PROJECTS:
- YouTube Music Playlist Creator (40+ GitHub stars)
- NutriCombat - PWA with AI for sports nutrition
- Chile Dashboard in Grafana with official data
- Web projects: True Q, Ferremás, Psychologist Valeria Améstica, BYF

CONTACT:
- LinkedIn: https://linkedin.com/in/fabianimv
- Portfolio: https://fabianimv.github.io/portfolio`;

/**
 * Normaliza texto removiendo tildes
 */
function removeAccents(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/**
 * Detecta el idioma del mensaje de forma más precisa
 */
function detectLanguage(message) {
    const lowerMessage = message.toLowerCase();
    const normalizedMessage = removeAccents(lowerMessage);

    // Palabras clave que indican español explícitamente
    if (lowerMessage.includes('en español') || lowerMessage.includes('en espanol') ||
        lowerMessage.includes('responde en español') || lowerMessage.includes('habla español') ||
        lowerMessage.includes('habla espanol') || lowerMessage.includes('respondeme en español')) {
        return 'es';
    }

    // Palabras clave que indican inglés explícitamente
    if (lowerMessage.includes('in english') || lowerMessage.includes('speak english') ||
        lowerMessage.includes('respond in english')) {
        return 'en';
    }

    // Palabras MUY comunes en español que rara vez aparecen en inglés
    const strongSpanishIndicators = ['hola', 'que', 'como', 'cual', 'cuales', 'donde', 'cuando',
        'porque', 'para', 'con', 'pero', 'sobre', 'este', 'esta',
        'ese', 'eso', 'del', 'las', 'los', 'una', 'uno', 'sus',
        'mas', 'muy', 'asi', 'bien', 'mal', 'algo', 'todo', 'nada'];

    // Palabras en español relacionadas al portfolio
    const spanishPortfolioWords = ['cuentame', 'dime', 'muestrame', 'hablame', 'dame',
        'experiencia', 'proyectos', 'habilidades', 'tecnologias',
        'trabaja', 'hace', 'tiene', 'sabe', 'usa', 'conoce',
        'cual', 'cuanto', 'cuantos', 'quien', 'quienes'];

    // Palabras MUY comunes en inglés
    const strongEnglishIndicators = ['what', 'how', 'where', 'when', 'why', 'which', 'who',
        'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all',
        'can', 'had', 'her', 'was', 'one', 'our', 'out', 'has'];

    // Palabras en inglés relacionadas al portfolio
    const englishPortfolioWords = ['tell', 'show', 'about', 'experience', 'projects', 'skills',
        'technologies', 'does', 'works', 'knows', 'uses', 'his'];

    let spanishScore = 0;
    let englishScore = 0;

    // Indicadores fuertes valen más
    for (const word of strongSpanishIndicators) {
        if (normalizedMessage.includes(word)) spanishScore += 2;
    }
    for (const word of spanishPortfolioWords) {
        if (normalizedMessage.includes(word)) spanishScore += 1;
    }

    for (const word of strongEnglishIndicators) {
        if (normalizedMessage.includes(word)) englishScore += 2;
    }
    for (const word of englishPortfolioWords) {
        if (normalizedMessage.includes(word)) englishScore += 1;
    }

    // Log para debugging
    console.log(`Language detection: ES=${spanishScore}, EN=${englishScore}, msg="${message}"`);

    // Si hay más puntos en español, es español
    if (spanishScore > englishScore) {
        return 'es';
    }

    // Si es empate o muy cercano, y el mensaje es corto, asumir español
    // (usuarios latinoamericanos son más probables)
    if (spanishScore >= englishScore && message.length < 30) {
        return 'es';
    }

    // Si claramente más inglés
    if (englishScore > spanishScore) {
        return 'en';
    }

    // Por defecto español (para mercado latino)
    return 'es';
}

/**
 * Llama a la API de Gemini
 */
function callGeminiAPI(prompt, apiKey) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500
            }
        });

        const options = {
            hostname: 'generativelanguage.googleapis.com',
            path: `/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                console.log('Gemini API response status:', res.statusCode);
                console.log('Gemini API response:', data);

                try {
                    const response = JSON.parse(data);

                    if (response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts && response.candidates[0].content.parts[0]) {
                        resolve(response.candidates[0].content.parts[0].text);
                    } else if (response.error) {
                        reject(new Error(`Gemini API error: ${response.error.message}`));
                    } else {
                        console.error('Unexpected response structure:', JSON.stringify(response));
                        reject(new Error('Invalid response format from Gemini API'));
                    }
                } catch (error) {
                    console.error('Error parsing Gemini response:', error);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.error('HTTP request error:', error);
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

/**
 * Handler principal de la Lambda
 */
exports.handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    // Headers CORS
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST'
    };

    // Manejar preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Parsear el body
        const body = JSON.parse(event.body);
        const { message } = body;

        if (!message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Message is required'
                })
            };
        }

        // Obtener la API key de las variables de entorno
        const apiKey = process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'API key not configured'
                })
            };
        }

        // Generar sessionId e IP
        const sessionId = generateSessionId(event);
        const ipAddress = event.requestContext?.identity?.sourceIp || 'unknown';

        // Detectar idioma
        const language = detectLanguage(message);
        const portfolioContext = language === 'es' ? PORTFOLIO_CONTEXT_ES : PORTFOLIO_CONTEXT_EN;

        // Verificar si tenemos el nombre del visitante en la sesión
        let session = await getSession(sessionId);
        let visitorName = session?.visitorName || null;
        let response;

        // FLUJO: Si no tenemos nombre, primero lo pedimos
        if (!visitorName) {
            // Intentar extraer nombre del mensaje actual (por si ya lo está dando)
            const extractedName = extractNameFromMessage(message);

            if (extractedName) {
                // El usuario dio su nombre, guardarlo
                visitorName = extractedName;
                await updateSessionName(sessionId, visitorName, ipAddress);

                // Respuesta de bienvenida personalizada
                response = language === 'es'
                    ? `¡Mucho gusto, ${visitorName}! 🙌 Bienvenido/a al portfolio de Fabián. Soy su asistente personal y estoy aquí para contarte sobre su experiencia como SRE, sus proyectos, tecnologías que domina... ¡lo que quieras saber! ¿Qué te gustaría conocer primero?`
                    : `Nice to meet you, ${visitorName}! 🙌 Welcome to Fabián's portfolio. I'm his personal assistant and I'm here to tell you about his experience as an SRE, his projects, technologies he masters... whatever you want to know! What would you like to explore first?`;
            } else {
                // Pedimos el nombre primero
                response = language === 'es'
                    ? `¡Hola! 👋 Antes de empezar, ¿me podrías decir tu nombre? Me encantaría saber con quién tengo el placer de hablar. 😊`
                    : `Hello! 👋 Before we start, could you tell me your name? I'd love to know who I have the pleasure of talking to. 😊`;

                // Guardar el mensaje aunque aún no tengamos nombre
                try {
                    await saveMessageToDynamoDB(message, response, language, sessionId, ipAddress);
                } catch (err) {
                    console.error('Failed to save to DynamoDB:', err);
                }

                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify({
                        message: response,
                        language: language,
                        awaitingName: true
                    })
                };
            }
        }

        // Ya tenemos el nombre, crear el prompt neutro y factual
        const systemPrompt = language === 'es'
            ? `Eres el asistente de Fabián Muñoz. El visitante se llama "${visitorName}".

ESTILO:
- Responde de forma directa y factual
- NO uses frases de autobombo como "un crack", "increíble", "impresionante", "amazing", etc.
- Solo entrega la información que piden, sin adornos
- Si preguntan algo muy personal, di "Eso pregúntale directo a Fabián"
- Sé discreto con info personal (teléfono, dirección, etc.)

FORMATO:
- Respuestas cortas y al grano (máximo 50 palabras)
- Pocos emojis, solo si es natural
- Sin saludos repetitivos
- Para contacto: LinkedIn https://linkedin.com/in/fabianimv

Contexto:
${portfolioContext}

Responde en español, directo y sin exageraciones.`
            : `You are Fabián Muñoz's assistant. The visitor is "${visitorName}".

STYLE:
- Respond directly and factually
- DO NOT use self-praise phrases like "amazing", "incredible", "impressive", "a pro", etc.
- Just provide the information requested, no embellishments
- For overly personal questions, say "Ask Fabián directly"
- Be discreet with personal info (phone, address, etc.)

FORMAT:
- Short responses (max 50 words)
- Few emojis, only if natural
- No repetitive greetings
- For contact: LinkedIn https://linkedin.com/in/fabianimv

Context:
${portfolioContext}

Respond in English, direct and without exaggerations.`;

        const fullPrompt = `${systemPrompt}\n\nUser (${visitorName}): ${message}`;

        // Llamar a la API de Gemini
        response = await callGeminiAPI(fullPrompt, apiKey);

        // Guardar mensaje en DynamoDB
        try {
            await saveMessageToDynamoDB(message, response, language, sessionId, ipAddress);
        } catch (err) {
            console.error('Failed to save to DynamoDB:', err);
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: response,
                language: language,
                visitorName: visitorName
            })
        };

    } catch (error) {
        console.error('Error:', error);

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Internal server error',
                details: error.message
            })
        };
    }
};
