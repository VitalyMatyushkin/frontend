const React = require('react');

function PencilButton(props) {
	const 	extraClassName = props.extraClassName || '',
			className = `bButton mCircle ${extraClassName}`;
	return (
		<div	className	= {className}
				onClick		= {props.handleClick}
		>
			<i className="fa fa-pencil" aria-hidden="true"/>
		</div>
	);
}

PencilButton.propTypes = {
	handleClick: React.PropTypes.func.isRequired,
	extraClassName: 	React.PropTypes.string
};

module.exports = PencilButton;