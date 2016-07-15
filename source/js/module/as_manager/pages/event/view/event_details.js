const   React       = require('react'),
        Morearty	= require('morearty');

const EventDetails = React.createClass({
    mixins: [Morearty.Mixin],
    render: function () {

        return (<div className="bEventDetails">

            <div className="eForm_fieldName">Coach</div>
            <div className="eForm_fieldName">Members Of Staff</div>
            <div className="eForm_fieldName">Departure time</div>
            <div className="eForm_fieldName">Arrival time</div>
            <div className="eForm_fieldName">Meet time</div>
            <div className="eForm_fieldName">Lunch time</div>
            <div className="eForm_fieldName">Tea time</div>
            <div className="eForm_fieldName">Further information</div>
        </div>)
    }
});

module.exports = EventDetails;