const	React				= require('react');

const	CrossButtonCssStyle	= require('../../../../styles/ui/b_cross_button.scss');

function CrossButton(props) {
	const	extraStyleClasses	= props.extraStyleClasses || '',
			className			= `bCrossButton ${extraStyleClasses}`;

	return (
		<div	className	= {className}
				onClick		= {props.onClick}
		>
			<i className="eCustomFont eCustomFont-cross"/>
		</div>
	);
}

CrossButton.propTypes = {
	onClick:			React.PropTypes.func,	// function to be called on click
	extraStyleClasses:	React.PropTypes.string	// if one need to add extra styles to button.
};

module.exports = CrossButton;