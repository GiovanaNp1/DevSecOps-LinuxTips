const swaggerAutogen = require('swagger-autogen')({ openapi: '3.0.0' });

const doc = {
    info: {
        version: "1.0.0",
        title: "My API",
        description: "Some description..."
    },
    servers: [
        {
            url: 'http://localhost:3000'
        }
    ],
    components: {
        schemas: {
            Product: {
                type: "object",
                required: ["price", "title", "reviewScore"],
                properties: {
                    price: {
                        type: "number",
                        example: 199.99
                    },
                    image: {
                        type: "string",
                        example: "https://example.com/images/product123.jpg"
                    },
                    brand: {
                        type: "string",
                        example: "Nike"
                    },
                    title: {
                        type: "string",
                        example: "Tênis de Corrida Air Max"
                    },
                    reviewScore: {
                        type: "number",
                        example: 4.5
                    }
                }
            }
        }
    }
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./index'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index');           // Your project's root file
});