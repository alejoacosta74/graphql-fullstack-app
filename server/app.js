const express = require('express');
//const graphqlHTTP = require('express-graphql'); -> require returns an object 'graphqlHTTP' with property 'graphqlHTTP()'
const {graphqlHTTP} = require('express-graphql'); // with ES6 destructuring, extracts the property/function 'graphqlHTTP()' 
const  mongoose = require('mongoose');
const cors = require('cors'); 
const schema = require('./schema/schema');
var logger = require('morgan');

const app = express();

mongoose.connect("mongodb+srv://dbUser:dbUserPassword@cluster0.uzuqv.mongodb.net/graphql-library?retryWrites=true&w=majority");
mongoose.connection.once('open', ()=>{ //"connection.once" is an event listener that will fire a callback when DB connection is established
    console.log('Connected to Mongo DB atlas database');
})    

app.use(logger('dev'));
app.use(cors()); // -> allow cross-origin requests, i.e, from Web Pack front end server
app.use('/graphql', graphqlHTTP(
    {
        schema,
        graphiql: true  //ES6 notation (i.e. 'schema : schema')
    }
))
app.listen(4000, ()=>{
    console.log('Now listening on port 4000');
})