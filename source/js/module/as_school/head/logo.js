
const React = require('react');

const Logo = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		return (
			<div className="bPublicLogo"></div>
		)
	}
});

module.exports = Logo;
