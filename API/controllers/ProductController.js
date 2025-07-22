class ClientController {
    constructor({ ProductUseCase }) {
        this.ProductUseCase = ProductUseCase;
    }

    create = async (req, res, next) => {
        try {
            const user = await this.ProductUseCase.create(req.body);
            res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }

    show = async (req, res, next) => {
        try {
            console.log(req.params)
            const user = await this.ProductUseCase.get(req);
            if (!user) {
                return res.status(404).json({ "msg": "produto não encontrado" });
            }
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }

    index = async (req, res, next) => {
        try {
            const user = await this.ProductUseCase.getAll();
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }

    destroy = async (req, res, next) => {
        try {
            const product = await this.ProductUseCase.delete(req.params);
            res.status(200).json({ msg: `Produto ${product} deletado com sucesso` });
        } catch (err) {
            next(err);
        }
    }

    update = async (req, res, next) => {
        try {
            const updatedProduct = await this.ProductUseCase.update(req.params._id, req.body);
            if (!updatedProduct) {
                return res.status(404).json({ msg: "Cliente não encontrado" });
            }
            res.status(200).json(updatedProduct);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ClientController;