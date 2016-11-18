const	React					= require('react'),

		RadioButton				= require('./../../../../../../ui/radio_button/radio_button'),

		GameTypeSelectorStyles	= require('./../../../../../../../../styles/ui/b_gametype_selector.scss');

const GameTypeSelector = React.createClass({
	propTypes: {
		iInterSchoolsChecked:	React.PropTypes.bool.isRequired,
		isHousesChecked:		React.PropTypes.bool.isRequired,
		isInternalChecked:		React.PropTypes.bool.isRequired,
		handleClick:			React.PropTypes.func.isRequired
	},

	handleClick: function(selectedGameType) {
		this.props.handleClick(selectedGameType);
	},

	render: function(){
		return (
			<div className="bGameTypeSelector">
				<div className="eGameTypeSelector_leftSide">
					<RadioButton	id			= {"inter-schools-radio-button"}
									isChecked	= {this.props.iInterSchoolsChecked}
									text		= "Inter-schools"
									onClick		= {this.handleClick.bind(null, 'inter-schools')}
									customCSS	= "mGenderSelector"
					/>
				</div>
				<div className="eGameTypeSelector_centerSide">
					<RadioButton	id			= {"houses-radio-button"}
									isChecked	= {this.props.isHousesChecked}
									text		= "Houses"
									onClick		= {this.handleClick.bind(null, 'houses')}
									customCSS	= "mGenderSelector"
					/>
				</div>
				<div className="eGameTypeSelector_rightSide">
					<RadioButton	id			= {"internal-radio-button"}
									isChecked	= {this.props.isInternalChecked}
									text		= "Internal"
									onClick		= {this.handleClick.bind(null, 'internal')}
									customCSS	= "mGenderSelector"
					/>
				</div>
			</div>
		);
	}
});

module.exports = GameTypeSelector;