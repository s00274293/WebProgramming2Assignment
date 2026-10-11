import swaggerJSDoc from 'swagger-jsdoc';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Launch API',
            version: '1.0.0',
            description: 'REST API for managing Rocket Launches'
        },
        servers: [
            {
                url: "/api/v1",
            },
        ],
    },
        apis: ['./src/controllers/*.ts', './src/models/*.ts', './src/app.ts']
};

export const swaggerSpec = swaggerJSDoc(options);
