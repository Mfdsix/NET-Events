import React, { Component, useRef, useState, useEffect } from 'react';
import authService from './api-authorization/AuthorizeService';
import { useParams } from 'react-router-dom';

export function EventDetail() {
    const [loading, setLoading] = useState(false);
    const [event, setEvent] = useState(null);
    const [participants, setParticipants] = useState([]);
    const { id } = useParams();

    const formRef = useRef();

    useEffect(() => {
        populateEvent();
        populateParticipants();
    }, [])

    const populateEvent = async () => {
        setLoading(true);

        try {
            const token = await authService.getAccessToken();
            const response = await fetch('event/' + id, {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setEvent(data);
        } catch (err) {
            window.alert(err.message);
        } finally {
            setLoading(false);
        }
    }

    const populateParticipants = async () => {
        setLoading(true);

        try {
            const token = await authService.getAccessToken();
            const response = await fetch('event3?event_id=' + id, {
                headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setParticipants(data);
        } catch (err) {
            window.alert(err.message);
        } finally {
            setLoading(false);
        }
    }

    const toggleRemoveParticipant = async (_id) => {
        const confirmation = window.confirm("Are you sure?")
        if (confirmation) {
            setLoading(true);
            const token = await authService.getAccessToken();
            const headers = !token ? {} : { 'Authorization': `Bearer ${token}` }

            try {
                const response = await fetch('event3/' + _id, {
                    method: 'DELETE',
                    headers,
                });

                populateParticipants();
            } catch (err) {
                window.alert(err.message)
            } finally {
                setLoading(false);
            }
        }
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);

        const body = {};
        for (const [key, value] of form.entries()) {
            body[key] = value;
        }
        body['eventId'] = id;

        setLoading(true);
        const token = await authService.getAccessToken();
        const headers = !token ? {} : { 'Authorization': `Bearer ${token}` }
        headers['Content-Type'] = "application/json";

        try {
            const response = await fetch('event3', {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });
            const data = await response.json();
            e.target.reset();

            populateParticipants();
        } catch (err) {
            console.log(err)
            window.alert(err.message)
        } finally {
            setLoading(false);
        }
    }

        return (
            <div className="container py-3">
                <h3>
                    {loading && <>loading...</>}
                    {!loading && event && <>
                        {event.title}
                    </>}
                </h3>

                <div className="card">
                    <div className="card-body">
                        {loading && <>loading...</>}
                        {!loading && event && <>
                            <b>{ event.summary}</b>

                            <hr />

                            <p>{ event.description }</p>
                        </>}
                    </div>
                </div>

                <h3 className="my-3">Participants</h3>
                <div className="row">
                    <div className="col-md-7">
                        {participants.length == 0 && <span>No participant</span>}
                        {participants.length > 0 && participants.map((participant) => {
                            return <div key={ participant.id } className="card mb-3">
                                <div className="card-body">
                                    <h5>{participant.name}</h5>
                                    <span>{participant.email} {!loading && < a href="javascript:void(0)" onClick={(e) => toggleRemoveParticipant(participant.id)} className="text-danger">Remove</a>}</span>
                                </div>
                            </div>
                        })}
                    </div>
                    <div className="col-md-5">
                        <form onSubmit={ onSubmit } method="POST" ref={formRef} className="card mb-3">
                            <div className="card-body">

                                <div className="mb-2">
                                    <label>Fullname</label>
                                    <input disabled={loading} className="form-control" name="name" required />
                                </div>

                                <div className="mb-2">
                                    <label>Email Address</label>
                                    <input disabled={loading} className="form-control" name="email" type="email" required />
                                </div>
                            </div>

                            <div className="card-footer">
                                <button disabled={loading} className="btn btn-primary">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
}