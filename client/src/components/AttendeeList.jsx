import React from 'react';

const ListItem = (props) => {
    return <li className="info-text">{props.firstname} {props.lastname}</li>;
}

const AttendeeList = ({ rsvps }) => {
    const listItems = rsvps.map((rsvp, index) =>
        <ListItem key={index.toString()} firstname={rsvp.firstName} lastname={rsvp.lastName} />
    );
    return (
        <div>
        <h1 className="info-text">  Attendees</h1>
        <ul>
            {listItems}
        </ul>
        </div>
    );
}


export default AttendeeList;