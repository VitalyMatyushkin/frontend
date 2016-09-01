const	React		= require('react'),
		classNames	= require('classnames');

const StarRatingBar = React.createClass({
	propTypes: {
		isChecked:		React.PropTypes.bool,
		value:			React.PropTypes.number.isRequired,
		handleClick:	React.PropTypes.func
	},
	getDefaultProps: function() {
		return {
			isChecked: false
		};
	},
	handleClick: function() {
		const self = this;

		self.props.handleClick(self.props.value, !self.props.isChecked);
	},
	render: function () {
		const self = this;

		const ratingStarClassName = classNames({
			bRatingStar:	true,
			mChecked:		self.props.isChecked
		});

		return (
			<div className={ratingStarClassName} onClick={self.handleClick}>
			</div>
		);
	}
});

module.exports = StarRatingBar;


