import React, { Component, createRef } from 'react';

export class EventDetail extends Component {

    constructor(props) {
        super(props);

        this.formRef = createRef();
        this.state = {
            event: [],
            participants: [],
            loading: false,
        };
    }

    render() {
        return (
            <div className="container py-3">
                <h3>Event Title</h3>

                <div className="card">
                    <div className="card-body">
                        <b>Event Summary</b>

                        <hr />

                        <p>Event Description</p>
                    </div>
                </div>

                <h3 className="my-3">Participants</h3>
                <div className="row">
                    <div className="col-md-7">
                        <div className="card mb-3">
                            <div className="card-body">
                                <h5>Name</h5>
                                <span>Email@mail.com <a className="text-danger">Remove</a></span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="card mb-3">
                            <div className="card-body">

                                <div className="mb-2">
                                    <label>Fullname</label>
                                    <input disabled={this.state.loading} className="form-control" name="name" required />
                                </div>

                                <div className="mb-2">
                                    <label>Email Address</label>
                                    <input disabled={this.state.loading} className="form-control" name="email" type="email" required />
                                </div>
                            </div>

                            <div className="card-footer">
                                <button disabled={this.state.loading} className="btn btn-primary">Register</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}