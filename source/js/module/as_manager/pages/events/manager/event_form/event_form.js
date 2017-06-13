// Main components
const	React							= require('react'),
		Morearty						= require('morearty'),
		Immutable						= require('immutable'),
		propz							= require('propz'),
		If								= require('../../../../../ui/if/if'),
		Autocomplete					= require('../../../../../ui/autocomplete2/OldAutocompleteWrapper'),
		SchoolItemList					= require('../../../../../ui/autocomplete2/custom_list_items/school_list_item/school_list_item');

// EventForm React components
const	DateSelectorWrapper				= require('./components/date_selector/date_selector_wrapper'),
		GenderSelectorWrapper			= require('./components/gender_selector/gender_selector_wrapper'),
		GameTypeSelectorWrapper			= require('./components/game_type_selector/game_type_selector_wrapper'),
		AgeMultiselectDropdownWrapper	= require('./components/age_multiselect_dropdown/age_multiselect_dropdown_wrapper'),
		SportSelectorWrapper			= require('./components/sport_selector/sport_selector'),
		TimeInputWrapper				= require('../time_input_wrapper'),
		EventVenue						= require('../event_venue'),
		SquareCrossButton				= require('module/ui/square_cross_button'),
		HousesManager					= require('module/as_manager/pages/events/manager/event_form/components/houses_manager/houses_manager');

// Helpers
const	EventFormActions				= require('./event_form_actions'),
		TeamHelper						= require('module/ui/managers/helpers/team_helper'),
		EventHelper						= require('../../eventHelper'),
		GeoSearchHelper					= require('../../../../../helpers/geo_search_helper'),
		SportHelper 					= require('module/helpers/sport_helper');

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
		isCopyMode : React.PropTypes.bool
	},
	componentWillMount: function() {
		const binding = this.getDefaultBinding();

		const isSchoolHaveFavoriteSports = this.isSchoolHaveFavoriteSports();

		binding.atomically()
			.set('isShowAllSports', !isSchoolHaveFavoriteSports )
			.set('isSchoolHaveFavoriteSports', isSchoolHaveFavoriteSports)
			.set('eventFormOpponentSchoolKey', Immutable.fromJS(this.getRandomString()))
			.commit();
	},
	getActiveSchoolId: function() {
		return this.getDefaultBinding().toJS('schoolInfo.id');
	},
	getRandomString: function() {
		// just current date in timestamp view
		return + new Date();
	},
	getMainSchoolFilter: function(rivals, schoolName) {
		return {
			filter: {
				where: {
					id: {
						$nin: rivals.map(r => r.id)
					},
					name: { like: schoolName }
				},
				limit: 40
			}
		};
	},
	/**
	 * School filtering service
	 * @param schoolName
	 * @returns {*}
	 */
	schoolService: function(schoolName) {
		const binding = this.getDefaultBinding();

		const	activeSchool			= binding.toJS('schoolInfo'),
				activeSchoolId			= activeSchool.id,
				activeSchoolPostcode	= activeSchool.postcode,
				rivals					= binding.toJS('rivals'),
				fartherThen				= binding.toJS('fartherThen');

		const filter = this.getMainSchoolFilter(rivals, schoolName);
		if(typeof activeSchoolPostcode !== 'undefined') {
			const point = activeSchoolPostcode.point;
			filter.filter.where['postcode.point'] = GeoSearchHelper.getMainGeoSchoolFilterByParams(fartherThen, point);
		} else {
			filter.filter.order = "name ASC";
		}

		let schools;
		return window.Server.publicSchools.get(filter)
			.then(_schools => {
				schools = _schools;

				return this.getTBDSchool();
			})
			.then(data => {
				if(data.length > 0 && data[0].name === "TBD") {
					// set TBD school at first
					schools.unshift(data[0]);
				}
				return schools;
			});
	},
	getTBDSchool: function() {
		const filter = {
			filter: {
				where: {
					name: { like: "TBD" }
				}
			}
		};
		return window.Server.publicSchools.get(filter);
	},
	handleChangeFartherThan: function (eventDescriptor) {
		const	binding	= this.getDefaultBinding(),
				rivals	= binding.toJS('rivals');

		binding.atomically()
			.set('rivals',						Immutable.fromJS([rivals[0]]))
			.set('eventFormOpponentSchoolKey',	Immutable.fromJS(this.getRandomString()))
			.set('fartherThen',					eventDescriptor.target.value)
			.commit();
	},
	changeCompleteAges: function (selections) {
		const binding = this.getDefaultBinding();

		binding.set('model.ages', Immutable.fromJS(selections));
	},
	onSelectRival: function (order, id, model) {
		const binding	= this.getDefaultBinding();

		if (typeof id !== 'undefined' && typeof model !== 'undefined') {
			binding.set(`rivals.${order}`, Immutable.fromJS(model));
		}
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
	onClickRemoveRivalSchool: function(rivalIndex) {
		const	binding	= this.getDefaultBinding();
		let		rivals	= binding.toJS('rivals');

		rivals.splice(rivalIndex, 1);

		binding.set('rivals', Immutable.fromJS(rivals));
	},
	renderSchoolChoosers: function() {
		const	binding	= this.getDefaultBinding(),
				event	= binding.toJS('model'),
				sport	= event.sportModel,
				rivals	= binding.toJS('rivals');

		const choosers = rivals.filter((rival, rivalIndex) => rivalIndex !== 0).map((rival, rivalIndex) => {
			return (
				<span>
					<Autocomplete	defaultItem		= {binding.toJS(`rivals.${rivalIndex + 1}`)}
									serviceFilter	= {this.schoolService}
									serverField		= "name"
									placeholder		= "Enter school name"
									onSelect		= {this.onSelectRival.bind(null, rivalIndex + 1)}
									binding			= {binding.sub(`autocomplete.inter-schools.${rivalIndex}`)}
									extraCssStyle	= "mBigSize mWidth350 mInline mRightMargin mWhiteBG"
									customListItem	= {SchoolItemList}
					/>
					<SquareCrossButton
						handleClick={this.onClickRemoveRivalSchool.bind(this, rivalIndex + 1)}
					/>
				</span>
			);
		});

		if(
			rivals.length === 1 ||
			(
				rivals.length >= 2 &&
				typeof sport !== 'undefined' && sport.multiparty &&
				(TeamHelper.isTeamSport(event) || SportHelper.isAthletics(sport.name))
			)
		) {
			choosers.push(
				<Autocomplete	defaultItem		= {binding.toJS(`rivals.${rivals.length}`)}
								serviceFilter	= {this.schoolService}
								serverField		= "name"
								placeholder		= "Enter school name"
								onSelect		= {this.onSelectRival.bind(null, rivals.length)}
								binding			= {binding.sub(`autocomplete.inter-schools.${rivals.length}`)}
								extraCssStyle	= "mBigSize mWhiteBG"
								customListItem	= {SchoolItemList}
				/>
			);
		}

		return (
			<div className="bInputWrapper">
				<div className="bInputLabel">
					Choose schools
				</div>
				{choosers}
			</div>
		);
	},
	render: function() {
		const	self = this,
				binding = self.getDefaultBinding();

		const	event						= binding.toJS('model'),
				fartherThen					= binding.get('fartherThen'),
				isSchoolHaveFavoriteSports	= binding.get('isSchoolHaveFavoriteSports'),
				type						= event.type,
				opponentSchoolInfoArray		= binding.toJS('rivals').slice(1);

		return(
			<div className="eManager_base">
				<DateSelectorWrapper binding={binding.sub('model.startTime')}/>
				<div className="bInputWrapper">
					<div className="bInputLabel">
						Time
					</div>
					<TimeInputWrapper binding={binding.sub('model.startTime')}/>
				</div>
				<SportSelectorWrapper binding={binding}/>
				<div className="bInputWrapper">
					<div className="bInputLabel">
						Genders
					</div>
					<GenderSelectorWrapper binding={binding}/>
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
				<If	condition	= {this.isShowDistanceSelector()}
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
				<If	condition	= {type === 'inter-schools'}
					key			= {'if-choose-school'}
				>
					{ this.renderSchoolChoosers() }
				</If>
				<If condition={type === 'houses'}>
					<HousesManager
						binding			= { binding }
						activeSchoolId	= { binding.get('schoolInfo.id') }
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