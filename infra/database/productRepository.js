const Product = require("../../domain/Models/Product");

class ClientRepository {
    async create (request){
        const product = Product(request);
        return product.save();       
    }

    async get (request){
        const product = Product.findById(request.params._id)
        return product;       
    }

    async getAll(){
        const product = await Product.find();
        return product;
    }
}

module.exports = ClientRepository;