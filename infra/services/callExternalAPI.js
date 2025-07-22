const axios = require("axios");

class CallExternalAPIService {
  async getAllProducts(page) {
    const response = await axios.get(`${process.env.CHALLENGE_MAGALU}/?page=${page}`);
    return response.data;
  }
}

module.exports = CallExternalAPIService;