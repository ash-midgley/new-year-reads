import React from 'react';
import './my-account.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMask } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Loading from '../loading/loading';

class MyAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: localStorage.getItem('userEmail'),
            shelfPath: this.getShelfPath(),
            copyText: null
        };
    }

    getShelfPath() {
        var userId = localStorage.getItem('userId');
        return `${window.location.protocol}//${window.location.host}/shelf/${userId}`;
    }
    
    copyToClipboard = (e) => {
        e.preventDefault();
        this.shelfPath.select();
        document.execCommand('copy');
        e.target.focus();

        this.setState({ 
            copyText: 'Copied to clipboard!'
        });

        setTimeout(
            function() {
                this.setState({
                    copyText: null
                });
            }
            .bind(this), 2000
        );
    }

    render() {
        if(this.state.loading) {
            return (
              <Loading />  
            );
        }

        return (
            <div className="column is-8 is-offset-2 category-form-container"> 
                <div className="card review-card">
                    <div className="card-content">
                    <div className="media">
                        <div className="image-header-container">
                            <FontAwesomeIcon icon={faMask} className="mask-icon" size="lg"/>
                        </div>
                    </div>
                    <form className="form">
                        <div className="field">
                            <label className="label">Email</label>
                            <div className="columns">
                                <div className="column">
                                    <div className="control">
                                        <input className='input' type="text" value={this.state.email} readOnly />
                                    </div>
                                </div>
                                <div className="column is-2">
                                    <Link to="/edit-email" className="button">Edit</Link>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Password</label>
                            <div className="columns">
                                <div className="column">
                                    <div className="control">
                                        <input className='input' type="password" value="placeholder" readOnly />
                                    </div>
                                </div>
                                <div className="column is-2">
                                    <Link to="/edit-password" className="button">Edit</Link>
                                </div>
                            </div>
                        </div>
                        <div className="field">
                            <label className="label">Share Shelf</label>
                            <div className="columns" style={{'marginBottom': '0'}}>
                                <div className="column">
                                    <div className="control">
                                        <input 
                                            ref={(input) => this.shelfPath = input} 
                                            className='input' type="text" name="id" readOnly
                                            value={this.state.shelfPath} 
                                        />
                                    </div>
                                </div>
                                {
                                    document.queryCommandSupported('copy') &&
                                    <div className="column is-2">
                                        <button className="button" onClick={this.copyToClipboard}>Copy</button>
                                    </div>
                                }
                            </div>
                            <p className="is-size-7">{this.state.copyText}</p>  
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default MyAccount;