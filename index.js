let express = require('express');
let bodyParser = require('body-parser')
let Logger = require('js-logger');
const ConnectDatabase = require('./config/mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');

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
console.log('teste')

app.use(bodyParser.json());
app.use(cookieParser());

// configure CSRF protection using cookies
const csrfProtection = csurf({ cookie: true });

Logger.useDefaults();

(async () => {
    await ConnectDatabase();

    const clientRepository = new ClientRepository();
    const clientUseCase = new ClientUseCase(clientRepository);
    const clientController = new ClientController({ ClientUseCase: clientUseCase });

    const productRepository = new ProductRepository();
    const productUseCase = new ProductUseCase(productRepository);
    const productController = new ProductController({ ProductUseCase: productUseCase });

    // Public docs - place before CSRF protection so it's not blocked
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

    // Public login route - issue auth but skip CSRF here (placed before CSRF middleware)
    app.post('/login', authorization);

    // Apply CSRF protection globally for remaining routes
    app.use(csrfProtection);

    // Route to fetch CSRF token for clients (e.g. single page apps)
    app.get('/csrf-token', (req, res) => {
        res.json({ csrfToken: req.csrfToken() });
    });

    // Protected application routes (these come after CSRF middleware)
    app.use('/client', authenticate, clientRoutes(clientController));
    app.use('/product', authenticate, productRoutes(productController));

    app.listen(port, () => Logger.info(`Listening on port ${port}`))

    // CSRF error handler
    app.use((err, req, res, next) => {
        if (err && err.code === 'EBADCSRFTOKEN') {
            // CSRF token validation failed
            return res.status(403).json({ error: 'Invalid CSRF token' });
        }
        return next(err);
    });

})();



