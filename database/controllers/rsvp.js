const Rsvp = require('../models/rsvp.js');

//create new rsvp document with user info sent from the client
const createRsvp = (req, res) => {
    const body = req.body;

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide rsvp info',
        })
    }

    const rsvp = new Rsvp(body);

    if (!rsvp) {
        return res.status(400).json({ success: false, error: err })
    }

    rsvp
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: rsvp._id,
                message: 'rsvp created',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'rsvp not created',
            })
        })
};

//uses user email(the only info guaranteed to be unique) to find rsvp document. Creates new document if not found
const findRsvpAndUpdate = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide rsvp to update',
        })
    }

    Rsvp.findOne({email: body.email}, (err, rsvp) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'rsvp not updated',
            })
        }
        
        if(!rsvp){
            createRsvp(req, res);
        }
        else{
            rsvp.firstName = body.firstName
            rsvp.lastName = body.lastName
            rsvp.email = body.email
            rsvp.guests = body.guests
            rsvp
                .save()
                .then(() => {
                    return res.status(200).json({
                        success: true,
                        id: rsvp._id,
                        message: 'rsvp updated'
                    })
                })
                .catch(error => {
                    return res.status(404).json({
                        error,
                        message: 'Rsvp not updated',
                    })
                })
        }
    
    })

};

//returns list of objects containing attendees' fist and last names
const getAttendees = async (req, res) => {
    await Rsvp.find({}, (err, rsvps) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!rsvps.length) {
            return res
                .status(404)
                .json({ success: false, error: 'No rsvps found' });
        }
        return res.status(200).json({
            success: true, 
            data: rsvps.map((rsvp) => {
                return {
                    firstName: rsvp.firstName,
                    lastName: rsvp.lastName
                }
            })
        });
    }).catch(err => console.log(err))
}

module.exports = {
    findRsvpAndUpdate,
    createRsvp,
    getAttendees
};
