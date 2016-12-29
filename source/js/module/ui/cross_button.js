const React = require('react');

function CrossButton(props) {
	return (
		<div	className	= "bButton mCircle"
				onClick		= {props.handleClick}
		>
			<i className="fa fa-times" aria-hidden="true"/>
		</div>
	);
}

CrossButton.propTypes = {
	handleClick: React.PropTypes.func.isRequired
};

module.exports = CrossButton;