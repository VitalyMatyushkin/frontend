const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		RadioButtonCustom	= require('../../../../../../../ui/radio_button_custom/radio_button_custom'),
		ControlPanel		= require('../../../../../../../ui/control_panel/control_panel');

const GameTypeSelectorWrapper = React.createClass({
	mixins: [Morearty.Mixin],

	CUSTOM_CSS_RADIO_BUTTON_STYLE:		"mGenderSelector",
	RADIO_BUTTON_ID_GAME_TYPE_MAP:	{
		"INTER_SCHOOLS_RADIO_BUTTON":	"inter-schools",
		"HOUSES_RADIO_BUTTON":			"houses",
		"INTERNAL_RADIO_BUTTON":		"internal"
	},
	RADIO_BUTTON_TEXT: {
		"INTER_SCHOOLS_RADIO_BUTTON":	"Inter-schools",
		"HOUSES_RADIO_BUTTON":			"Houses",
		"INTERNAL_RADIO_BUTTON":		"Internal"
	},
	RADIO_BUTTON_IDS : {
		"INTER_SCHOOLS_RADIO_BUTTON":	"INTER_SCHOOLS_RADIO_BUTTON",
		"HOUSES_RADIO_BUTTON":			"HOUSES_RADIO_BUTTON",
		"INTERNAL_RADIO_BUTTON":		"INTERNAL_RADIO_BUTTON"
	},
	getRadioButtonIdArray: function() {
		const ids = [];

		for(let key in this.RADIO_BUTTON_IDS) {
			ids.push(this.RADIO_BUTTON_IDS[key]);
		}

		return ids;
	},

	isCheckedById: function(radioButtonId) {
		switch (radioButtonId) {
			case this.RADIO_BUTTON_IDS.INTER_SCHOOLS_RADIO_BUTTON:
				return this.iInterSchoolsChecked();
			case this.RADIO_BUTTON_IDS.HOUSES_RADIO_BUTTON:
				return this.isHousesChecked();
			case this.RADIO_BUTTON_IDS.INTERNAL_RADIO_BUTTON:
				return this.isInternalChecked();
		}
	},
	iInterSchoolsChecked: function() {
		return this.getDefaultBinding().toJS('model.type') === 'inter-schools';
	},
	isHousesChecked: function() {
		return this.getDefaultBinding().toJS('model.type') === 'houses';
	},
	isInternalChecked: function() {
		return this.getDefaultBinding().toJS('model.type') === 'internal';
	},
	getTextById: function(radioButtonId) {
		switch (radioButtonId) {
			case this.RADIO_BUTTON_IDS.INTER_SCHOOLS_RADIO_BUTTON:
				return this.RADIO_BUTTON_TEXT.INTER_SCHOOLS_RADIO_BUTTON;
			case this.RADIO_BUTTON_IDS.HOUSES_RADIO_BUTTON:
				return this.RADIO_BUTTON_TEXT.HOUSES_RADIO_BUTTON;
			case this.RADIO_BUTTON_IDS.INTERNAL_RADIO_BUTTON:
				return this.RADIO_BUTTON_TEXT.INTERNAL_RADIO_BUTTON;
		}
	},

	handleClick: function(radioButtonId) {
		const binding = this.getDefaultBinding();

		let rivals = Immutable.List();

		switch (radioButtonId) {
			case this.RADIO_BUTTON_IDS.INTER_SCHOOLS_RADIO_BUTTON:
				rivals = rivals.push(binding.get('schoolInfo'));
				break;
			case this.RADIO_BUTTON_IDS.INTERNAL_RADIO_BUTTON:
				rivals = Immutable.fromJS([
					{
						id: null,
						name: ''
					},
					{
						id: null,
						name: ''
					}
				]);
				break;
		}

		binding
			.atomically()
			.set('rivals',			Immutable.fromJS(rivals))
			.set('model.type',		Immutable.fromJS(this.RADIO_BUTTON_ID_GAME_TYPE_MAP[radioButtonId]))
			.set('autocomplete',	Immutable.Map())
			.commit();
	},
	getRadioButtonArray: function() {
		return this.getRadioButtonIdArray().map(radioButtonId => {
			return (
				<RadioButtonCustom	isChecked	= { this.isCheckedById(radioButtonId) }
									text		= { this.getTextById(radioButtonId) }
									onClick		= { this.handleClick.bind(null, radioButtonId) }
									customCSS	= { this.CUSTOM_CSS_RADIO_BUTTON_STYLE }
				/>
			);
		});
	},

	render: function() {
		return(
			<ControlPanel controlArray={this.getRadioButtonArray()}/>
		);
	}
});

module.exports = GameTypeSelectorWrapper;