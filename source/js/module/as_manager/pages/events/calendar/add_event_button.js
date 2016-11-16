const	React	= require('react'),

		Button	= require('./../../../../ui/button/button');

const AddEventButton = React.createClass({
	propTypes: {
		handleClick:	React.PropTypes.func.isRequired
	},

	BUTTON_TEXT: 'Add event',

	render: function(){
		return (
			<div className="bAddEventButtonWrapper">
				<Button	text				= {this.BUTTON_TEXT}
						onClick				= {this.props.handleClick}
						extraStyleClasses	= {'mAddEvent'}
				/>
			</div>
		);
	}
});

module.exports = AddEventButton;