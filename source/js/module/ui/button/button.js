const	React			= require('react'),
		ButtonCssStyle	= require('../../../../styles/ui/b_button.scss');

const Button = React.createClass({
	propTypes: {
		id:					React.PropTypes.string, 		// html id
		text:				React.PropTypes.oneOfType([				// text to display in button
			React.PropTypes.string,
			React.PropTypes.array 						//if we want use tags (ex. <i> font awesome)
		]),
		onClick:			React.PropTypes.func,		// function to be called on click
		href:				React.PropTypes.string,		// hyperlink if need
		extraStyleClasses: 	React.PropTypes.string,		// if one need to add extra styles to button.
		isDisabled:		 	React.PropTypes.bool
	},
	onClick: function(eventDescriptor) {
		if(typeof this.props.onClick !== 'undefined') {
			this.props.onClick(eventDescriptor);
		}

		if(typeof this.props.href !== 'undefined') {
			window.location.hash = this.props.href;
		}
	},
	render: function () {
		const	extraStyleClasses	= this.props.extraStyleClasses || '',
				className			= `bButton ${extraStyleClasses}`;

		let isDisabled = false;
		if(typeof this.props.isDisabled !== 'undefined') {
			isDisabled = this.props.isDisabled;
		}

		return (
			<button
				id			= {this.props.id}
				className	= {className}
				disabled	= {isDisabled}
				onClick		= {this.onClick}
			>
				{this.props.text}
			</button>
		);
	}
});

module.exports = Button;