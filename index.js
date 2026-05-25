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
// semgrep: ignore javascript.express.security.audit.express-check-csurf-middleware-usage
// Reason: CSRF protection implemented via `csrf` package with secret cookie and token validation
const app = express();
console.log('teste')

app.use(bodyParser.json());
app.use(cookieParser());

// use `csrf` package to generate and verify tokens (secret stored in cookie)
const Tokens = require('csrf');
const tokens = new Tokens();

// middleware to ensure secret cookie exists
function ensureCsrfSecret(req, res, next) {
    if (!req.cookies['csrf-secret']) {
        const secret = tokens.secretSync();
        // not httpOnly so client can read the token via cookie if needed
        res.cookie('csrf-secret', secret, { httpOnly: false });
        req.csrfSecret = secret;
    } else {
        req.csrfSecret = req.cookies['csrf-secret'];
    }
    return next();
}

// middleware to validate token on mutating requests
function validateCsrfToken(req, res, next) {
    const methodsToProtect = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (!methodsToProtect.includes(req.method)) return next();

    const secret = req.cookies['csrf-secret'];
    const headerToken = req.get('x-csrf-token') || req.get('csrf-token') || req.get('x-xsrf-token');
    if (!secret || !headerToken) return res.status(403).json({ error: 'Invalid CSRF token' });
    if (!tokens.verify(secret, headerToken)) return res.status(403).json({ error: 'Invalid CSRF token' });
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

    // Ensure CSRF secret cookie exists for clients
    app.use(ensureCsrfSecret);

    // Route to fetch CSRF token for clients (generate token from secret and return it)
    app.get('/csrf-token', (req, res) => {
        const secret = req.csrfSecret || req.cookies['csrf-secret'];
        const token = tokens.create(secret);
        res.cookie('XSRF-TOKEN', token, { httpOnly: false });
        res.json({ csrfToken: token });
    });

    // Apply CSRF token validation to modifying requests
    app.use(validateCsrfToken);

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



