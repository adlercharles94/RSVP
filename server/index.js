const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require(__dirname + '/../database');
const Rsvp = require(__dirname + '/../database/controllers/rsvp.js');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.post('/rsvps',  (req, res) => {
    Rsvp.findRsvpAndUpdate(req, res);
});

app.get('/rsvps/attendees',  (req, res) => {
    Rsvp.getAttendees(req, res);
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
