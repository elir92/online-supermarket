const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    id: Number,
    username: String,
    password: String,
    city: String,
    street: String,
    name: String,
    last: String
})

module.exports = userSchema;
