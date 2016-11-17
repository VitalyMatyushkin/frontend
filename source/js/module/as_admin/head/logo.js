const 	React			= require('react'),
		TopLogoStyles	= require('styles/main/b_top_logo.scss');

const Logo = React.createClass({
	render: function() {
		return (
			<div className="bTopLogo">SquadInTouch - Admin Portal</div>
		);
	}
});

module.exports = Logo;
