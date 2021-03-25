import React from 'react';

const InsertConfirmation = ({ rsvp }) => {
  return (
    <div>
      <p className="info-text">
        {`${rsvp.firstName}, you and your ${rsvp.guests} guests are now on the list.
        We\'ll send an email confirmation to ${rsvp.email}.`}
      </p>
    </div>
  );
};

export default InsertConfirmation;