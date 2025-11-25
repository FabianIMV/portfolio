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
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

// Configurar DynamoDB
const client = new DynamoDBClient({ region: 'us-east-1' });
const dynamodb = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'portfolio-chatbot-messages';

/**
 * Guarda un mensaje en DynamoDB
 */
async function saveMessageToDynamoDB(message, response, language) {
    const item = {
        messageId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
        console.log('Message saved to DynamoDB:', item.messageId);
    } catch (error) {
        console.error('Error saving to DynamoDB:', error);
        // No fallar la Lambda si falla el guardado
    }
}

// Contexto del portfolio en español
const PORTFOLIO_CONTEXT_ES = `
PERFIL PROFESIONAL:
- Fabián Muñoz es Ingeniero en Computación y Analista Programador
- Se desempeña como Ingeniero en Observabilidad con 2 años de experiencia
- Site Reliability Engineer (SRE) en Innfinit desde noviembre 2022
- Especializado en observabilidad, monitoreo y confiabilidad de sistemas críticos

EXPERIENCIA:
- 2 años como Ingeniero en Observabilidad y SRE
- Especialista en monitoreo de sistemas críticos empresariales
- Participando en proyectos de arquitectura CN/Delta
- Experiencia con golden signals y gestión SLI/SLO
- Trabajo con infraestructura cloud y automatización

TECNOLOGÍAS:
- ☁️ AWS, 🐳 Docker, ⚓ Kubernetes, 🏗️ Terraform
- 📈 Grafana, 🔥 Prometheus, 🤖 BigPanda
- 🐍 Python, Jenkins, CI/CD

PROYECTOS:
- 🎵 YouTube Music Playlist Creator (40+ stars)
- 🥊 NutriCombat - PWA con IA
- 📊 Chile Dashboard en Grafana con datos oficiales
- 💼 Proyectos web True Q, Ferremás, Psicóloga Valeria Améstica, BYF

CONTACTO:
- 💼 LinkedIn: https://linkedin.com/in/fabianimv
- 📧 Para contacto directo, usar el formulario de contacto del sitio
- 🌐 Portfolio: https://fabianimv.github.io/portfolio`;

// Contexto del portfolio en inglés
const PORTFOLIO_CONTEXT_EN = `
PROFESSIONAL PROFILE:
- Fabián Muñoz is a Computer Engineer and Analyst Programmer
- Works as Observability Engineer with 2 years of experience
- Site Reliability Engineer (SRE) at Innfinit since November 2022
- Specialized in observability, monitoring and critical system reliability

EXPERIENCE:
- 2 years as Observability Engineer and SRE
- Specialist in critical enterprise system monitoring
- Participating in CN/Delta architecture projects
- Experience with golden signals and SLI/SLO management
- Working with cloud infrastructure and automation

TECHNOLOGIES:
- ☁️ AWS, 🐳 Docker, ⚓ Kubernetes, 🏗️ Terraform
- 📈 Grafana, 🔥 Prometheus, 🤖 BigPanda
- 🐍 Python, Jenkins, CI/CD

PROJECTS:
- 🎵 YouTube Music Playlist Creator (40+ stars)
- 🥊 NutriCombat - PWA with AI
- 📊 Chile Dashboard in Grafana with official data
- 💼 Web projects True Q, Ferremás, Psychologist Valeria Améstica, BYF

CONTACT:
- 💼 LinkedIn: https://linkedin.com/in/fabianimv
- 📧 For direct contact, use the site's contact form
- 🌐 Portfolio: https://fabianimv.github.io/portfolio`;

/**
 * Detecta el idioma del mensaje de forma más precisa
 */
function detectLanguage(message) {
    const lowerMessage = message.toLowerCase();

    // Palabras clave que indican español explícitamente
    if (lowerMessage.includes('en español') || lowerMessage.includes('en espanol') ||
        lowerMessage.includes('responde en español') || lowerMessage.includes('habla español') ||
        lowerMessage.includes('habla espanol')) {
        return 'es';
    }

    // Palabras clave que indican inglés explícitamente
    if (lowerMessage.includes('in english') || lowerMessage.includes('speak english') ||
        lowerMessage.includes('respond in english')) {
        return 'en';
    }

    // Palabras comunes en español (contar coincidencias)
    const spanishWords = ['hola', 'qué', 'cómo', 'dónde', 'cuándo', 'por qué', 'cuéntame', 'cuéntame',
                          'dame', 'dime', 'muéstrame', 'háblame', 'sobre', 'acerca', 'eres', 'estás',
                          'experiencia', 'proyectos', 'habilidades', 'tecnologías', 'tecnologias'];

    // Palabras comunes en inglés
    const englishWords = ['what', 'how', 'where', 'when', 'why', 'tell', 'show', 'about',
                         'experience', 'projects', 'skills', 'technologies', 'can', 'are', 'you'];

    let spanishScore = 0;
    let englishScore = 0;

    for (const word of spanishWords) {
        if (lowerMessage.includes(word)) spanishScore++;
    }

    for (const word of englishWords) {
        if (lowerMessage.includes(word)) englishScore++;
    }

    // Si hay más palabras en español, es español
    if (spanishScore > englishScore) {
        return 'es';
    }

    // Por defecto inglés
    return 'en';
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

        // Detectar idioma
        const language = detectLanguage(message);
        const portfolioContext = language === 'es' ? PORTFOLIO_CONTEXT_ES : PORTFOLIO_CONTEXT_EN;

        // Crear el prompt
        const systemPrompt = language === 'es'
            ? `Eres un asistente personal de Fabián Muñoz. Responde SIEMPRE EN ESPAÑOL de manera amigable y conversacional sobre su experiencia, proyectos y habilidades.

IMPORTANTE:
- NUNCA digas "voy a responderte en español" - simplemente responde en español directamente
- Usa emojis ocasionalmente
- Mantén las respuestas concisas (máximo 60 palabras)
- NO repitas saludos en cada respuesta
- Enfócate en responder la pregunta específica
- Para contacto, dirige a LinkedIn: https://linkedin.com/in/fabianimv

Contexto del portfolio:
${portfolioContext}

RESPONDE LA PREGUNTA EN ESPAÑOL, siendo directo y útil.`
            : `You are Fabián Muñoz's personal assistant. ALWAYS RESPOND IN ENGLISH in a friendly and conversational manner about his experience, projects, and skills.

IMPORTANT:
- NEVER say "I'll respond in English" - just respond in English directly
- Use emojis occasionally
- Keep responses concise (max 60 words)
- DON'T repeat greetings in every response
- Focus on answering the specific question
- For contact, direct to LinkedIn: https://linkedin.com/in/fabianimv

Portfolio context:
${portfolioContext}

ANSWER THE QUESTION IN ENGLISH, being direct and helpful.`;

        const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;

        // Llamar a la API de Gemini
        const response = await callGeminiAPI(fullPrompt, apiKey);

        // Guardar mensaje en DynamoDB
        try {
            await saveMessageToDynamoDB(message, response, language);
        } catch (err) {
            console.error('Failed to save to DynamoDB:', err);
            // Continuar aunque falle el guardado
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: response,
                language: language
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
