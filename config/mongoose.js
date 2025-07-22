const Logger = require("js-logger");
const mongoose = require("mongoose");

const ConnectDatabase = async () => {

    try {
        console.log(process.env.MONGO_URL_CONNECTION)
        await mongoose.connect(process.env.MONGO_URL_CONNECTION, {});
        Logger.info(`Conexão com sucesso da base do Mongo`)
    } catch (error) {
        Logger.error(`ERROR de conexão ${error}`)
        process.exit(1);
    }
}

module.exports = ConnectDatabase;
