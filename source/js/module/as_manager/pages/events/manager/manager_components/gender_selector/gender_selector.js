const	React					= require('react'),

		RadioButton				= require('./../../../../../../ui/radio_button/radio_button'),

		GenderSelectorStyles	= require('./../../../../../../../../styles/ui/b_gender_selector.scss');

const GenderSelector = React.createClass({
	propTypes: {
		isBoysChecked:		React.PropTypes.bool.isRequired,
		isBoysDisabled:		React.PropTypes.bool.isRequired,
		isGirlsChecked:		React.PropTypes.bool.isRequired,
		isGirlsDisabled:	React.PropTypes.bool.isRequired,
		handleClick:		React.PropTypes.func.isRequired
	},

	handleClick: function(selectedGender) {
		this.props.handleClick(selectedGender);
	},

	render: function(){
		return (
			<div className="bGenderSelector">
				<div className="eGenderSelector_leftSide">
					<RadioButton	isChecked	= {this.props.isBoysChecked}
									isDisabled	= {this.props.isBoysDisabled}
									text		= "BOYS"
									onClick		= {this.handleClick.bind(null, 'boys')}
									customCSS	= "mGenderSelector"
					/>
				</div>
				<div className="eGenderSelector_rightSide">
					<RadioButton	isChecked	= {this.props.isGirlsChecked}
									isDisabled	= {this.props.isGirlsDisabled}
									text		= "GIRLS"
									onClick		= {this.handleClick.bind(null, 'girls')}
									customCSS	= "mGenderSelector"
					/>
				</div>
			</div>
		);
	}
});

module.exports = GenderSelector;