const React = require('react');

function CrossButton(props) {
	return (
		<div	className	= "bButton mCircle mCross"
				onClick		= {props.handleClick}
		>
			<i className="eCustomFont eCustomFont-cross"/>
		</div>
	);
}

CrossButton.propTypes = {
	handleClick: React.PropTypes.func.isRequired
};

module.exports = CrossButton;