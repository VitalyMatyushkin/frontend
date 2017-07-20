const	React						= require('react');

const	SmallCrossButtonCssStyle	= require('../../../../styles/ui/b_small_cross_button.scss');

function SmallCrossButton(props) {
	const	extraStyleClasses	= props.extraStyleClasses || '',
			className			= `bSmallCrossButton ${extraStyleClasses}`;

	return (
		<div	className	= {className}
				onMouseDown	= {props.onClick}
		>
			<i className="fa fa-times"/>
		</div>
	);
}

SmallCrossButton.propTypes = {
	onClick:			React.PropTypes.func,	// function to be called on click
	extraStyleClasses:	React.PropTypes.string	// if one need to add extra styles to button.
};

module.exports = SmallCrossButton;