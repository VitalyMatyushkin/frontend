const React = require('react');

const PlayerInfo = React.createClass({
	render: function() {
		return (
			<span className="ePlayer_star">
				<i className="fa fa-star fa-lg" aria-hidden="true"></i>
			</span>
		);
	}
});

module.exports = PlayerInfo;