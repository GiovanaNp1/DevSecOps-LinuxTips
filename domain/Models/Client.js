const mongoose = require('mongoose')

const ClientSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    products: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
})

ClientSchema.index({ email: 1}, { unique: true });

module.exports = mongoose.model('Client', ClientSchema)