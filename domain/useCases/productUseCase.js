class ProductUseCase {
    constructor(productRepository) {
        this.productRepository = productRepository;
    }

    async create(data){
        const client =  await this.productRepository.create(data);
        return client
    }

    async get(data){
        const client =  await this.productRepository.get(data);
        return client
    }

    async getAll(){
        const client = await this.productRepository.getAll();
        return client
    }

     async update(data) {
        const product = await this.productRepository.get(data);
        if (!product) throw new Error('Produto não encontrado');
        return await this.productRepository.update();
    }
}

module.exports = ProductUseCase;
