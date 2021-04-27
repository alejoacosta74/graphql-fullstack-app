const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const authorSchema = new Schema ({
    name: String,
    age: Number,    
}) // --> no need to defined attribute 'id' because it is created automatically by Mongo DB

module.exports = mongoose.model('Author', authorSchema);
