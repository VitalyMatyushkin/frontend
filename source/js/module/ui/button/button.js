/**
 * Created by wert on 13.09.16.
 */

const	React			= require('react'),
		ButtonCssStyle	= require('../../../../styles/ui/b_button.scss');

/** Just Button. Buttons are clickable and have some text inside.
 * Maybe it should also take children for displaying icons or something like that, but we don't use it now,
 * so feel free to add if need.
 **/
function Button(props) {
	const 	extraStyleClasses = props.extraStyleClasses || '',
			className = `bButton ${extraStyleClasses}`;

	let isDisabled = false;
	if(extraStyleClasses.search(/mDisable/) !== -1) {
		isDisabled = true;
	}

	return (
		<button
			id			= {props.id}
			className	= {className}
			onClick		= {props.onClick}
			disabled	= {isDisabled}
		>
			<a
				className	= {'eButton_link'}
				href		= {props.href}
			>
				{props.text}
			</a>
		</button>
	);
}

Button.propTypes = {
	text: React.PropTypes.oneOfType([				// text to display in button
		React.PropTypes.string,
		React.PropTypes.array 						//if we want use tags (ex. <i> font awesome)
	]),
	onClick:			React.PropTypes.func,		// function to be called on click
	href:				React.PropTypes.string,		// hyperlink if need
	extraStyleClasses: 	React.PropTypes.string,		// if one need to add extra styles to button.
	id:					React.PropTypes.string 		// html id
};

module.exports = Button;