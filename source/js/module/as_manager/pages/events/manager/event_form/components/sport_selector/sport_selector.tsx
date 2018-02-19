import * as	React from 'react';
import * as	Immutable from 'immutable';
import * as	Morearty from 'morearty';
import * as	propz from 'propz';

import {EventFormActions} from '../../event_form_actions';
import {If} from '../../../../../../../ui/if/if';
import * as	GenderHelper from 'module/helpers/gender_helper';
import * as	SchoolHelper from 'module/helpers/school_helper';
import {Autocomplete} from '../../../../../../../ui/autocomplete2/OldAutocompleteWrapper';

// Helpers
import * as	RivalsHelper from 'module/ui/managers/rival_chooser/helpers/rivals_helper';

import {EVENT_FORM_MODE} from 'module/as_manager/pages/events/manager/event_form/consts/consts';

// Styles
import '../../../../../../../../../styles/ui/b_input_wrapper.scss';
import '../../../../../../../../../styles/ui/b_input_label.scss';
import '../../../../../../../../../styles/ui/b_small_checkbox_block.scss';

interface SportSelectorProps {
	activeSchoolId:	string
	mode:			string
}

export interface Sport {
	createdAt:	                string
	description:	            string
	discipline:                 any[]
	field:                      any
	genders:                    any
	id:	                        string
	individualResultsAvailable: boolean
	isFavorite:                 boolean
	multiparty:                 boolean
	name:                       string
	performance:                any[]
	players:	                string
	points:                     any
	scoring:	                string
	updatedAt:	                string
}

export const SportSelector = (React as any).createClass({
	mixins: [Morearty.Mixin],

	componentWillMount: function() {
		const 	isSchoolHaveFavoriteSports 	= this.isSchoolHaveFavoriteSports(),
				binding						= this.getDefaultBinding();

		binding.atomically()
			.set('isShowAllSports',				!isSchoolHaveFavoriteSports )
			.set('isSchoolHaveFavoriteSports',	isSchoolHaveFavoriteSports)
			.set('eventFormSportSelectorKey',	Immutable.fromJS(this.getRandomString()))
			.commit();

		this.setIsFavoriteSportsEnabled();
	},

	getRandomString: function(): number {
		// just current date in timestamp view
		return + new Date();
	},

	isOnlyFavoriteSports: function(): boolean {
		const	binding						= this.getDefaultBinding(),
				isSchoolHaveFavoriteSports	= binding.get('isSchoolHaveFavoriteSports'),
				isFavoriteSportsEnabled		= binding.get('isFavoriteSportsEnabled');

		switch (true) {
			case !isSchoolHaveFavoriteSports && isFavoriteSportsEnabled:
				return false;
			case !isSchoolHaveFavoriteSports && !isFavoriteSportsEnabled:
				return true;
			case !binding.get('isShowAllSports') || !isFavoriteSportsEnabled:
				return true;
		}
	},
	setIsFavoriteSportsEnabled: function(): void {
		SchoolHelper.loadActiveSchoolInfo(this).then(schoolData => {
			this.getDefaultBinding().set('isFavoriteSportsEnabled', schoolData.isFavoriteSportsEnabled);
		});
	},

	isSchoolHaveFavoriteSports: function(): boolean {
		const sports = this.getDefaultBinding().toJS('sports');

		return sports.filter(s => s.isFavorite).length > 0;
	},

	handleChangeCompleteSport: function (id: string, sport: Sport): void {
		const	binding		= this.getDefaultBinding(),
				eventType	= binding.toJS('model.type');
		let		rivals		= binding.toJS('rivals');

		switch (eventType) {
			case 'inter-schools': {
				rivals = this.getDefaultRivalsForInterSchoolsEvent();
				break;
			}
			case 'houses':
				rivals = [];
				break;
			case 'internal':
				const schoolInfo = binding.toJS('schoolInfo');

				rivals = RivalsHelper.getDefaultRivalsForInternalSchoolsEvent(
					schoolInfo,
					binding.toJS('model.sportModel')
				);
				break;
		}

		binding.atomically()
			.set('model.sportId',		id)
			.set('model.sportModel',	Immutable.fromJS(sport))
			.set('model.gender',		Immutable.fromJS(GenderHelper.getDefaultGender(sport)))
			.set('rivals',				Immutable.fromJS(rivals))
			.commit();
	},

	getDefaultRivalsForInterSchoolsEvent: function (): string[] {
		let rivals;

		switch (this.props.mode) {
			case EVENT_FORM_MODE.SCHOOL: {
				const schoolInfo = this.getDefaultBinding().toJS('schoolInfo');

				rivals = RivalsHelper.getDefaultRivalsForInterSchoolsEvent(schoolInfo);
				break;
			}
			case EVENT_FORM_MODE.SCHOOL_UNION: {
				rivals = [];
				break;
			}
		}

		return rivals;
	},

	handleChangeShowAllSports: function(): void {
		const binding = this.getDefaultBinding();

		const	isShowAllSports	= binding.get('isShowAllSports'),
			currentSport	= binding.toJS('model.sportModel');

		// so, if isShowAllSports was true, now it's false
		// and it means that we should clear sportId if that sport isn't favorite.
		if(isShowAllSports && typeof currentSport !== 'undefined' && !currentSport.isFavorite) {
			binding.atomically()
				.set('model.sportModel',			Immutable.fromJS(undefined))
				.set('model.sportId',				Immutable.fromJS(undefined))
				.set('isShowAllSports',				!isShowAllSports)
				.set('eventFormSportSelectorKey',	Immutable.fromJS(this.getRandomString()))
				.commit()
		} else {
			binding.set('isShowAllSports', !isShowAllSports);
		}
	},

	render: function() {
		const	binding	= this.getDefaultBinding();

		const	event						= binding.toJS('model'),
				sport						= propz.get(event, ['sportModel'], undefined),
				isShowAllSports				= event.isShowAllSports,
				isSchoolHaveFavoriteSports	= binding.get('isSchoolHaveFavoriteSports'),
				eventFormSportSelectorKey	= binding.get('eventFormSportSelectorKey'),
				isFavoriteSportsEnabled 	= binding.get('isFavoriteSportsEnabled');

		return(
			<div className="bInputWrapper">
				<div className="bInputLabel">
					Game
				</div>
				<Autocomplete
					key				= { eventFormSportSelectorKey }
					serviceFilter	= { EventFormActions.getSportService(this.props.activeSchoolId, this.isOnlyFavoriteSports(), this.props.mode) }
					defaultItem		= { sport }
					serverField		= "name"
					placeholder		= "Enter sport name"
					onSelect		= { this.handleChangeCompleteSport }
					extraCssStyle	= "mWidth250 mInline mWhiteBG"
				/>
				{/*hide show all sports checkbox, for limited school version and if school not have favorite sports*/}
				<If condition={isSchoolHaveFavoriteSports && isFavoriteSportsEnabled}>
					<div className="bSmallCheckboxBlock">
						<div className="eForm_fieldInput mInline">
							<input
								className	= "eSwitch"
								type		= "checkbox"
								checked		= { isShowAllSports }
								onChange	= { this.handleChangeShowAllSports }
							/>
							<label/>
						</div>
						<div className="eSmallCheckboxBlock_label">
							Show all sports
						</div>
					</div>
				</If>
			</div>
		);
	}
});