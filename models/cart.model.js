const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
    date: { type: Date, default: Date.now },
    client: { type: Schema.Types.ObjectId, ref: 'users' },
    products: []
})

module.exports = cartSchema;
