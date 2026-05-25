let express = require('express');
let bodyParser = require('body-parser')
let Logger = require('js-logger');
const ConnectDatabase = require('./config/mongoose');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger-output.json');
const cookieParser = require('cookie-parser');

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

// Simple double-submit cookie CSRF protection (no external csurf dependency)
const crypto = require('crypto');
function generateCsrfToken() {
    return crypto.randomBytes(24).toString('hex');
}

// middleware to validate double-submit token
function validateDoubleSubmitCsrf(req, res, next) {
    const methodsToProtect = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (!methodsToProtect.includes(req.method)) return next();

    const cookieToken = req.cookies['XSRF-TOKEN'];
    const headerToken = req.get('x-csrf-token') || req.get('csrf-token') || req.get('x-xsrf-token');
    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
        return res.status(403).json({ error: 'Invalid CSRF token' });
    }
    return next();
}

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

    // Route to fetch CSRF token for clients (sets XSRF-TOKEN cookie and returns the token)
    app.get('/csrf-token', (req, res) => {
        const token = generateCsrfToken();
        // set cookie for double-submit strategy; secure flag should be enabled in prod
        res.cookie('XSRF-TOKEN', token, { httpOnly: false });
        res.json({ csrfToken: token });
    });

    // Apply double-submit CSRF validation to modifying routes
    app.use(validateDoubleSubmitCsrf);

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



