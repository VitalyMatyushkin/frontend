const 	React			= require('react'),
		TopLogoStyles	= require('styles/main/b_top_logo.scss');

const Logo = React.createClass({
	onLogoClick: function(){
		document.location.hash = 'admin_schools';
	},
	render: function() {
		return (
			<div className="bTopLogo" onClick={this.onLogoClick}>
				<img src="images/logo.svg"/>
				<span> Admin Portal </span>
			</div>
		);
	}
});

module.exports = Logo;
