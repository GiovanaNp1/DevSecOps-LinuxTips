let express = require('express');
let bodyParser = require('body-parser')
let Logger = require('js-logger');
const ConnectDatabase = require('./config/mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');

require('dotenv').config()

const ClientController = require('./API/controllers/ClientController');
const ClientUseCase = require('./domain/useCases/clientUseCase');
const ClientRepository = require('./infra/database/clientRepository');
const clientRoutes = require('./API/routes/clientRoutes');

const ProductController = require('./API/controllers/ProductController');
const ProductUseCase = require('./domain/useCases/productUseCase');
const ProductRepository = require('./infra/database/productRepository');
const productRoutes = require('./API/routes/productRoutes');
const { authenticate, authorization } = require('./auth/auth');

const port = (process.env.PORT || 3000);
const app = express();

app.use(bodyParser.json());

Logger.useDefaults();

(async () => {
    await ConnectDatabase();

    const clientRepository = new ClientRepository();
    const clientUseCase = new ClientUseCase(clientRepository);
    const clientController = new ClientController({ ClientUseCase: clientUseCase });

    const productRepository = new ProductRepository();
    const productUseCase = new ProductUseCase(productRepository);
    const productController = new ProductController({ ProductUseCase: productUseCase });

    app.use('/client', authenticate, clientRoutes(clientController));
    app.use('/product', authenticate, productRoutes(productController));
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

    app.post('/login', authorization)

    app.listen(port, () => Logger.info(`Listening on port ${port}`))

})();



