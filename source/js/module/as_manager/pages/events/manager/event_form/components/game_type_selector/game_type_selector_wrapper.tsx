import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import * as RivalsHelper from 'module/ui/managers/rival_chooser/helpers/rivals_helper';
import * as RadioButtonCustom from '../../../../../../../ui/radio_button_custom/radio_button_custom';
import * as ControlPanel from '../../../../../../../ui/control_panel/control_panel';

export const GameTypeSelectorWrapper = (React as any).createClass({
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

	getRadioButtonIdArray: function(): string[] {
		const ids = [];

		for(let key in this.RADIO_BUTTON_IDS) {
			ids.push(this.RADIO_BUTTON_IDS[key]);
		}

		return ids;
	},

	isCheckedById: function(radioButtonId: string): boolean {
		switch (radioButtonId) {
			case this.RADIO_BUTTON_IDS.INTER_SCHOOLS_RADIO_BUTTON:
				return this.isInterSchoolsChecked();
			case this.RADIO_BUTTON_IDS.HOUSES_RADIO_BUTTON:
				return this.isHousesChecked();
			case this.RADIO_BUTTON_IDS.INTERNAL_RADIO_BUTTON:
				return this.isInternalChecked();
		}
	},
	isInterSchoolsChecked: function(): boolean {
		return this.getDefaultBinding().toJS('model.type') === 'inter-schools';
	},
	isHousesChecked: function(): boolean {
		return this.getDefaultBinding().toJS('model.type') === 'houses';
	},
	isInternalChecked: function(): boolean {
		return this.getDefaultBinding().toJS('model.type') === 'internal';
	},

	getTextById: function(radioButtonId: string): string {
		switch (radioButtonId) {
			case this.RADIO_BUTTON_IDS.INTER_SCHOOLS_RADIO_BUTTON:
				return this.RADIO_BUTTON_TEXT.INTER_SCHOOLS_RADIO_BUTTON;
			case this.RADIO_BUTTON_IDS.HOUSES_RADIO_BUTTON:
				return this.RADIO_BUTTON_TEXT.HOUSES_RADIO_BUTTON;
			case this.RADIO_BUTTON_IDS.INTERNAL_RADIO_BUTTON:
				return this.RADIO_BUTTON_TEXT.INTERNAL_RADIO_BUTTON;
		}
	},

	handleClick: function(radioButtonId: string): void {
		const binding = this.getDefaultBinding();

		let rivals;

		switch (radioButtonId) {
			case this.RADIO_BUTTON_IDS.INTER_SCHOOLS_RADIO_BUTTON: {
				const schoolInfo = binding.toJS('schoolInfo');

				rivals = RivalsHelper.getDefaultRivalsForInterSchoolsEvent(schoolInfo);
				break;
			}
			case this.RADIO_BUTTON_IDS.HOUSES_RADIO_BUTTON: {
				rivals = [];
				break;
			}
			case this.RADIO_BUTTON_IDS.INTERNAL_RADIO_BUTTON: {
				const schoolInfo = binding.toJS('schoolInfo');

				rivals = RivalsHelper.getDefaultRivalsForInternalSchoolsEvent(
					schoolInfo,
					binding.toJS('model.sportModel')
				);
				break;
			}
		}

		binding
			.atomically()
			.set('rivals',			Immutable.fromJS(rivals))
			.set('model.type',		Immutable.fromJS(this.RADIO_BUTTON_ID_GAME_TYPE_MAP[radioButtonId]))
			.set('autocomplete',	Immutable.Map())
			.commit();
	},

	getRadioButtonArray: function(): React.ReactNode {
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