const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;

const authenticate = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).send('Acesso negado. Nennhum Token foi submetido.');
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).send('Token invalido.');
  }
};

const authorization = (req, res) => {
        const user = {
            id: req.body.id,
            username: req.body.username
        };

        const token = jwt.sign({ user }, secretKey, { expiresIn: '1h' });

        res.header('Authorization', token).send({'Authorization': token});
    };


module.exports = { authenticate, authorization };