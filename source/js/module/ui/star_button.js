const React = require('react');

function StarButton(props) {
	const star = props.isEnable ?
		<i className="eButton_star fa fa-star fa-lg" aria-hidden="true"></i> : <i className="eButton_star mDisable fa fa-star fa-lg" aria-hidden="true"></i>

	return (
		<div	className	= "bButton mStar"
				onClick		= {props.handleClick}
		>
			{star}
		</div>
	);
}

StarButton.propTypes = {
	isEnable: React.PropTypes.bool.isRequired,
	handleClick: React.PropTypes.func.isRequired
};

module.exports = StarButton;