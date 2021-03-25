import React from 'react';
import reqHandler from '../requests-handler/requests-handler.js';
import InsertConfirmation from './InsertConfirmation.jsx';
import UpdateConfirmation from './UpdateConfirmation.jsx';
import AttendeeList from './AttendeeList.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      guests: "",
      submitEnabled: false,
      submitResponse: {},
      attendeeList: [],
      showAttendeeList: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.showForm = this.showForm.bind(this);
    this.showAttendees = this.showAttendees.bind(this);
  }

  //gets list of attendees from database on load
  componentDidMount() {
    reqHandler.getAttendeeList()
      .then(res => {
        this.setState({
          attendeeList: res.data.data
        });
      });
  }

  //fucntion using regex to check if the email entered by the user is well formatted
  validateEmail(email) {
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(String(email).toLowerCase());
  }

  //returns false if first name, last name, eamail and number of guests are not set by user
  validateInputs() {
    for (var value in this.state) {
      if (this.state.hasOwnProperty(value) && !this.state[value] && value !== "submitEnabled" && value !== "showAttendeeList") {
        return false;
      }
    }
    return true;
  }

  //updates the changed field and then checks if email and other inputs are valid to decide if we can enable the submit button
  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({
      [name]: value
    }, () => {
      this.setState({
        submitEnabled: this.validateInputs() && this.validateEmail(this.state.email)
      });
    });

  }

  //sends user info to rsvps endpoint to create or update rsvp then updates 'submitResponse' with a message about the operation performed.
  //Adds empty string to 'attendeeList'. This is useful after first attendee is added, we now know we can show the 'View Attendees' button
  handleSubmit(event) {
    const userInfo = (({ firstName, lastName, email, guests }) => ({ firstName, lastName, email, guests }))(this.state);

    reqHandler.createOrUpdateRsvp(userInfo)
      .then(res => {
        this.setState({
          submitResponse: res.data,
          attendeeList: ['']
        });
      });
    event.preventDefault();
  }

  //returns to the form asking for user info by resetting states to initial values
  showForm(event) {
    this.setState({
      firstName: '',
      lastName: '',
      email: '',
      guests: '',
      submitResponse: {},
      showAttendeeList: false,
      submitEnabled: false
    });
    event.preventDefault();
  }

  //gets list of attendees from database and sets 'showAttendeeList' to true so the view of attendees can be rendered
  showAttendees(event) {
    reqHandler.getAttendeeList()
      .then(res => {
        this.setState({
          attendeeList: res.data.data
        });
      });

    this.setState({
      showAttendeeList: true
    });
    event.preventDefault();
  }

  //Renders the 'InsertConfirmation' view if a new rsvp was created, the 'UpdateConfirmation' view if one was updated, the 'AttendeeList' view if 
  //we click one the 'View Attendees' button, or the input form otherwise.
  render() {
    const operation = this.state.submitResponse && this.state.submitResponse.message;
    let view;

    if (operation === "rsvp created") {
      view = <div><InsertConfirmation rsvp={this.state} />
        <button onClick={this.showForm}>Back</button>
      </div>;
    }
    else if (operation === "rsvp updated") {
      view = <div><UpdateConfirmation rsvp={this.state} />
        <button onClick={this.showForm}>Back</button>
      </div>;
    }
    else if (this.state.showAttendeeList) {
      view = <div><AttendeeList rsvps={this.state.attendeeList} />
        <button onClick={this.showForm}>Back</button>
      </div>;
    }
    else {
      view = <form onSubmit={this.handleSubmit}>
        <label>
          First Name:
        <input type="text" name="firstName" value={this.state.firstName} onChange={this.handleChange} />
        </label>
        <br />
        <label>
          Last Name:
        <input type="text" name="lastName" value={this.state.lastName} onChange={this.handleChange} />
        </label>
        <br />
        <label>
          Email Address:
        <input type="text" name="email" value={this.state.email} onChange={this.handleChange} />
        </label>
        <br />
        <label>
          Number of Guests:
        <input type="text" name="guests" value={this.state.guests} onChange={this.handleChange} />
        </label>
        <br />
        <input type="submit" value="Submit" disabled={!this.state.submitEnabled} />
        <br />
      </form>;
    }

    return (
      <div>
        {view}
        {this.state.attendeeList.length && !operation && !this.state.showAttendeeList ?
          <button className="info" onClick={this.showAttendees}>View Attendees</button>
          : null}
      </div>
    );
  }
}

export default App;


