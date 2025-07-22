const { Router } = require('express')
const routes = Router();

module.exports = (ClientController) => {
    routes.get('/', ClientController.index);
    routes.get('/:_id', ClientController.show);
    routes.post('/', ClientController.create);
    routes.patch('/:_id', ClientController.update);
    routes.delete('/:_id', ClientController.destroy);
    return routes;
}


