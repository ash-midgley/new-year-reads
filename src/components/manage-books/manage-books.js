import React, { Component } from 'react';
import './manage-books.css';
import { Link }from 'react-router-dom';
import { connect } from 'react-redux';
import { fetchBooks, removeBook } from '../../actions/bookActions';
import { fetchCategories } from '../../actions/categoryActions';
import { fetchRatings } from '../../actions/ratingActions';
import { Helmet } from "react-helmet";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import Book from '../../models/book';

const customStyles = {
    content : {
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

class ManageBooks extends Component {

    constructor(props){
        super(props);
        this.state = {
            modalIsOpen: false,
            submitting: false,
            success: false,
            selectedBook: null,
            loading: true
        }
    }

    componentDidMount() {
        if(!this.props.books || !this.props.categories || !this.props.ratings) {
            var id = localStorage.getItem('userId');
            this.props.fetchBooks(id);
            this.props.fetchCategories(id);
            this.props.fetchRatings(id);
        } else {
            this.setState({
                loading: false
            });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(Array.isArray(nextProps.books) && Array.isArray(nextProps.categories) && Array.isArray(nextProps.ratings))
            this.setState({
                loading: false
        });

        if(nextProps.removedBook) {
            var oldBook = this.props.books.find(b => b.id === nextProps.removedBook.id);
            var i = this.props.books.indexOf(oldBook);
            this.props.books.splice(i, 1);
            this.setState({
                modalIsOpen: false,
                submitting: false,
                success: true,
                selectedBook: null
            })
        }
    }

    openModal = (book) => {
        this.setState({
            selectedBook: book,
            modalIsOpen: true,
            success: false,
        });
    }
    
    closeModal = () => {
        this.setState({modalIsOpen: false});
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({submitting: true});
        var b = this.state.selectedBook;
        var book = new Book(b.userId, b.categoryId, b.ratingId, b.imageUrl, b.title, b.author, b.finishedOn, b.pageCount, b.summary);
        book.id = b.id;
        this.props.removeBook(book, this.props.token);
    }

    render() {
        if(this.state.loading) {
            return (
                <div className="spinner">
                    <div className="rect1"></div>
                    <div className="rect2"></div>
                    <div className="rect3"></div>
                    <div className="rect4"></div>
                    <div className="rect5"></div>
                </div>
            );
        }

        return (
            <div className="column is-8 is-offset-2 admin-container">
                <Helmet>
                    <title>Bookshelf | Manage Books</title>
                </Helmet>
                <div className="card admin-card">
                    <div className="card-content">
                        <div className="media">
                            <div className="admin-image-header-container">
                                <FontAwesomeIcon icon={faEye} className="admin-icon" size="lg"/>
                            </div>
                        </div>
                        <Modal isOpen={this.state.modalIsOpen} onRequestClose={this.closeModal} style={customStyles}>
                            <form onSubmit={this.handleSubmit}>
                                <p>Are you sure?</p>
                                <div className="modal-actions">
                                    <button className={this.state.submitting ? "button is-success is-loading" : "button is-success"} type="submit">Yes</button>
                                    <button id="cancel" className="button is-danger" onClick={this.closeModal}>No</button>
                                </div>
                            </form>
                        </Modal>
                        <h1 className="title">Books</h1>
                        {this.state.success ? 
                            <div className="notification is-primary">Successfully removed entry.</div>
                            :
                            null
                        }
                        <div className="admin-table">
                            <table className="table is-fullwidth is-bordered">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Category</th>
                                        <th>Rating</th>
                                        <th>Edit</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.props.books.map(book =>
                                        <tr key={book.id}>
                                            <td>{book.title}</td>
                                            <td>{book.author}</td>
                                            <td>
                                                {this.props.categories.find(c => c.id === book.categoryId)
                                                ? 
                                                this.props.categories.find(c => c.id === book.categoryId).description
                                                :
                                                '-'}
                                            </td>
                                            <td>
                                                {this.props.ratings.find(r => r.id === book.ratingId)
                                                ? 
                                                this.props.ratings.find(r => r.id === book.ratingId).description
                                                :
                                                '-'}
                                            </td>
                                            <td className="has-text-centered">
                                                <Link to={'/admin/book-form/' + book.id}><button className="button is-outlined" disabled={this.state.submitting}>Edit</button></Link>
                                            </td>
                                            <td className="has-text-centered">
                                                <button onClick={() => this.openModal(book)} className="button is-outlined" disabled={this.state.submitting}>Delete</button>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                                </table>
                            </div>
                            <div>   
                            <Link to={'/admin/book-form'}><button className="button is-outlined">Add</button></Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    books: state.books.items,
    categories: state.categories.items,
    ratings: state.ratings.items,
    removedBook: state.books.item,
    token: state.user.token
});

export default connect(mapStateToProps, {fetchBooks, fetchCategories, fetchRatings, removeBook})(ManageBooks);