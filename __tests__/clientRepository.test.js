const ClientRepository = require('../infra/database/clientRepository');
const Client = require('../domain/Models/Client');

jest.mock('../domain/Models/Client');

describe('ClientRepository', () => {
    let clientRepo;

    beforeEach(() => {
        clientRepo = new ClientRepository();
        jest.clearAllMocks();
    });

    it('deve criar um novo cliente', async () => {
        const request = { name: 'João' };
        const saveMock = jest.fn().mockResolvedValue({ _id: '123', ...request });
        Client.mockReturnValue({ save: saveMock });

        const result = await clientRepo.create(request);

        expect(Client).toHaveBeenCalledWith(request);
        expect(saveMock).toHaveBeenCalled();
        expect(result).toEqual({ _id: '123', name: 'João' });
    });

    it('deve buscar cliente por id', async () => {
        const mockClient = { _id: '123', name: 'Maria' };
        Client.findById.mockResolvedValue(mockClient);

        const request = { params: { _id: '123' } };
        const result = await clientRepo.get(request);

        expect(Client.findById).toHaveBeenCalledWith('123');
        expect(result).toEqual(mockClient);
    });

    it('deve buscar todos os clientes', async () => {
        const mockClients = [{ name: 'Ana' }, { name: 'Pedro' }];
        Client.find.mockResolvedValue(mockClients);

        const result = await clientRepo.getAll();

        expect(Client.find).toHaveBeenCalled();
        expect(result).toEqual(mockClients);
    });

    it('deve deletar cliente por id', async () => {
        const mockDeleted = { _id: '123', name: 'Apagado' };
        Client.findByIdAndDelete.mockResolvedValue(mockDeleted);

        const result = await clientRepo.delete('123');

        expect(Client.findByIdAndDelete).toHaveBeenCalledWith('123');
        expect(result).toEqual(mockDeleted);
    });

    it('deve atualizar cliente por id', async () => {
        const updated = { _id: '123', name: 'Novo Nome' };
        Client.findByIdAndUpdate.mockResolvedValue(updated);

        const result = await clientRepo.update('123', { name: 'Novo Nome' });

        expect(Client.findByIdAndUpdate).toHaveBeenCalledWith(
            '123',
            { $set: { name: 'Novo Nome' } },
            { new: true, runValidators: true }
        );
        expect(result).toEqual(updated);
    });
});
