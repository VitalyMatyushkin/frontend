const React = require('react');

function SquareCrossButton(props) {
	return (
		<div	className	= "bButton mSquareCrossButton"
				onClick		= {props.handleClick}
		>
			<i className="eButton_cross fa fa-times fa-lg" aria-hidden="true"></i>
		</div>
	);
}

SquareCrossButton.propTypes = {
	handleClick: React.PropTypes.func.isRequired
};

module.exports = SquareCrossButton;