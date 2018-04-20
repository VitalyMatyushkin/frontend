// Main components
import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import * as propz from 'propz';
import {If} from '../../../../../ui/if/if';

// EventForm React components
import {DateSelectorWrapper} from './components/date_selector/date_selector_wrapper';
import {GenderSelectorWrapper} from './components/gender_selector/gender_selector_wrapper';
import {GameTypeSelectorWrapper} from './components/game_type_selector/game_type_selector_wrapper';
import {AgeMultiselectDropdownWrapper} from './components/age_multiselect_dropdown/age_multiselect_dropdown_wrapper';
import {SportSelector} from './components/sport_selector/sport_selector';
import {TimeInputWrapper} from '../time_input_wrapper';
import {EventVenue} from '../event_venue';
import {SchoolUnionSchoolsManager} from 'module/as_manager/pages/events/manager/event_form/components/school_union_schools_manager/school_union_schools_manager';
import {SchoolsManager} from 'module/as_manager/pages/events/manager/event_form/components/schools_manager/schools_manager';
import {HousesManager} from 'module/as_manager/pages/events/manager/event_form/components/houses_manager/houses_manager';

// Helpers
import {LocalEventHelper} from '../../eventHelper';
import * as RandomHelper from 'module/helpers/random_helper';

import {EVENT_FORM_MODE} from 'module/as_manager/pages/events/manager/event_form/consts/consts';

// Styles
import '../../../../../../../styles/ui/b_input_wrapper.scss';
import '../../../../../../../styles/ui/b_input_label.scss';
import '../../../../../../../styles/ui/b_text_input.scss';
import '../../../../../../../styles/ui/b_dropdown.scss';
import '../../../../../../../styles/ui/b_house_autocomplete_wrapper.scss';
import '../../../../../../../styles/ui/b_small_checkbox_block.scss';

interface EventFormProps {
	activeSchoolId:	string
	mode:			string
	isCopyMode:		boolean
}

export const EventForm = (React as any).createClass({
	mixins: [Morearty.Mixin],

	getDefaultProps: function(){
		return {
			mode: EVENT_FORM_MODE.SCHOOL
		};
	},

	componentWillMount: function() {
		const binding = this.getDefaultBinding();

		binding.set(
			'eventFormOpponentSchoolKey',
			Immutable.fromJS(RandomHelper.getRandomString())
		);
	},

	getMainSchoolFilter: function(rivals, schoolName: string): any {
		return {
			filter: {
				where: {
					id: {
						$nin: rivals.map(r => r.school.id)
					},
					name: { like: schoolName }
				},
				limit: 40
			}
		};
	},

	getOpponentSchoolInfoArray: function() {
		const binding = this.getDefaultBinding();

		let schools = [];
		if(binding.toJS('model.type') === 'inter-schools') {
			schools = binding.toJS('rivals')
				.filter(r => r.school.id !== this.props.activeSchoolId)
				.map(r => r.school);
		}

		return schools;
	},

	handleChangeFartherThan: function (eventDescriptor): void {
		const	binding	= this.getDefaultBinding(),
				rivals	= binding.toJS('rivals');

		binding.atomically()
			.set('rivals',						Immutable.fromJS([rivals[0]]))
			.set('eventFormOpponentSchoolKey',	Immutable.fromJS(RandomHelper.getRandomString()))
			.set('fartherThen',					eventDescriptor.target.value)
			.commit();
	},

	handleChangeGender: function (gender: string): void {
		const binding = this.getDefaultBinding();

		binding.set('model.gender', Immutable.fromJS(gender));
	},

	getFartherThenItems: function (): React.ReactNode {
		return LocalEventHelper.distanceItems.map(item => {
			return (
				<option	value	= { item.id }
				           key		= { item.id }
				>
					{item.text}
				</option>
			);
		});
	},

	isShowDistanceSelector: function(): boolean {
		const	binding			= this.getDefaultBinding(),
			type			= binding.get('model.type'),
			activeSchool	= binding.toJS('schoolInfo'),
			postcode		= activeSchool.postcode;

		return type === 'inter-schools' && typeof postcode !== 'undefined';
	},

	getSport: function () {
		const binding = this.getDefaultBinding();

		return typeof binding.toJS('model.sportModel') !== 'undefined' ?
			binding.toJS('model.sportModel') :
			binding.toJS('model.sport');
	},

	renderSchoolManager: function (): React.ReactNode {
		let result;

		switch (this.props.mode) {
			case EVENT_FORM_MODE.SCHOOL: {
				result = (
					<SchoolsManager
						binding			= { this.getDefaultBinding() }
						activeSchoolId	= { this.props.activeSchoolId }
					/>
				);
				break;
			}
			case EVENT_FORM_MODE.SCHOOL_UNION: {
				result = (
					<SchoolUnionSchoolsManager
						binding			= { this.getDefaultBinding() }
						activeSchoolId	= { this.props.activeSchoolId }
					/>
				);
				break;
			}
		}

		return result;
	},

	renderGameTypeSelector: function (): React.ReactNode | null {
		let result;

		switch (this.props.mode) {
			case EVENT_FORM_MODE.SCHOOL: {
				result = (
					<div className="bInputWrapper">
						<div className="bInputLabel">
							Game Type
						</div>
						<GameTypeSelectorWrapper binding={ this.getDefaultBinding() }/>
					</div>
				);
				break;
			}
			case EVENT_FORM_MODE.SCHOOL_UNION: {
				result = null;
				break;
			}
		}

		return result;
	},

	renderAgeMultiselectDropdownWrapper: function (): React.ReactNode | null {
		let result;

		switch (EVENT_FORM_MODE.SCHOOL) {
			case EVENT_FORM_MODE.SCHOOL: {
				result = (
					<div className="bInputWrapper">
						<div className="bInputLabel">
							Ages
						</div>
						<AgeMultiselectDropdownWrapper binding={ this.getDefaultBinding() }/>
					</div>
				);
				break;
			}
			case EVENT_FORM_MODE.SCHOOL_UNION: {
				result = null;
				break;
			}
		}

		return result;
	},

	render: function() {
		const	binding = this.getDefaultBinding();

		const	event						= binding.toJS('model'),
				gender                      = binding.toJS('model.gender'),
				fartherThen					= binding.get('fartherThen'),
				type						= event.type,
				cssClassName 				= Boolean(binding.toJS('model.isTimesValid')) ? '' : 'mError',
				opponentSchoolInfoArray		= this.getOpponentSchoolInfoArray();

		return(
			<div className="eManager_base">
				<DateSelectorWrapper binding={binding.sub('model')}/>
				<div className="bInputWrapper">
					<div className="bInputLabel">
						Start Time
					</div>
					<TimeInputWrapper cssClassName = {cssClassName} binding={binding.sub('model.startTime')}/>
				</div>
				<div className="bInputWrapper">
					<div className="bInputLabel">
						Finish Time
					</div>
					<TimeInputWrapper cssClassName = {cssClassName} binding={binding.sub('model.endTime')}/>
				</div>
				<SportSelector
					binding			= { binding }
					activeSchoolId	= { this.props.activeSchoolId }
					mode			= { this.props.mode }
				/>
				<div className="bInputWrapper">
					<div className="bInputLabel">
						Genders
					</div>
					<GenderSelectorWrapper
						gender				= { gender }
						sport				= { this.getSport() }
						handleChangeGender	= { this.handleChangeGender }
						extraStyle          = ''
					/>
				</div>
				{ this.renderAgeMultiselectDropdownWrapper() }
				{ this.renderGameTypeSelector() }
				<If
					condition	= {this.isShowDistanceSelector()}
					key			= {'if-farther-then'}
				>
					<div className="bInputWrapper">
						<div className="bInputLabel">
							Maximum distance
						</div>
						<select	className		= "bDropdown"
						           defaultValue	= {LocalEventHelper.distanceItems[0].id}
						           value			= {fartherThen}
						           onChange		= {this.handleChangeFartherThan}
						>
							{this.getFartherThenItems()}
						</select>
					</div>
				</If>
				<If
					condition	= {type === 'inter-schools'}
					key			= {'if-choose-school'}
				>
					{ this.renderSchoolManager() }
				</If>
				<If
					condition={type === 'houses'}
				>
					<HousesManager
						binding			= { binding }
						activeSchoolId	= { this.props.activeSchoolId }
					/>
				</If>
				<EventVenue
					binding					= { binding }
					eventType				= { binding.toJS('model.type') }
					activeSchoolInfo		= { binding.toJS('schoolInfo') }
					opponentSchoolInfoArray	= { opponentSchoolInfoArray }
					isCopyMode				= { this.props.isCopyMode }
				/>
			</div>
		);
	}
});