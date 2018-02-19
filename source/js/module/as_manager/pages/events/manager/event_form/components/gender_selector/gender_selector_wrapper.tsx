import * as React from 'react';
import * as RadioButtonCustom from '../../../../../../../ui/radio_button_custom/radio_button_custom';
import * as ControlPanel from '../../../../../../../ui/control_panel/control_panel';
import * as EventConsts from '../../../../../../../helpers/consts/events';
import * as classNames from 'classnames';
import {Sport} from 'module/as_manager/pages/events/manager/event_form/components/sport_selector/sport_selector';

interface GenderSelectorWrapperProps {
	gender:             string
	sport:              any
	handleChangeGender: (gender: string) => void
	extraStyle:         string
}

export class GenderSelectorWrapper extends React.Component<GenderSelectorWrapperProps, {}> {
	readonly BOYS_TEXT = "BOYS";
	readonly GIRLS_TEXT = "GIRLS";
	readonly RADIO_BUTTON_IDS = {
		"BOYS_RADIOBUTTON": "BOYS_RADIOBUTTON",
		"GIRLS_RADIOBUTTON": "GIRLS_RADIOBUTTON"
	};

	constructor(props) {
		super(props);
	}

	getRadioButtonIdArray(): string[] {
		const ids = [];

		for (let key in this.RADIO_BUTTON_IDS) {
			ids.push(this.RADIO_BUTTON_IDS[key]);
		}

		return ids;
	}

	isCheckedById(radiobuttonId: string): boolean {
		switch (radiobuttonId) {
			case this.RADIO_BUTTON_IDS.BOYS_RADIOBUTTON:
				return this.isBoysChecked();
			case this.RADIO_BUTTON_IDS.GIRLS_RADIOBUTTON:
				return this.isGirlsChecked();
		}
	}

	isBoysChecked(): boolean {
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
	}

	isGirlsChecked(): boolean {
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
	}

	isDisabledById(radiobuttonId: string): boolean {
		switch (radiobuttonId) {
			case this.RADIO_BUTTON_IDS.BOYS_RADIOBUTTON:
				return this.isBoysDisabled();
			case this.RADIO_BUTTON_IDS.GIRLS_RADIOBUTTON:
				return this.isGirlsDisabled();
		}
	}

	isBoysDisabled(): boolean {
		const sportModel = this.props.sport;
		if (sportModel) {
			const genders = sportModel.genders;

			return !(genders.maleOnly || genders.mixed);
		} else {
			return true;
		}
	}

	isGirlsDisabled(): boolean {
		const sportModel = this.props.sport;

		if (sportModel) {
			const genders = sportModel.genders;

			return !(genders.femaleOnly || genders.mixed);
		} else {
			return true;
		}
	}

	getTextById(radiobuttonId: string): string {
		switch (radiobuttonId) {
			case this.RADIO_BUTTON_IDS.BOYS_RADIOBUTTON:
				return this.getBoysText();
			case this.RADIO_BUTTON_IDS.GIRLS_RADIOBUTTON:
				return this.getGirlsText();
		}
	}

	getBoysText(): string {
		return this.BOYS_TEXT;
	}

	getGirlsText(): string {
		return this.GIRLS_TEXT;
	}

	handleClick(radiobuttonId: string): void {
		const sportModel = this.props.sport;

		if (sportModel) {
			const genders = sportModel.genders,
				currentGender = this.props.gender;

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
	}

	getRadiobuttonArray(): React.ReactNode {
		return this.getRadioButtonIdArray().map(radiobuttonId => {
			return (
				<RadioButtonCustom
					isChecked={this.isCheckedById(radiobuttonId)}
					isDisabled={this.isDisabledById(radiobuttonId)}
					text={this.getTextById(radiobuttonId)}
					onClick={this.handleClick.bind(this, radiobuttonId)}
					customCSS={classNames("mGenderSelector", this.props.extraStyle)}
				/>
			);
		});
	}

	render() {
		return (
			<ControlPanel
				controlArray={this.getRadiobuttonArray()}
				extraStyle={this.props.extraStyle}
			/>
		);
	}
}