const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'users' },
    totalprice: Number,
    city: String,
    street: String,
    deliverydate: String,
    creditcard: String,
    products:[],
    date: { type: Date, default: Date.now }
})

module.exports = orderSchema;
