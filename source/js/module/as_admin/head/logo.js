const 	React			= require('react'),
		TopLogoStyles	= require('styles/main/b_top_logo.scss');

const Logo = React.createClass({
	render: function() {
		return (
			<div className="bTopLogo">
				<img src="images/logo.png"/>
				<span> Admin Portal </span>
			</div>
		);
	}
});

module.exports = Logo;
