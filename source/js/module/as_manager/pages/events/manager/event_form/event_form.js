// Main components
const	React							= require('react'),
		Morearty						= require('morearty'),
		Immutable						= require('immutable'),
		propz							= require('propz'),
	{If}							= require('../../../../../ui/if/if');

// EventForm React components
const	DateSelectorWrapper				= require('./components/date_selector/date_selector_wrapper'),
		GenderSelectorWrapper			= require('./components/gender_selector/gender_selector_wrapper'),
		GameTypeSelectorWrapper			= require('./components/game_type_selector/game_type_selector_wrapper'),
		AgeMultiselectDropdownWrapper	= require('./components/age_multiselect_dropdown/age_multiselect_dropdown_wrapper'),
		SportSelectorWrapper			= require('./components/sport_selector/sport_selector'),
		TimeInputWrapper				= require('../time_input_wrapper'),
		{EventVenue}					= require('../event_venue'),
		SchoolUnionSchoolsManager		= require('module/as_manager/pages/events/manager/event_form/components/school_union_schools_manager/school_union_schools_manager'),
		SchoolsManager					= require('module/as_manager/pages/events/manager/event_form/components/schools_manager/schools_manager'),
		HousesManager					= require('module/as_manager/pages/events/manager/event_form/components/houses_manager/houses_manager');

// Helpers
const	EventHelper						= require('../../eventHelper'),
		RandomHelper					= require('module/helpers/random_helper');

const	EventFormConsts					= require('module/as_manager/pages/events/manager/event_form/consts/consts');

// Styles
const	InputWrapperStyles				= require('../../../../../../../styles/ui/b_input_wrapper.scss'),
		InputLabelStyles				= require('../../../../../../../styles/ui/b_input_label.scss'),
		TextInputStyles					= require('../../../../../../../styles/ui/b_text_input.scss'),
		DropdownStyles					= require('../../../../../../../styles/ui/b_dropdown.scss'),
		HouseAutocompleteStyle			= require('../../../../../../../styles/ui/b_house_autocomplete_wrapper.scss'),
		SmallCheckboxBlockStyle			= require('../../../../../../../styles/ui/b_small_checkbox_block.scss');

const EventForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		mode:			React.PropTypes.string.isRequired,
		isCopyMode:		React.PropTypes.bool
	},
	getDefaultProps: function(){
		return {
			mode: EventFormConsts.EVENT_FORM_MODE.SCHOOL
		};
	},
	componentWillMount: function() {
		const binding = this.getDefaultBinding();

		binding.set(
			'eventFormOpponentSchoolKey',
			Immutable.fromJS(RandomHelper.getRandomString())
		);
	},
	getMainSchoolFilter: function(rivals, schoolName) {
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
	handleChangeFartherThan: function (eventDescriptor) {
		const	binding	= this.getDefaultBinding(),
				rivals	= binding.toJS('rivals');

		binding.atomically()
			.set('rivals',						Immutable.fromJS([rivals[0]]))
			.set('eventFormOpponentSchoolKey',	Immutable.fromJS(RandomHelper.getRandomString()))
			.set('fartherThen',					eventDescriptor.target.value)
			.commit();
	},
	changeCompleteAges: function (selections) {
		const binding = this.getDefaultBinding();

		binding.set('model.ages', Immutable.fromJS(selections));
	},
	handleChangeGender: function (gender) {
		const binding = this.getDefaultBinding();

		binding.set('model.gender', Immutable.fromJS(gender));
	},
	getFartherThenItems: function () {
		return EventHelper.distanceItems.map(item => {
			return (
				<option	value	= { item.id }
						key		= { item.id }
				>
					{item.text}
				</option>
			);
		});
	},
	isShowDistanceSelector: function() {
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
	renderSchoolManager: function () {
		let result;

		switch (this.props.mode) {
			case EventFormConsts.EVENT_FORM_MODE.SCHOOL: {
				result = (
					<SchoolsManager
						binding			= { this.getDefaultBinding() }
						activeSchoolId	= { this.props.activeSchoolId }
					/>
				);
				break;
			}
			case EventFormConsts.EVENT_FORM_MODE.SCHOOL_UNION: {
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
	renderGameTypeSelector: function () {
		let result;

		switch (this.props.mode) {
			case EventFormConsts.EVENT_FORM_MODE.SCHOOL: {
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
			case EventFormConsts.EVENT_FORM_MODE.SCHOOL_UNION: {
				result = null;
				break;
			}
		}

		return result;
	},
	renderAgeMultiselectDropdownWrapper: function () {
		let result;

		switch (EventFormConsts.EVENT_FORM_MODE.SCHOOL) {
			case EventFormConsts.EVENT_FORM_MODE.SCHOOL: {
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
			case EventFormConsts.EVENT_FORM_MODE.SCHOOL_UNION: {
				result = null;
				break;
			}
		}

		return result;
	},
	render: function() {
		const	self = this,
				binding = self.getDefaultBinding();

		const	event						= binding.toJS('model'),
				fartherThen					= binding.get('fartherThen'),
				type						= event.type,
				opponentSchoolInfoArray		= this.getOpponentSchoolInfoArray();

		return(
			<div className="eManager_base">
				<DateSelectorWrapper binding={binding.sub('model.startTime')}/>
				<div className="bInputWrapper">
					<div className="bInputLabel">
						Start Time
					</div>
					<TimeInputWrapper binding={binding.sub('model.startTime')}/>
				</div>
				<div className="bInputWrapper">
					<div className="bInputLabel">
						Finish Time
					</div>
					<TimeInputWrapper binding={binding.sub('model.endTime')}/>
				</div>
				<SportSelectorWrapper
					binding			= { binding }
					activeSchoolId	= { this.props.activeSchoolId }
					mode			= { this.props.mode }
				/>
				<div className="bInputWrapper">
					<div className="bInputLabel">
						Genders
					</div>
					<GenderSelectorWrapper
						gender				= { binding.toJS('model.gender') }
						sport				= { this.getSport() }
						handleChangeGender	= { this.handleChangeGender }
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
								defaultValue	= {EventHelper.distanceItems[0].id}
								value			= {fartherThen}
								onChange		= {self.handleChangeFartherThan}
						>
							{self.getFartherThenItems()}
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
				<EventVenue	binding					= { binding }
							eventType				= { binding.toJS('model.type') }
							activeSchoolInfo		= { binding.toJS('schoolInfo') }
							opponentSchoolInfoArray	= { opponentSchoolInfoArray }
							isCopyMode				= { this.props.isCopyMode }
				/>
			</div>
		);
	}
});

module.exports = EventForm;