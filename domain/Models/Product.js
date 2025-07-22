const mongoose = require('mongoose')

const ProductSchema = mongoose.Schema({
    price: { type: Number, required: true },
    image:{ type: String, required: false },
    brand: { type: String, required: false },
    title: { type: String, required: true },
    reviewScore: { type: Number, required: true },
})

module.exports = mongoose.model('Product', ProductSchema)