const	React			= require('react'),
		propz			= require('propz'),
		Map				= require('module/ui/map/map2'),
		Bootstrap		= require('styles/bootstrap-custom.scss'),
		InviteStyles	= require('styles/pages/events/b_invite.scss');

const Message = React.createClass({
	propTypes: {
		message: React.PropTypes.object.isRequired
	},
	render: function() {
		const	message		= this.props.message,
				venue		= propz.get(message, ['eventData', 'venue']),
				point		= propz.get(venue, ['postcodeData', 'point']);

		const venueArea = venue.postcodeId ?
			<Map point={point} /> :
			<span className="eInvite_venue">Venue to be defined</span>;

		return (
			<div className="eInvite_map">{venueArea}</div>
		);
	}
});

module.exports = Message;