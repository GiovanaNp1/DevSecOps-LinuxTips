class ClientUseCase {
    constructor(clientRepository) {
        this.clientRepository = clientRepository;
    }

    async create(data) {
        const client = await this.clientRepository.create(data);
        return client
    }

    async get(data) {
        const client = await this.clientRepository.get(data);
        return client
    }

    async getAll() {
        const client = await this.clientRepository.getAll();
        return client
    }

    async delete(data) {
        const client = await this.clientRepository.delete(data);
        return client
    }

    async update(data) {
        const client = await this.clientRepository.get(data);
        if (!client) throw new Error("Cliente não encontrado");
        const body = data.body
        const params = data.params._id
        if (body.products && Array.isArray(body.products)) {
            body.products = [...new Set(body.products.map(id => id.toString()))];
            // const existingProducts = await this.productRepository.findByIds(data.products);
            // if (existingProducts.length !== uniqueProductIds.length) {
            //     throw new Error("Um ou mais produtos não existem.");
            // }
            body.products = body.products.filter(function (item) {
                return item !== value
            })
        }
        return await this.clientRepository.update(params, body);
    }
}

module.exports = ClientUseCase;
