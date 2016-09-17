const	React		= require('react'),
		RatingStar	= require('./rating_star');

const StarRatingBar = React.createClass({
	propTypes: {
		// max count of rating stars
		starCount:			React.PropTypes.number.isRequired,
		// count of rating stars
		value:				React.PropTypes.number,
		// handle changes of star rating value
		handleValueChanges:	React.PropTypes.func
	},
	getDefaultProps: function() {
		return {
			ratingValue: 0
		};
	},
	handleClick: function(value, isChecked) {
		const self = this;

		self.props.handleValueChanges(isChecked ? value : value - 1);
	},
	render: function () {
		const self = this;

		const stars = [];

		for(let i = 1; i <= self.props.starCount; i++) {
			stars.push(
				<RatingStar
					key={`${i}_rating_star`}
					isChecked={i <= self.props.value}
					value={i}
					handleClick={self.handleClick}
				/>
			);
		}

		return (
			<div className="bStarRatingBar">
				{stars}
			</div>
		);
	}
});

module.exports = StarRatingBar;


