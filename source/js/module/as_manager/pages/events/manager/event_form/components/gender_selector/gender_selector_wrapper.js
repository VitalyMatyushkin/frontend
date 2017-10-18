const	React				= require('react'),
		RadioButtonCustom	= require('../../../../../../../ui/radio_button_custom/radio_button_custom'),
		ControlPanel		= require('../../../../../../../ui/control_panel/control_panel'),
		EventConsts			= require('../../../../../../../helpers/consts/events');

const	classNames			= require('classnames');

const GenderSelectorWrapper = React.createClass({
	CUSTOM_CSS_STYLE:	"mGenderSelector",
	BOYS_TEXT:			"BOYS",
	GIRLS_TEXT:			"GIRLS",
	RADIO_BUTTON_IDS :	{
		"BOYS_RADIOBUTTON":		"BOYS_RADIOBUTTON",
		"GIRLS_RADIOBUTTON":	"GIRLS_RADIOBUTTON"
	},
	propTypes: {
		gender:				React.PropTypes.string,
		sport:				React.PropTypes.object,
		handleChangeGender:	React.PropTypes.func.isRequired,
		extraStyle:			React.PropTypes.string
	},
	getRadioButtonIdArray: function() {
		const ids = [];

		for(let key in this.RADIO_BUTTON_IDS) {
			ids.push(this.RADIO_BUTTON_IDS[key]);
		}

		return ids;
	},
	isCheckedById: function(radiobuttonId) {
		switch(radiobuttonId) {
			case this.RADIO_BUTTON_IDS.BOYS_RADIOBUTTON:
				return this.isBoysChecked();
			case this.RADIO_BUTTON_IDS.GIRLS_RADIOBUTTON:
				return this.isGirlsChecked();
		}
	},
	isBoysChecked: function() {
		const gender = this.props.gender;

		switch (gender) {
			case EventConsts.EVENT_GENDERS.FEMALE_ONLY:
				return false;
			case EventConsts.EVENT_GENDERS.MALE_ONLY:
				return true;
			case EventConsts.EVENT_GENDERS.MIXED:
				return true;
			default:
				return false;
		}
	},
	isGirlsChecked: function() {
		const gender = this.props.gender;

		switch (gender) {
			case EventConsts.EVENT_GENDERS.FEMALE_ONLY:
				return true;
			case EventConsts.EVENT_GENDERS.MALE_ONLY:
				return false;
			case EventConsts.EVENT_GENDERS.MIXED:
				return true;
			default:
				return false;
		}
	},
	isDisabledById: function(radiobuttonId) {
		switch(radiobuttonId) {
			case this.RADIO_BUTTON_IDS.BOYS_RADIOBUTTON:
				return this.isBoysDisabled();
			case this.RADIO_BUTTON_IDS.GIRLS_RADIOBUTTON:
				return this.isGirlsDisabled();
		}
	},
	isBoysDisabled: function() {
		const sportModel = this.props.sport;

		if(sportModel) {
			const genders = sportModel.genders;

			return !(genders.maleOnly || genders.mixed);
		} else {
			return true;
		}
	},
	isGirlsDisabled: function() {
		const sportModel = this.props.sport;

		if(sportModel) {
			const genders = sportModel.genders;

			return !(genders.femaleOnly || genders.mixed);
		} else {
			return true;
		}
	},
	getTextById: function(radiobuttonId) {
		switch(radiobuttonId) {
			case this.RADIO_BUTTON_IDS.BOYS_RADIOBUTTON:
				return this.getBoysText();
			case this.RADIO_BUTTON_IDS.GIRLS_RADIOBUTTON:
				return this.getGirlsText();
		}
	},
	getBoysText: function() {
		return this.BOYS_TEXT; 
	},
	getGirlsText: function() {
		return this.GIRLS_TEXT;
	},
	handleClick: function(radiobuttonId) {
		const sportModel = this.props.sport;

		if(sportModel) {
			const	genders			= sportModel.genders,
					currentGender	= this.props.gender;

			switch (true) {
				case radiobuttonId === this.RADIO_BUTTON_IDS.BOYS_RADIOBUTTON && !this.isBoysDisabled() && genders.mixed && currentGender === EventConsts.EVENT_GENDERS.FEMALE_ONLY:
					this.props.handleChangeGender(EventConsts.EVENT_GENDERS.MIXED);
					break;
				case radiobuttonId === this.RADIO_BUTTON_IDS.BOYS_RADIOBUTTON && !this.isBoysDisabled() && currentGender === EventConsts.EVENT_GENDERS.FEMALE_ONLY:
					this.props.handleChangeGender(EventConsts.EVENT_GENDERS.MALE_ONLY);
					break;
				case radiobuttonId === this.RADIO_BUTTON_IDS.BOYS_RADIOBUTTON && !this.isBoysDisabled() && currentGender === EventConsts.EVENT_GENDERS.MIXED:
					this.props.handleChangeGender(EventConsts.EVENT_GENDERS.FEMALE_ONLY);
					break;
				case radiobuttonId === this.RADIO_BUTTON_IDS.BOYS_RADIOBUTTON && !this.isBoysDisabled() && typeof currentGender === 'undefined':
					this.props.handleChangeGender(EventConsts.EVENT_GENDERS.MALE_ONLY);
					break;
				case radiobuttonId === this.RADIO_BUTTON_IDS.GIRLS_RADIOBUTTON && !this.isGirlsDisabled() && genders.mixed && currentGender === EventConsts.EVENT_GENDERS.MALE_ONLY:
					this.props.handleChangeGender(EventConsts.EVENT_GENDERS.MIXED);
					break;
				case radiobuttonId === this.RADIO_BUTTON_IDS.GIRLS_RADIOBUTTON && !this.isGirlsDisabled() && currentGender === EventConsts.EVENT_GENDERS.MALE_ONLY:
					this.props.handleChangeGender(EventConsts.EVENT_GENDERS.FEMALE_ONLY);
					break;
				case radiobuttonId === this.RADIO_BUTTON_IDS.GIRLS_RADIOBUTTON && !this.isGirlsDisabled() && currentGender === EventConsts.EVENT_GENDERS.MIXED:
					this.props.handleChangeGender(EventConsts.EVENT_GENDERS.MALE_ONLY);
					break;
				case radiobuttonId === this.RADIO_BUTTON_IDS.GIRLS_RADIOBUTTON && !this.isGirlsDisabled() && typeof currentGender === 'undefined':
					this.props.handleChangeGender(EventConsts.EVENT_GENDERS.FEMALE_ONLY);
					break;
			}
		}
	},
	getRadiobuttonArray: function() {
		return this.getRadioButtonIdArray().map(radiobuttonId => {
			return (
				<RadioButtonCustom	isChecked	= { this.isCheckedById(radiobuttonId) }
									isDisabled	= { this.isDisabledById(radiobuttonId) }
									text		= { this.getTextById(radiobuttonId) }
									onClick		= { this.handleClick.bind(null, radiobuttonId) }
									customCSS	= { classNames("mGenderSelector", this.props.extraStyle) }
				/>
			);
		});
	},
	render: function() {
		return (
			<ControlPanel
				controlArray	= { this.getRadiobuttonArray() }
				extraStyle		= { this.props.extraStyle }
			/>
		);
	}
});

module.exports = GenderSelectorWrapper;