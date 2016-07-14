
const 	React 		= require('react'),
		Morearty    = require('morearty');

const Logo = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		return (
			<div className="bPublicLogo"></div>
		)
	}
});

module.exports = Logo;
