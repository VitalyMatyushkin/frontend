const React = require('react');

function PencilButton(props) {
	return (
		<div	className	= "bButton mCircle"
				onClick		= {props.handleClick}
		>
			<i className="fa fa-pencil" aria-hidden="true"/>
		</div>
	);
}

PencilButton.propTypes = {
	handleClick: React.PropTypes.func.isRequired
};

module.exports = PencilButton;