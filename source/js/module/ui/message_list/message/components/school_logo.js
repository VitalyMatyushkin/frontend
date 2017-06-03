const	React			= require('react'),
		propz			= require('propz'),
		MessageHelper	= require('module/ui/message_list/message/helpers/message_helper'),
		Bootstrap		= require('styles/bootstrap-custom.scss'),
		InviteStyles	= require('styles/pages/events/b_invite.scss');

const SchoolLogo = React.createClass({
	propTypes: {
		message: React.PropTypes.object.isRequired
	},
	getLogoStyle: function() {
		let schoolLogoStyle = {
			backgroundImage: `url(/images/no_logo.jpg)`
		};

		const school = MessageHelper.getSchool(this.props.message);

		const pic = propz.get(school, ['pic']);
		if(typeof pic !== 'undefined'){
			schoolLogoStyle.backgroundImage = `url(${pic})`;
		}

		return schoolLogoStyle;
	},
	render: function() {
		return (
			<div className="col-md-5 col-sm-5">
				<div
					className	= "eInvite_img"
					style		= { this.getLogoStyle() }
				>
				</div>
			</div>
		);
	}
});

module.exports = SchoolLogo;