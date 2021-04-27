const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema ({
    name: String,
    genre: String,
    authorId : String
}) // --> no need to defined attribute 'id' because it is created automatically by Mongo DB

module.exports = mongoose.model('Book', bookSchema);
// 'model' object refers to the mongoDB collection, where 'Book' is the name of the collection with the schema "bookSchema"