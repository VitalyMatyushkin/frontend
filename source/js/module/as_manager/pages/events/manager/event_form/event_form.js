// Main components
const	React							= require('react'),
		Morearty						= require('morearty'),
		Immutable						= require('immutable'),
		propz							= require('propz'),
		If								= require('../../../../../ui/if/if');

// EventForm React components
const	DateSelectorWrapper				= require('./components/date_selector/date_selector_wrapper'),
		GenderSelectorWrapper			= require('./components/gender_selector/gender_selector_wrapper'),
		GameTypeSelectorWrapper			= require('./components/game_type_selector/game_type_selector_wrapper'),
		AgeMultiselectDropdownWrapper	= require('./components/age_multiselect_dropdown/age_multiselect_dropdown_wrapper'),
		SportSelectorWrapper			= require('./components/sport_selector/sport_selector'),
		TimeInputWrapper				= require('../time_input_wrapper'),
		EventVenue						= require('../event_venue'),
		SchoolsManager					= require('module/as_manager/pages/events/manager/event_form/components/schools_manager/schools_manager'),
		HousesManager					= require('module/as_manager/pages/events/manager/event_form/components/houses_manager/houses_manager');

// Helpers
const	EventHelper						= require('../../eventHelper'),
		RandomHelper					= require('module/helpers/random_helper');

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
		isCopyMode:		React.PropTypes.bool
	},
	componentWillMount: function() {
		const binding = this.getDefaultBinding();

		const isSchoolHaveFavoriteSports = this.isSchoolHaveFavoriteSports();

		binding.atomically()
			.set('isShowAllSports', !isSchoolHaveFavoriteSports )
			.set('isSchoolHaveFavoriteSports', isSchoolHaveFavoriteSports)
			.set('eventFormOpponentSchoolKey', Immutable.fromJS(RandomHelper.getRandomString()))
			.commit();
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
	getSports: function () {
		const	self	= this,
				binding	= this.getDefaultBinding(),
				sports	= self.getBinding('sports').toJS();

		const isSchoolHaveFavoriteSports = binding.get('isSchoolHaveFavoriteSports');

		return sports.models.filter(sport => {
			switch (true) {
				case !isSchoolHaveFavoriteSports:
					return true;
				case binding.get('isShowAllSports'):
					return true;
				default:
					return sport.isFavorite;
			}
		}).map(sport => {
			return (
				<option	value	= { sport.id }
						key		= { sport.id }
				>
					{sport.name}
				</option>
			);
		});
	},
	getFartherThenItems: function () {
		const	self	= this,
				sports	= self.getBinding('sports').toJS();

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
	isSchoolHaveFavoriteSports: function() {
		const sports = this.getBinding('sports').toJS().models;

		return sports.filter(s => s.isFavorite).length > 0;
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
	render: function() {
		const	self = this,
				binding = self.getDefaultBinding();

		const	event						= binding.toJS('model'),
				fartherThen					= binding.get('fartherThen'),
				isSchoolHaveFavoriteSports	= binding.get('isSchoolHaveFavoriteSports'),
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
				<SportSelectorWrapper binding={binding}/>
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
				<div className="bInputWrapper">
					<div className="bInputLabel">
						Ages
					</div>
					<AgeMultiselectDropdownWrapper binding={binding}/>
				</div>
				<div className="bInputWrapper">
					<div className="bInputLabel">
						Game Type
					</div>
					<GameTypeSelectorWrapper binding={binding}/>
				</div>
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
					<SchoolsManager
						binding			= { binding }
						activeSchoolId	= { this.props.activeSchoolId }
					/>
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