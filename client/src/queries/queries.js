import {gql} from '@apollo/client';

const getAuthorsQuery = gql`
    {
        authors{
            name            
            id
        }
    }
`

const getBooksQuery = gql`
    {
        books{
            name
            genre
            id
        }
    }
`

const getBookQuery = gql`
    query GetBook($id: ID){
        book(id: $id) {
            id
            name
            genre
            author {
                id
                name
                age
                books {
                    name
                    id
                }
            }
        }
    }
`;

const getAuthorQuery = gql`
    query GetAuthor($id: ID){
        author(id: $id) {
            id
            name
            }
    }    
`;


const AddBookMutation = gql`
    mutation($name: String!, $genre: String!, $authorId: ID!){
        addBook(name: $name, genre: $genre, authorId: $authorId){
            name
            id
        },

    }
`
export {getAuthorsQuery, getBooksQuery, AddBookMutation, getBookQuery, getAuthorQuery};