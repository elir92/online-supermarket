const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    price: Number,
    img: String,
    category: { type: Schema.Types.ObjectId, ref: 'categories' }

})

module.exports = productSchema;



