const	React			= require('react'),
		propz 			= require('propz'),
		Bootstrap		= require('styles/bootstrap-custom.scss'),
		InviteStyles	= require('styles/pages/events/b_invite.scss');

const ChildName = React.createClass({
	propTypes: {
		message: React.PropTypes.object.isRequired
	},
	render: function() {
		const 	firstName 	= propz.get(this.props.message, ['playerDetailsData', 'firstName']),
				lastName 	= propz.get(this.props.message, ['playerDetailsData', 'lastName']),
				fullName 	= `${firstName}  ${lastName}`;
		return (
			<h4>{ fullName }</h4>
		);
	}
});

module.exports = ChildName;