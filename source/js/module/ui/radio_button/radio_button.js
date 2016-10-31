const	React	= require('react');

const TeamSaveModePanel = React.createClass({
	propTypes: {
		isChecked:	React.PropTypes.bool.isRequired,
		text:		React.PropTypes.array.isRequired,
		onClick:	React.PropTypes.func.isRequired,
		customCSS:	React.PropTypes.string
	},

	DEFAULT_CSS_STYLE: 'bRadioButton',

	getStyle: function() {
		if(typeof this.props.customCSS !== 'undefined') {
			return `${this.DEFAULT_CSS_STYLE} ${this.props.customCSS}`
		} else {
			return this.DEFAULT_CSS_STYLE;
		}
	},

	render: function() {
		return (
			<div className={ this.getStyle() }>
				<input	className	= "bRadioButton_input"
						type		= "radio"
						checked		= { this.props.isChecked }
						onClick		= { this.props.onClick }
				/>
				<div	className="bRadioButton_text">
					{ this.props.text }
				</div>
			</div>
		);
	}
});

module.exports = TeamSaveModePanel;