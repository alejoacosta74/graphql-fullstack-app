import { Component } from "react";
import { graphql } from '@apollo/client/react/hoc';
import {getBooksQuery} from '../queries/queries';
import BookDetails from './BookDetails';

class BookList extends Component {
    constructor(props){
        super(props);
        this.state = {
            selected: null
        }
    }
    displayBooks(){
        var data = this.props.data;
        if (data.loading){
            return (<div>Loading books</div>);
        } else {
            return data.books.map((book) => {
                return (<li key={book.id} onClick={(e) =>{this.setState({selected: book.id})}}>{book.name} ({book.genre})</li>)
            })
        }

    }
    render(){
        console.log("this.state.selected: ", this.state.selected)        
        return (
            <div >
                <ul id="book-list">
                {this.displayBooks()}         
                </ul>
                <BookDetails bookId={this.state.selected}/>
            </div>
          );
        }      
    }
  
  export default graphql(getBooksQuery)(BookList); //binds the query to the props of the BookList component