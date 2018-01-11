const React = require('react');

const ActionButtonCssStyle = require('../../../../styles/ui/b_action_button.scss');

function Button(props) {
	const extraStyleClasses = props.extraStyleClasses || '';
	const className = `bActionButton ${extraStyleClasses}`;

	return (
		<button	className	= {className}
				onClick		= {props.onClick}
				onBlur		= {props.onBlur}
		>
			<div className="eActionButton_text">{props.text}</div>
			<div className="eActionButton_arrowWrapper">
				<i className="eActionButton_arrow fa fa-sort-desc" aria-hidden="true"/>
			</div>
		</button>
	);
}

Button.propTypes = {
	text: 				React.PropTypes.string,		// text to display in button
	onClick:			React.PropTypes.func,		// function to be called on click
	onBlur:				React.PropTypes.func,
	extraStyleClasses: 	React.PropTypes.string		// if one need to add extra styles to button.
};

module.exports = Button;