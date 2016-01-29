var Logo,
	React = require('react');

Logo = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this;

		return (
			<div className="bPublicLogo"></div>
		)
	}
});

module.exports = Logo;
