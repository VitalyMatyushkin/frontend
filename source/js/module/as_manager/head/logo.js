var Logo, React;
React = require('react');

Logo = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this;

		return (
			<div className="bTopLogo">SquadIntouch</div>
		)
	}
});

module.exports = Logo;
