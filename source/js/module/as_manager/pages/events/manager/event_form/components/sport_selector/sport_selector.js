const	React					= require('react'),
		Immutable				= require('immutable'),
		Morearty				= require('morearty'),
		propz					= require('propz');

const	EventFormActions		= require('../../event_form_actions'),
		If						= require('../../../../../../../ui/if/if'),
		Autocomplete			= require('../../../../../../../ui/autocomplete2/OldAutocompleteWrapper');

// Styles
const	InputWrapperStyles		= require('../../../../../../../../../styles/ui/b_input_wrapper.scss'),
		InputLabelStyles		= require('../../../../../../../../../styles/ui/b_input_label.scss'),
		SmallCheckboxBlockStyle	= require('../../../../../../../../../styles/ui/b_small_checkbox_block.scss');

const SportSelector = React.createClass({
	mixins: [Morearty.Mixin],

	componentWillMount: function() {
		this.getDefaultBinding().set('eventFormSportSelectorKey', Immutable.fromJS(this.getRandomString()));
	},

	getRandomString: function() {
		// just current date in timestamp view
		return + new Date();
	},
	getActiveSchoolId: function() {
		return this.getDefaultBinding().toJS('schoolInfo.id');
	},
	getDefaultGender: function(sportModel) {
		switch (true) {
			case sportModel.genders.maleOnly && sportModel.genders.femaleOnly && sportModel.genders.mixed:
				return undefined;
			case sportModel.genders.maleOnly && sportModel.genders.femaleOnly && !sportModel.genders.mixed:
				return undefined;
			case sportModel.genders.femaleOnly:
				return 'femaleOnly';
			case sportModel.genders.maleOnly:
				return 'maleOnly';
			case sportModel.genders.mixed:
				return undefined;
		}
	},
	isOnlyFavoriteSports: function() {
		const	binding						= this.getDefaultBinding(),
				isSchoolHaveFavoriteSports	= binding.get('isSchoolHaveFavoriteSports');

		switch (true) {
			case !isSchoolHaveFavoriteSports:
				return false;
			case !binding.get('isShowAllSports'):
				return true;
		}
	},
	handleChangeCompleteSport: function (id, sport) {
		const	binding		= this.getDefaultBinding(),
				eventType	= binding.toJS('model.type');
		let		rivals		= binding.toJS('rivals');

		switch (eventType) {
			case 'inter-schools':
				rivals = [rivals[0]];
				break;
			case 'houses':
				rivals = [];
				break;
			case 'internal':
				rivals = [{
					id:		null,
					name:	''
				}, {
					id:		null,
					name:	''
				}];
				break;
		}

		binding.atomically()
			.set('model.sportId',		id)
			.set('model.sportModel',	Immutable.fromJS(sport))
			.set('model.gender',		Immutable.fromJS(this.getDefaultGender(sport)))
			.set('rivals',				Immutable.fromJS(rivals))
			.commit();
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
		const	self = this,
				binding = self.getDefaultBinding();

		const	event						= binding.toJS('model'),
				sport						= propz.get(event, ['sportModel']),
				isShowAllSports				= event.isShowAllSports,
				isSchoolHaveFavoriteSports	= binding.get('isSchoolHaveFavoriteSports'),
				eventFormSportSelectorKey	= binding.get('eventFormSportSelectorKey');

		return(
			<div className="bInputWrapper">
				<div className="bInputLabel">
					Game
				</div>
				<Autocomplete
					key				= { eventFormSportSelectorKey }
					serviceFilter	= { EventFormActions.getSportService(this.getActiveSchoolId(), this.isOnlyFavoriteSports()) }
					defaultItem		= { sport }
					serverField		= "name"
					placeholder		= "Enter sport name"
					onSelect		= { this.handleChangeCompleteSport }
					extraCssStyle	= "mWidth250 mInline mWhiteBG"
				/>
				<If condition={isSchoolHaveFavoriteSports}>
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