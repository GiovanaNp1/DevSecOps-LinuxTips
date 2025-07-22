const { Router } = require('express')
const routes = Router();

module.exports = (ProductController) => {
    routes.get('/', ProductController.index);
    routes.get('/:_id', ProductController.show);
    routes.post('/', ProductController.create);
    // routes.patch('/:id', ProductController.update);
    // routes.delete('/client/:_id', ClientController.destroy);
    return routes;
}


