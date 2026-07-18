const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Maikal Natural Foundation API',
      version: '1.0.0',
      description: 'API for Maikal Natural Foundation — chemical-free, naturally grown products by women self-help groups from the Maa Narmada’s ecosystem.',
      contact: { name: 'Maikal Natural Foundation', email: 'maikalnatural@gmail.com' },
    },
    servers: [{ url: 'http://localhost:5000/api', description: 'Development server' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);
