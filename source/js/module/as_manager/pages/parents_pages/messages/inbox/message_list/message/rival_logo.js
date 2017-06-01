const	React			= require('react'),
		propz			= require('propz'),
		Bootstrap		= require('styles/bootstrap-custom.scss'),
		InviteStyles	= require('styles/pages/events/b_invite.scss');

const RivalLogo = React.createClass({
	propTypes: {
		message: React.PropTypes.object.isRequired
	},
	getRival: function() {
		const	message	= this.props.message,
				child	= message.child;

		let rival;

		if(child.schoolId === message.inviterSchoolId) {
			rival = message.invitedSchool
		} else if(child.schoolId === message.invitedSchoolId) {
			rival = message.inviterSchool
		}

		return rival;
	},
	getRivalLogoStyle: function() {
		let rivalLogoStyle = {
			backgroundImage: `url(/images/no_logo.jpg)`
		};

		const rival = this.getRival();

		const pic = propz.get(rival, ['pic']);
		if(typeof pic !== 'undefined'){
			rivalLogoStyle.backgroundImage = `url(${pic})`
		}

		return rivalLogoStyle;
	},
	render: function() {
		return (
			<div className="col-md-5 col-sm-5">
				<div
					className	= "eInvite_img"
					style		= { this.getRivalLogoStyle() }
				>
				</div>
			</div>
		);
	}
});

module.exports = RivalLogo;