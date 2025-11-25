/**
 * Script de deployment para AWS Lambda + API Gateway
 *
 * Este script automatiza la creación de:
 * 1. IAM Role para Lambda
 * 2. Lambda Function
 * 3. API Gateway REST API
 * 4. Integración Lambda - API Gateway
 *
 * Prerrequisitos:
 * - AWS CLI configurado con credenciales válidas
 * - Node.js instalado
 * - npm install aws-sdk archiver
 *
 * Uso:
 * node deploy.js
 */

const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const { promisify } = require('util');
const readline = require('readline');

// Configurar AWS SDK
AWS.config.update({ region: 'us-east-1' }); // Cambia la región si lo necesitas

const lambda = new AWS.Lambda();
const iam = new AWS.IAM();
const apigateway = new AWS.APIGateway();

// Nombres de recursos
const FUNCTION_NAME = 'portfolio-chatbot-handler';
const ROLE_NAME = 'portfolio-chatbot-lambda-role';
const API_NAME = 'portfolio-chatbot-api';

/**
 * Solicita input del usuario
 */
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
}

/**
 * Crea un archivo ZIP con el código de la Lambda
 */
async function createZipFile() {
    console.log('📦 Creando archivo ZIP con el código de la Lambda...');

    const output = fs.createWriteStream(path.join(__dirname, 'function.zip'));
    const archive = archiver('zip', { zlib: { level: 9 } });

    return new Promise((resolve, reject) => {
        output.on('close', () => {
            console.log(`✅ ZIP creado: ${archive.pointer()} bytes`);
            resolve();
        });

        archive.on('error', (err) => {
            reject(err);
        });

        archive.pipe(output);
        archive.file(path.join(__dirname, 'chatbot-handler.js'), { name: 'index.js' });
        archive.finalize();
    });
}

/**
 * Crea o obtiene el IAM Role para Lambda
 */
async function createOrGetRole() {
    console.log('🔐 Verificando IAM Role...');

    try {
        const roleData = await iam.getRole({ RoleName: ROLE_NAME }).promise();
        console.log('✅ IAM Role ya existe:', roleData.Role.Arn);
        return roleData.Role.Arn;
    } catch (error) {
        if (error.code === 'NoSuchEntity') {
            console.log('📝 Creando IAM Role...');

            const assumeRolePolicyDocument = {
                Version: '2012-10-17',
                Statement: [{
                    Effect: 'Allow',
                    Principal: { Service: 'lambda.amazonaws.com' },
                    Action: 'sts:AssumeRole'
                }]
            };

            const createRoleParams = {
                RoleName: ROLE_NAME,
                AssumeRolePolicyDocument: JSON.stringify(assumeRolePolicyDocument),
                Description: 'Role for portfolio chatbot Lambda function'
            };

            const roleData = await iam.createRole(createRoleParams).promise();

            // Adjuntar política básica de Lambda
            await iam.attachRolePolicy({
                RoleName: ROLE_NAME,
                PolicyArn: 'arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole'
            }).promise();

            console.log('✅ IAM Role creado:', roleData.Role.Arn);

            // Esperar a que el role se propague
            console.log('⏳ Esperando propagación del role (10 segundos)...');
            await new Promise(resolve => setTimeout(resolve, 10000));

            return roleData.Role.Arn;
        }
        throw error;
    }
}

/**
 * Crea o actualiza la Lambda Function
 */
async function createOrUpdateLambda(roleArn, geminiApiKey) {
    console.log('🚀 Verificando Lambda Function...');

    const zipBuffer = fs.readFileSync(path.join(__dirname, 'function.zip'));

    try {
        // Intentar obtener la función existente
        await lambda.getFunction({ FunctionName: FUNCTION_NAME }).promise();

        console.log('📝 Lambda ya existe, actualizando código...');

        await lambda.updateFunctionCode({
            FunctionName: FUNCTION_NAME,
            ZipFile: zipBuffer
        }).promise();

        console.log('📝 Actualizando variables de entorno...');

        await lambda.updateFunctionConfiguration({
            FunctionName: FUNCTION_NAME,
            Environment: {
                Variables: {
                    GEMINI_API_KEY: geminiApiKey
                }
            }
        }).promise();

        console.log('✅ Lambda actualizada correctamente');

    } catch (error) {
        if (error.code === 'ResourceNotFoundException') {
            console.log('📝 Creando nueva Lambda Function...');

            const params = {
                FunctionName: FUNCTION_NAME,
                Runtime: 'nodejs18.x',
                Role: roleArn,
                Handler: 'index.handler',
                Code: { ZipFile: zipBuffer },
                Description: 'Portfolio AI Chatbot Handler with Gemini',
                Timeout: 30,
                MemorySize: 256,
                Environment: {
                    Variables: {
                        GEMINI_API_KEY: geminiApiKey
                    }
                }
            };

            await lambda.createFunction(params).promise();
            console.log('✅ Lambda creada correctamente');
        } else {
            throw error;
        }
    }

    // Obtener información de la función
    const functionData = await lambda.getFunction({ FunctionName: FUNCTION_NAME }).promise();
    return functionData.Configuration.FunctionArn;
}

/**
 * Crea o actualiza API Gateway
 */
async function createOrUpdateApiGateway(lambdaArn) {
    console.log('🌐 Configurando API Gateway...');

    let restApiId;

    // Buscar API existente
    const apis = await apigateway.getRestApis().promise();
    const existingApi = apis.items.find(api => api.name === API_NAME);

    if (existingApi) {
        console.log('✅ API Gateway ya existe:', existingApi.id);
        restApiId = existingApi.id;
    } else {
        console.log('📝 Creando API Gateway...');
        const apiData = await apigateway.createRestApi({
            name: API_NAME,
            description: 'API for Portfolio AI Chatbot',
            endpointConfiguration: { types: ['REGIONAL'] }
        }).promise();

        restApiId = apiData.id;
        console.log('✅ API Gateway creado:', restApiId);
    }

    // Obtener el resource root
    const resources = await apigateway.getResources({ restApiId }).promise();
    const rootResource = resources.items.find(item => item.path === '/');

    // Crear recurso /chat si no existe
    let chatResourceId;
    const chatResource = resources.items.find(item => item.path === '/chat');

    if (chatResource) {
        chatResourceId = chatResource.id;
        console.log('✅ Recurso /chat ya existe');
    } else {
        console.log('📝 Creando recurso /chat...');
        const resourceData = await apigateway.createResource({
            restApiId,
            parentId: rootResource.id,
            pathPart: 'chat'
        }).promise();
        chatResourceId = resourceData.id;
        console.log('✅ Recurso /chat creado');
    }

    // Configurar método POST
    try {
        await apigateway.getMethod({
            restApiId,
            resourceId: chatResourceId,
            httpMethod: 'POST'
        }).promise();
        console.log('✅ Método POST ya existe');

        // Eliminar y recrear para actualizar la integración
        await apigateway.deleteMethod({
            restApiId,
            resourceId: chatResourceId,
            httpMethod: 'POST'
        }).promise();
        console.log('📝 Método POST eliminado para recrear');
    } catch (error) {
        if (error.code !== 'NotFoundException') {
            throw error;
        }
    }

    console.log('📝 Creando método POST...');
    await apigateway.putMethod({
        restApiId,
        resourceId: chatResourceId,
        httpMethod: 'POST',
        authorizationType: 'NONE'
    }).promise();

    // Configurar integración con Lambda
    const region = AWS.config.region || 'us-east-1';
    const accountId = lambdaArn.split(':')[4];

    await apigateway.putIntegration({
        restApiId,
        resourceId: chatResourceId,
        httpMethod: 'POST',
        type: 'AWS_PROXY',
        integrationHttpMethod: 'POST',
        uri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${lambdaArn}/invocations`
    }).promise();

    console.log('✅ Integración con Lambda configurada');

    // Configurar CORS - OPTIONS method
    try {
        await apigateway.getMethod({
            restApiId,
            resourceId: chatResourceId,
            httpMethod: 'OPTIONS'
        }).promise();
    } catch (error) {
        if (error.code === 'NotFoundException') {
            console.log('📝 Configurando CORS (OPTIONS)...');

            await apigateway.putMethod({
                restApiId,
                resourceId: chatResourceId,
                httpMethod: 'OPTIONS',
                authorizationType: 'NONE'
            }).promise();

            await apigateway.putIntegration({
                restApiId,
                resourceId: chatResourceId,
                httpMethod: 'OPTIONS',
                type: 'MOCK',
                requestTemplates: {
                    'application/json': '{"statusCode": 200}'
                }
            }).promise();

            await apigateway.putMethodResponse({
                restApiId,
                resourceId: chatResourceId,
                httpMethod: 'OPTIONS',
                statusCode: '200',
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Headers': true,
                    'method.response.header.Access-Control-Allow-Methods': true,
                    'method.response.header.Access-Control-Allow-Origin': true
                }
            }).promise();

            await apigateway.putIntegrationResponse({
                restApiId,
                resourceId: chatResourceId,
                httpMethod: 'OPTIONS',
                statusCode: '200',
                responseParameters: {
                    'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
                    'method.response.header.Access-Control-Allow-Methods': "'POST,OPTIONS'",
                    'method.response.header.Access-Control-Allow-Origin': "'*'"
                }
            }).promise();

            console.log('✅ CORS configurado');
        }
    }

    // Dar permiso a API Gateway para invocar Lambda
    try {
        const statementId = 'apigateway-invoke-permission';
        await lambda.removePermission({
            FunctionName: FUNCTION_NAME,
            StatementId: statementId
        }).promise();
    } catch (error) {
        // Ignorar si no existe
    }

    await lambda.addPermission({
        FunctionName: FUNCTION_NAME,
        StatementId: 'apigateway-invoke-permission',
        Action: 'lambda:InvokeFunction',
        Principal: 'apigateway.amazonaws.com',
        SourceArn: `arn:aws:execute-api:${region}:${accountId}:${restApiId}/*/*/chat`
    }).promise();

    console.log('✅ Permisos de invocación configurados');

    // Desplegar la API
    console.log('📝 Desplegando API...');
    await apigateway.createDeployment({
        restApiId,
        stageName: 'prod'
    }).promise();

    const apiUrl = `https://${restApiId}.execute-api.${region}.amazonaws.com/prod/chat`;
    console.log('✅ API desplegada correctamente');
    console.log('🎉 URL del endpoint:', apiUrl);

    return apiUrl;
}

/**
 * Función principal
 */
async function main() {
    try {
        console.log('🚀 Iniciando deployment de Portfolio Chatbot Lambda\n');

        // Solicitar API Key de Gemini
        const geminiApiKey = await askQuestion('🔑 Ingresa tu API Key de Google Gemini: ');

        if (!geminiApiKey || geminiApiKey.trim() === '') {
            console.error('❌ API Key es requerida');
            process.exit(1);
        }

        // Crear ZIP
        await createZipFile();

        // Crear o obtener role
        const roleArn = await createOrGetRole();

        // Crear o actualizar Lambda
        const lambdaArn = await createOrUpdateLambda(roleArn, geminiApiKey.trim());

        // Crear o actualizar API Gateway
        const apiUrl = await createOrUpdateApiGateway(lambdaArn);

        console.log('\n✅ ¡Deployment completado exitosamente!\n');
        console.log('📋 Información de deployment:');
        console.log('  - Lambda Function:', FUNCTION_NAME);
        console.log('  - API Endpoint:', apiUrl);
        console.log('\n📝 Próximos pasos:');
        console.log('  1. Copia el API Endpoint');
        console.log('  2. Actualiza el frontend para usar este endpoint');
        console.log('  3. Prueba el chatbot en tu portfolio\n');

        // Guardar la configuración
        const config = {
            apiEndpoint: apiUrl,
            lambdaFunction: FUNCTION_NAME,
            deployedAt: new Date().toISOString()
        };

        fs.writeFileSync(
            path.join(__dirname, 'deployment-config.json'),
            JSON.stringify(config, null, 2)
        );

        console.log('💾 Configuración guardada en deployment-config.json\n');

        // Limpiar archivo ZIP
        fs.unlinkSync(path.join(__dirname, 'function.zip'));

    } catch (error) {
        console.error('❌ Error durante el deployment:', error);
        process.exit(1);
    }
}

// Ejecutar
main();
