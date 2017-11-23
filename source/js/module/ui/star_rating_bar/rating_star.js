const	React		= require('react'),

	{If}		= require('../if/if'),
		classNames	= require('classnames');

const StarRatingBar = React.createClass({
	propTypes: {
		isChecked:		React.PropTypes.bool,
		isEditMode:		React.PropTypes.bool,
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
			bRatingStar	: true,
			mBlue		: self.props.isChecked,
			mGray		: !self.props.isChecked && !self.props.isEditMode,
			mEditMode 	: self.props.isEditMode
		});

		return (
			<div className={ratingStarClassName} onClick={self.handleClick}>
				<If condition={self.props.isChecked}>
					<i className="fa fa-star" aria-hidden="true"></i>
				</If>
				<If condition={!self.props.isChecked && !self.props.isEditMode}>
					<i className="fa fa-star" aria-hidden="true"></i>
				</If>
				<If condition={!self.props.isChecked && self.props.isEditMode}>
					<i className="fa fa-star-o" aria-hidden="true"></i>
				</If>
			</div>
		);
	}
});

module.exports = StarRatingBar;


