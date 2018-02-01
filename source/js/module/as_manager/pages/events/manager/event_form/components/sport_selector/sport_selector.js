const	React					= require('react'),
		Immutable				= require('immutable'),
		Morearty				= require('morearty'),
		propz					= require('propz');

const	EventFormActions		= require('../../event_form_actions'),
		{If}					= require('../../../../../../../ui/if/if'),
		GenderHelper			= require('module/helpers/gender_helper'),
		SchoolHelper 			= require('module/helpers/school_helper'),
		{Autocomplete}			= require('../../../../../../../ui/autocomplete2/OldAutocompleteWrapper');

// Helpers
const	RivalsHelper			= require('module/ui/managers/rival_chooser/helpers/rivals_helper');

const	EventFormConsts					= require('module/as_manager/pages/events/manager/event_form/consts/consts');

// Styles
const	InputWrapperStyles		= require('../../../../../../../../../styles/ui/b_input_wrapper.scss'),
		InputLabelStyles		= require('../../../../../../../../../styles/ui/b_input_label.scss'),
		SmallCheckboxBlockStyle	= require('../../../../../../../../../styles/ui/b_small_checkbox_block.scss');

const SportSelector = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		mode:			React.PropTypes.string.isRequired
	},
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

	getRandomString: function() {
		// just current date in timestamp view
		return + new Date();
	},
	isOnlyFavoriteSports: function() {
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
	setIsFavoriteSportsEnabled: function() {
		SchoolHelper.loadActiveSchoolInfo(this).then(schoolData => {
			this.getDefaultBinding().set('isFavoriteSportsEnabled', schoolData.isFavoriteSportsEnabled);
		});
	},
	isSchoolHaveFavoriteSports: function() {
		const sports = this.getDefaultBinding().toJS('sports');

		return sports.filter(s => s.isFavorite).length > 0;
	},
	handleChangeCompleteSport: function (id, sport) {
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
	getDefaultRivalsForInterSchoolsEvent: function () {
		let rivals;

		switch (this.props.mode) {
			case EventFormConsts.EVENT_FORM_MODE.SCHOOL: {
				const schoolInfo = this.getDefaultBinding().toJS('schoolInfo');

				rivals = RivalsHelper.getDefaultRivalsForInterSchoolsEvent(schoolInfo);
				break;
			}
			case EventFormConsts.EVENT_FORM_MODE.SCHOOL_UNION: {
				rivals = [];
				break;
			}
		}

		return rivals;
	},
	handleChangeShowAllSports: function() {
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
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event						= binding.toJS('model'),
				sport						= propz.get(event, ['sportModel']),
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

module.exports = SportSelector;