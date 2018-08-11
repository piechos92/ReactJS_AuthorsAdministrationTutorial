"use strict";

var React = require('react');
var Router = require('react-router');
var AuthorForm = require('./authorForm');
var AuthorAPI = require('../../api/authorApi');
var Toastr = require('toastr');

var ManageAuthorPage = React.createClass({

    mixins: [
        Router.Navigation
    ],

    statics: {
        willTransitionFrom: function(transition, component) {
            if(component.state.dirty && !confirm("Leave without saving?")) {
                transition.abort();
            }
        }
    },
    
    getInitialState: function() {
        return {
            author: {id: '', firstName: '', lastName: ''},
            errors: {},
            dirty: false 
        };
    },

    componentWillMount: function() {
        var authorId = this.props.params.id; //from the path 'author/:id'

        if(authorId) {
            this.setState({author: AuthorAPI.getAuthorById(authorId)});
        }
    },

    setAuthorState: function(event) {
        var field = event.target.name;
        var value = event.target.value;
        this.state.author[field] = value;
        this.setState({dirty: false});
        for(var prop in this.state.author) {
            if(this.state.author[prop] !== "") {
                this.setState({dirty: true});
            } 
        }
        return this.setState({author: this.state.author});
    },

    authorFormIsValid: function() {
        var formIsValid = true;
        this.state.errors = {}; //clear any previous errors

        if(this.state.author.firstName.length < 3) {
            this.state.errors.firstName = 'First name must be at least 3 charactes.';
            formIsValid = false;
        }

        if(this.state.author.lastName.length < 3) {
            this.state.errors.lastName = 'Last name must be at least 3 charactes.';
            formIsValid = false;
        }

        this.setState({errors: this.state.errors});
        return formIsValid;
    },
    
    saveAuthor: function(event) {
        event.preventDefault();

        if(!this.authorFormIsValid()) {
            return;
        }

        AuthorAPI.saveAuthor(this.state.author);
        this.setState({dirty: false});
        Toastr.success('Author saved');
        this.transitionTo('authors');
    },

    render: function() {
        return (
            <AuthorForm 
                author={this.state.author}
                onChange={this.setAuthorState}
                onSave={this.saveAuthor}
                errors={this.state.errors}/>
        );
    }
});

module.exports = ManageAuthorPage;