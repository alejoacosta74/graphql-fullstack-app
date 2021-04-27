const graphql = require('graphql');
const _ = require('lodash');

//get required properties from package graphql
const {GraphQLObjectType, 
    GraphQLString, 
    GraphQLSchema,
    GraphQLInt,
    GraphQLNonNull, //Used to specify what arguments MUST NOT be null in MUTATIONS
    GraphQLList, //Used to retrieve a list of book objects
    GraphQLID //Usefull to allow the 'id' field to be an integer or a string
} = graphql; // ES6 destructuring (i.e. "const GraphQLObjectType = require('graphql').GraphQLObjectType")

const Book = require('../models/book');
const Author = require('../models/author');

//dummy data
var books = [
    { name: 'Name of the Wind', genre: 'Fantasy', id: '1', authorId: '1' },
    { name: 'The Final Empire', genre: 'Fantasy', id: '2', authorId: '2' },
    { name: 'The Hero of Ages', genre: 'Fantasy', id: '4', authorId: '2' },
    { name: 'The Long Earth', genre: 'Sci-Fi', id: '3', authorId: '3' },
    { name: 'The Colour of Magic', genre: 'Fantasy', id: '5', authorId: '3' },
    { name: 'The Light Fantastic', genre: 'Fantasy', id: '6', authorId: '3' },
];

var authors = [
    { name: 'Patrick Rothfuss', age: 44, id: '1' },
    { name: 'Brandon Sanderson', age: 42, id: '2' },
    { name: 'Terry Pratchett', age: 66, id: '3' }
];


//Definition of object type "BookType" with fields id, name and genre
const BookType = new GraphQLObjectType ({ // Defines the Book object schema
    name: 'Book',
    fields: () => ({  //fields is defined as a function
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args){
                console.log(parent);
                //return _.find(authors, {id: parent.authorId}); //'parent' is a 'BookType' object that contains attribute 'authorId'
                return Author.findById(parent.authorId);
            }
        }
    })
})
//Definition of object type "AuthorType" with fields id, name and age
const AuthorType = new GraphQLObjectType ({ // Defines the Author object schema
    name: 'Author',
    fields: () => ({  //fields is defined as a function
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: new GraphQLList (BookType), //type GraphQLList will contain a list of objects type BookType
            resolve(parent, args){
                console.log(parent);
                //return _.filter(books, {authorId: parent.id}); //'parent' is a 'AuthorType' object that contains attribute 'id'
                return Book.find({authorId: parent.id});
            }
        }

    })
})

const Mutation = new GraphQLObjectType ({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: {
                    type: new GraphQLNonNull(GraphQLString)
                },
                age: { type: new GraphQLNonNull(GraphQLInt)}                
            },
            resolve (parent, args){
                let author = new Author ({
                    name: args.name,
                    age: args.age
                });
                return author.save();
            }

        },
        addBook: {
            type: BookType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent,args){
                let book = new Book({
                    name: args.name,
                    genre: args.genre,
                    authorId: args.authorId
                });
                return book.save();
            }
        }
    }
})

//Definition of graph root query "RootQuery"
const RootQuery = new GraphQLObjectType ({
    name: 'RootQueryType',
    fields: { //each field is like an available REST endpoint
        book: { //book field is used when someone jumps into the graph searching for 'Book'
            type: BookType,
            args: { id : {type: GraphQLID}}, //similar to endpoint -> /book/:id
            resolve(parent, args){ // function 'resolve' is the code to get data from db / other source
                //when 'resolve' fires, the object 'id' is available at 'args.id'
                //return _.find(books, {id: args.id}); //use lodash library to manipulate array of books
                return Book.findById(args.id);

            }
        },
        author: { //author field is used when someone jumps into the graph searching for 'Author'
            type: AuthorType,
            args: { id : {type: GraphQLID}}, //similar to endpoint -> /book/:id
            resolve(parent, args){ // function 'resolve' is the code to get data from db / other source
                //when 'resolve' fires, the object 'id' is available at 'args.id'
                //return _.find(authors, {id: args.id}); //use lodash library to manipulate array of books
                return Author.findById(args.id);
            }
        },
        book2: { //book field is used when someone jumps into the graph searching for 'Book'
            type: BookType,
            args: { id : {type: GraphQLID}}, //similar to endpoint -> /book/:id
            resolve(parent, args){ // function 'resolve' is the code to get data from db / other source
                //when 'resolve' fires, the object 'id' is available at 'args.id'
                //return _.find(books, {id: args.id}); //use lodash library to manipulate array of books
                return Book.findById(args.id);
            }
        },
        books:{
            type: new GraphQLList(BookType), // for the general 'endpoint' "books", a list is returned
            resolve(parent, args){
                //return books; //'revolve' returns the 'books' array and graphql decides which fields to send back
                return Book.find({}); // --> need to pass an empty object {} to find (i.e., cannot be just find())
            }
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args){
                //return authors;
                return Author.find({});
            }
        }

    }

})

//Definition of Schema
//The schema defines which 'query' the user is allowed to make from the frontend (i.e. "RootQuery")
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})