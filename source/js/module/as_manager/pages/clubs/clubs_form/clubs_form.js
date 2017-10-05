const	React		= require('react'),
		Immutable	= require('immutable'),
		propz		= require('propz'),
		Morearty	= require('morearty');

const	Form					= require('module/ui/form/form'),
		FormField				= require('module/ui/form/form_field'),
		FormColumn				= require('module/ui/form/form_column'),
		Ages					= require('module/as_manager/pages/clubs/clubs_form/components/ages'),
		DateSelector			= require('module/ui/date_selector/date_selector'),
		FullTimeInput			= require('module/ui/full_time_input/full_time_input'),
		GenderSelectorWrapper	= require('module/as_manager/pages/events/manager/event_form/components/gender_selector/gender_selector_wrapper'),
		MultiselectDropdown		= require('module/ui/multiselect-dropdown/multiselect_dropdown'),
		Loader					= require('module/ui/loader');

const	TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		GenderHelper	= require('module/helpers/gender_helper'),
		ClubsHelper		= require('module/as_manager/pages/clubs/clubs_helper'),
		ClubsConst		= require('module/helpers/consts/clubs');

const ClubsActions = require('module/as_manager/pages/clubs/clubs_actions');

const LoaderStyle = require('styles/ui/loader.scss');

const ClubsForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title:			React.PropTypes.string.isRequired,
		activeSchoolId:	React.PropTypes.string.isRequired,
		onFormSubmit:	React.PropTypes.func.isRequired
	},
	componentWillMount: function () {
		const binding = this.getDefaultBinding();

		binding.toJS('isSync', false);

		// shedule
		let startDate = binding.toJS('startDate');
		if(typeof startDate === 'undefined') {
			startDate = new Date();
			binding.set('startDate', Immutable.fromJS(startDate));
		}

		let finishDate = binding.toJS('finishDate');
		if(typeof finishDate === 'undefined') {
			finishDate = new Date();
			binding.set('finishDate', Immutable.fromJS(finishDate));
		}

		let time = binding.toJS('time');
		if(typeof time === 'undefined') {
			time = new Date();
			time.setHours(10);
			time.setMinutes(0);
			binding.set('time', Immutable.fromJS(time));
		}

		let days = binding.toJS('days');
		if(typeof days === 'undefined') {
			binding.set('days', Immutable.fromJS([]));
		}

		let school;
		window.Server.school.get(this.props.activeSchoolId).then(_school => {
			school = _school;

			return window.Server.schoolForms.get(this.props.activeSchoolId, {filter:{limit:1000}});
		}).then(forms => {
			school.forms = forms;

			if(typeof binding.toJS('ages') === 'undefined') {
				binding.set('ages', Immutable.fromJS([]));
			}
			binding.set('school', Immutable.fromJS(school));
			binding.set('isSync', true);
		});
	},
	componentWillUnmount: function () {
		this.getDefaultBinding().clear();
	},
	isShowPriceNumberField: function () {
		const metaPriceTypeField = this.getDefaultBinding().sub('form').meta().toJS('priceType');

		return propz.get(metaPriceTypeField, ['value']) !== ClubsConst.PRICING.FREE;
	},
	getDateObjectFromTime: function () {
		const binding = this.getDefaultBinding();

		const	timeString = binding.toJS('time'),
				dateObject = new Date(timeString);

		return dateObject;
	},
	getWeekDays: function () {
		return ClubsHelper.getWeekDays();
	},
	getSelectedWeekDays: function () {
		return this.getDefaultBinding().toJS('days');
	},
	handleChangeStartDate: function (date) {
		this.getDefaultBinding().set('startDate', Immutable.fromJS(date));
	},
	handleChangeFinishDate: function (date) {
		this.getDefaultBinding().set('finishDate', Immutable.fromJS(date));
	},
	handleSelectWeekDay: function (day) {
		const binding = this.getDefaultBinding();

		const days = binding.toJS('days');

		const dayIndex = days.findIndex(_d => _d.id === day.id);

		if(dayIndex !== -1) {
			days.splice(dayIndex, 1);
		} else {
			days.push(day);
		}

		binding.set('days', Immutable.fromJS(days));
	},
	handleChangeHour: function(hour) {
		const binding = this.getDefaultBinding();

		const	timeString = binding.toJS('time'),
			dateObject = new Date(timeString);

		dateObject.setHours(hour);

		binding.set('time', dateObject.toISOString());
	},
	handleChangeMinutes: function(minute) {
		const binding = this.getDefaultBinding();

		const	timeString = binding.toJS('time'),
			dateObject = new Date(timeString);

		dateObject.setMinutes(minute);

		binding.set('time', dateObject.toISOString());
	},
	handleChangePriceType: function () {
		if(!this.isShowPriceNumberField()) {
			this.getDefaultBinding().sub('form').meta().set('price.value', 0);
		}
	},
	handleClickAgeItem: function(ageItem) {
		const ages = this.getDefaultBinding().toJS('ages');

		const foundAgeIndex = ages.findIndex(a => a === ageItem.id);

		if(foundAgeIndex !== -1) {
			ages.splice(foundAgeIndex, 1);
		} else {
			ages.push(ageItem.id);
		}

		this.getDefaultBinding().set('ages', Immutable.fromJS(ages));
	},
	handleChangeGender: function (gender) {
		this.getDefaultBinding().set('gender', Immutable.fromJS(gender));
	},
	handleChangeSport: function (sportId, sport) {
		this.getDefaultBinding().set(
			'sport',
			Immutable.fromJS(sport)
		);
		this.getDefaultBinding().set(
			'sportId',
			Immutable.fromJS(sport)
		);

		this.getDefaultBinding().set(
			'gender',
			Immutable.fromJS(
				GenderHelper.getDefaultGender(sport)
			)
		);
	},
	render: function() {
		const binding = this.getDefaultBinding();

		let form = null;

		if(binding.toJS('isSync')) {
			form = (
				<div className ="container">
					<Form
						name			= { this.props.title }
						onSubmit		= { this.props.onFormSubmit }
						binding			= { binding.sub('form') }
						submitButtonId	= 'club_submit'
						cancelButtonId	= 'club_cancel'
					>
						<FormColumn
							key			= 'column_1'
							customStyle	= 'col-md-5 col-md-offset-1'
						>
							<FormField
								type		= "text"
								field		= "name"
								validation	= "required"
							>
								Club name
							</FormField>
							<FormField
								type	= "text"
								field	= "description"
							>
								Description
							</FormField>
							<FormField
								field			= 'sportId'
								type			= 'autocomplete'
								defaultItem		= { binding.toJS('form.sport') }
								serviceFullData	= {
									ClubsActions.getSportsService(this.props.activeSchoolId)
								}
								onSelect		= { this.handleChangeSport }
								validation		= "required"
							>
								Sport
							</FormField>
							<div className="eForm_field mBlue">
								<div className="eForm_fieldName">
									Gender
								</div>
								<GenderSelectorWrapper
									gender				= { binding.toJS('gender') }
									sport				= { binding.toJS('sport') }
									handleChangeGender	= { this.handleChangeGender }
									extraStyle			= { 'mSmallView' }
								/>
							</div>
							<div className="eForm_field">
								<div className="eForm_fieldName">
									Ages
								</div>
								<Ages
									ageGroupsNaming	= { binding.toJS('school.ageGroupsNaming') }
									availableAges	= { TeamHelper.getAges(binding.toJS('school')) }
									ages			= { binding.toJS('ages') }
									handleClickItem	= { this.handleClickAgeItem }
								/>
							</div>
							<FormField
								field	= 'maxParticipants'
								type	= 'number'
							>
								Maximum number of students
							</FormField>
							<FormField
								field		= 'priceType'
								type		= 'dropdown'
								options		= { ClubsConst.PRICING_ARRAY }
								onSelect	= { this.handleChangePriceType }
							>
								Price Type
							</FormField>
							<FormField
								field		= 'price'
								type		= 'number'
								isDisabled	= { !this.isShowPriceNumberField() }
							>
								Price
							</FormField>
						</FormColumn>
						<FormColumn
							key			= 'column_2'
							customStyle	= 'col-md-5 col-md-offset-1'
						>
							<div className="eForm_field">
								<div className="eForm_fieldName">
									Start date
								</div>
								<DateSelector	date				= { binding.toJS('startDate') }
												handleChangeDate	= { this.handleChangeStartDate }
												isSmallView			= { true }
												extraStyle			= { 'mWithoutMargin' }
								/>
							</div>
							<div className="eForm_field">
								<div className="eForm_fieldName">
									End date
								</div>
								<DateSelector	date				= { binding.toJS('finishDate') }
												handleChangeDate	= { this.handleChangeFinishDate }
												isSmallView			= { true }
												extraStyle			= { 'mWithoutMargin' }
								/>
							</div>
							<div className="eForm_field">
								<div className="eForm_fieldName">
									Time
								</div>
								<FullTimeInput	hourValue			= { this.getDateObjectFromTime().getHours() }
												minutesValue		= { this.getDateObjectFromTime().getMinutes() }
												handleChangeHour	= { this.handleChangeHour }
												handleChangeMinutes	= { this.handleChangeMinutes }
								/>
							</div>
							<FormField
								field		= 'duration'
								type		= 'number'
							>
								Duration(min)
							</FormField>
							<div className="eForm_field">
								<div className="eForm_fieldName">
									Week days
								</div>
								<MultiselectDropdown
									items			= { this.getWeekDays() }
									selectedItems	= { this.getSelectedWeekDays() }
									handleClickItem	= { this.handleSelectWeekDay }
									extraStyle		= { 'mSmallWide' }
								/>
							</div>
						</FormColumn>
					</Form>
				</div>
			);
		} else {
			form = (
				<div className='bLoaderWrapper'>
					<Loader condition={ true }/>
				</div>
			);
		}

		return form;
	}
});

module.exports = ClubsForm;