const React = require('react');

const Logo = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		return (
			<div className="bTopLogo">
			<img src = "images/logo.png"></img>
			</div>
		)
	}
});

module.exports = Logo;
