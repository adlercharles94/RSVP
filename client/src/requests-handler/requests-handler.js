import axios from 'axios'

//helper functions to send http requests to the server
export const createOrUpdateRsvp = (payload) => axios.post('http://localhost:3000/rsvps/', payload);
export const getAttendeeList = () => axios.get('http://localhost:3000/rsvps/attendees/');

const handlers = {
    createOrUpdateRsvp,
    getAttendeeList
}

export default handlers;