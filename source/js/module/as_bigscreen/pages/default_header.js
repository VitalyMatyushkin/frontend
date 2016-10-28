const React = require('react');

const DefaultHeader = React.createClass({
	propTypes: {
		title: React.PropTypes.string.isRequired
	},

	render: function() {
		return (
			<div className="bBigScreenTitle">
				<div className="eBigScreenTitle_title">
					{ this.props.title }
				</div>
				<div className="eBigScreenTitle_logo">
					LOGO
				</div>
				<div className="eBigScreenTitle_time">
					TIME
				</div>
			</div>
		);
	}
});


module.exports = DefaultHeader;