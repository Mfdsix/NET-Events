import React, { Component } from 'react';
import authService from './api-authorization/AuthorizeService';
import { Link } from 'react-router-dom';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);

        this.state = {
            events: [],
            loading: false
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
            this.setState({ events: data });
        } catch (err) {
            window.alert(err.message);
        } finally {
            this.setState({ loading: false });
        }
    }

  render() {
    return (
        <div className="container py-4">
            <h3>Discover Available Events</h3>
            
            <div className="row">
                {this.state.events.map((event) => {
                    return (
                        <div key={ event.id} className="col-md-4 mb-3">
                            <div className="card">
                                <div className="card-body">
                                    <h4>{event.title}</h4>
                                    <p>{event.description}</p>
                                </div>
                                <div className="card-footer text-end">
                                    <Link to={ "/events/" + event.id }>Register</Link>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
  }
}
