
import React, { Component, createRef } from 'react';
import authService from './api-authorization/AuthorizeService'

export class Event extends Component {
    static displayName = Event.name;

    constructor(props) {
        super(props);

        this.formRef = createRef();
        this.state = {
            events: [],
            loading: false,
            selectedId: null
        };
    }

    componentDidMount = () => {
        this.populateEvents();
    }

    populateEvents = async () => {
        this.setState({ loading: true });

        try {
            const token = await authService.getAccessToken();
            const response = await fetch('event', {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            this.setState({ events: data});
        } catch (err) {
            window.alert(err.message);
        } finally {
            this.setState({ loading: false });
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        
        const body = {};
        for (const [key, value] of form.entries()) {
            body[key] = value;
        }

        this.setState({ loading: true });
        const token = await authService.getAccessToken();
        const headers = !token ? {} : { 'Authorization': `Bearer ${token}` }
        headers['Content-Type'] = "application/json";

        if (this.state.selectedId) {
            try {
                const response = await fetch('event/' + this.state.selectedId, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(body)
                });
                const data = await response.json();
                e.target.reset();

                this.populateEvents();
            } catch (err) {
                window.alert(err.message)
            } finally {
                this.setState({ loading: false });
            }
        } else {
            try {
                const response = await fetch('event', {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(body)
                });
                const data = await response.json();

                this.populateEvents();
            } catch (err) {
                window.alert(err.message)
            } finally {
                this.setState({ loading: false });
            }
        }
    }

    toggleEdit = (data) => {
        this.setState({
            selectedId: data.id
        });

        this.formRef.current['title'].value = data.title
        this.formRef.current['summary'].value = data.summary
        this.formRef.current['description'].value = data.description
    }

    toggleDelete = async (id) => {
        const confirmation = window.confirm("Are you sure?")
        if (confirmation) {
            this.setState({ loading: true });
            const token = await authService.getAccessToken();
            const headers = !token ? {} : { 'Authorization': `Bearer ${token}` }

            try {
                const response = await fetch('event/' + id, {
                    method: 'DELETE',
                    headers,
                });

                this.populateEvents();
            } catch (err) {
                window.alert(err.message)
            } finally {
                this.setState({ loading: false });
            }
        }
    }

    render() {
        return (
            <div className="container py-4">
                <h3>Add Event</h3>

                <form ref={this.formRef} onSubmit={this.handleSubmit} method="POST" className="card">
                    <div className="card-body">
                        <div className="mb-2">
                            <label>Event Title</label>
                            <input disabled={this.state.loading} className="form-control" name="title" required />
                        </div>

                        <div className="mb-2">
                            <label>Event Summary</label>
                            <input disabled={this.state.loading} className="form-control" name="summary" required />
                        </div>

                        <div className="mb-2">
                            <label>Event Description</label>
                            <textarea disabled={this.state.loading} className="form-control" name="description" required></textarea>
                        </div>
                    </div>

                    <div className="card-footer">
                        <button disabled={this.state.loading} className="btn btn-primary">Save</button>
                    </div>
                </form>

                <h3 className="my-3">Manage Events</h3>

                <div className="row">
                    {this.state.events.map((event) => {
                        return (
                            <div className="col-md-4 mb-3">
                                <div className="card">
                                    <div className="card-body">
                                        <h4>{event.title}</h4>
                                        <p>{event.description}</p>
                                    </div>
                                    <div className="card-footer text-end">
                                        <a className="text-warning" href="javascript:void(0)" onClick={(e) => this.toggleEdit(event)}>Edit</a> | <a className="text-danger" href="javascript:void(0)" onClick={ (e) => this.toggleDelete(event.id)}>Delete</a>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                    </div>
            </div>
        )
    }
}