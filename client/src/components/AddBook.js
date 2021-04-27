import { Component } from "react";
import { graphql } from '@apollo/client/react/hoc';
import {flowRight as compose} from 'lodash';
import {getAuthorsQuery, AddBookMutation, getBooksQuery} from '../queries/queries';

class AddBook extends Component {
    constructor(props){
        super(props);
        this.state = {
            name: "",
            genre: "",
            authorId: "",
            id: ""
        }
    }

    displayAuthors(){
        var data = this.props.getAuthorsQuery;
        if(data.loading){
            return (<option disabled>Loading authors...</option>);
        }
        else {
            return (data.authors.map(author => {
                return (<option key={author.id} value={author.id}>{author.name}</option>)
            }))
        }
    }

    submitForm(e){
        e.preventDefault();
        this.props.addBookMutation({
            variables: {
                name: this.state.name,
                genre: this.state.genre,
                authorId: this.state.authorId
            },
            refetchQueries: [{query: getBooksQuery}]
        });
    }
    render(){
        return (
            <form id="add-book" onSubmit={this.submitForm.bind(this)}>
                <div className="field">
                    <label>Book name:</label>
                    <input type="text" onChange={(e)=>this.setState({name: e.target.value})} />
                </div>
                <div className="field">
                    <label>Genre:</label>
                    <input type="text" onChange={(e)=>this.setState({genre: e.target.value})}/>
                </div>
                <div className="field">
                    <label>Author:</label>
                    <select onChange={(e)=>this.setState({authorId: e.target.value})}>
                        <option>Select author</option>
                        { this.displayAuthors() }
                    </select>
                </div>
                <button>+</button>

            </form>            
          );
        }      
    }
  //--> compose is used to BIND more than 1 query to the component props
  export default compose(
      graphql(getAuthorsQuery, {name: "getAuthorsQuery"}), //--> "name" property is used when calling this.props.getAuthorsQuery
      graphql(AddBookMutation, {name: "addBookMutation"})
  )(AddBook);