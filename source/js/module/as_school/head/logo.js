var Logo,
	React = require('react');

Logo = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this;

		return (
			<div className="bPublicLogo">SquadIntouch</div>
		)
	}
});

module.exports = Logo;
