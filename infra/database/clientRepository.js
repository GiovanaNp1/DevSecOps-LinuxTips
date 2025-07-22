const Client = require("../../domain/Models/Client");

class ClientRepository {
    async create (request){
        const client = Client(request);
        return client.save();       
    }

    async get (request){
        const client = Client.findById(request.params._id).then(idFound => {
            return idFound;       
        })
        return client
    }

    async getAll(){
        const client = await Client.find();
        return client;
    }

    async delete(request){
        const client = await Client.findByIdAndDelete(request);
        return client;
    }

    async update(id, data) {
        const updateClient = await Client.findByIdAndUpdate(
            id,
            { $set: data },
            { new: true, runValidators: true }
        );
        return updateClient;
    }
}

module.exports = ClientRepository;