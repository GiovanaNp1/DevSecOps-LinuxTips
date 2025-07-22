class ClientController {
    constructor({ ClientUseCase }) {
        this.ClientUseCase = ClientUseCase;
    }

    create = async (req, res, next) => {
        try {
            const user = await this.ClientUseCase.create(req.body);
            res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }

    show = async (req, res, next) => {
        try {
            const user = await this.ClientUseCase.get(req);
            if (!user) {
                return res.status(404).json({ "msg": "usuario não encontrado" });
            }
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }

    index = async (req, res, next) => {
        try {
            const user = await this.ClientUseCase.getAll(req.body);
            res.status(201).json(user);
        } catch (err) {
            next(err);
        }
    }

    destroy = async (req, res, next) => {
        try {
            const user = await this.ClientUseCase.delete(req.params);
            res.status(200).json({ msg: `Usuario ${user.email} foi  com sucesso` });
        } catch (err) {
            next(err);
        }
    }

    update = async (req, res, next) => {
        try {
            const updatedClient = await this.ClientUseCase.update(req);
            if (!updatedClient) {
                return res.status(404).json({ msg: "Cliente não encontrado" });
            }
            res.status(200).json(updatedClient);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = ClientController;