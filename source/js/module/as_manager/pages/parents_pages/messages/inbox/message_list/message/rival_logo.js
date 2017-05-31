const	React			= require('react'),
		Bootstrap		= require('styles/bootstrap-custom.scss'),
		InviteStyles	= require('styles/pages/events/b_invite.scss');

const RivalLogo = React.createClass({
	render: function() {
		let rivalLogoStyle = '';

		//TODO get rival logo

		return (
			<div className="col-md-5 col-sm-5">
				<div
					className	= "eInvite_img"
					style		= {rivalLogoStyle}
				>
				</div>
			</div>
		);
	}
});

module.exports = RivalLogo;