const React = require('react');

function CrossButton(props) {
	const	extraClassName	= props.extraClassName || '',
			className		= `bButton mCircle mCross ${extraClassName}`;

	return (
		<div	className	= { className }
				onClick		= { props.handleClick }
		>
			<i className="eCustomFont eCustomFont-cross"/>
		</div>
	);
}

CrossButton.propTypes = {
	handleClick:	React.PropTypes.func.isRequired,
	extraClassName:	React.PropTypes.string
};

module.exports = CrossButton;