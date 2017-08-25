const	React						= require('react');

const	SmallCrossButtonCssStyle	= require('../../../../styles/ui/b_small_cross_button.scss');

const SmallCrossButton = React.createClass({
	propTypes:{
		onClick:			React.PropTypes.func,	// function to be called on click
		extraStyleClasses:	React.PropTypes.string	// if one need to add extra styles to button.
	},
	onClick: function(eventDescriptor) {
		this.props.onClick(eventDescriptor);

		eventDescriptor.stopPropagation();
	},
	render: function() {
		const	extraStyleClasses	= this.props.extraStyleClasses || '',
				className			= `bSmallCrossButton ${extraStyleClasses}`;

		return (
			<div	className	= {className}
					onMouseDown	= {this.onClick}
			>
				<i className="fa fa-times"/>
			</div>
		);
	}
});

module.exports = SmallCrossButton;