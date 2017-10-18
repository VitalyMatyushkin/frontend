const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable');

const	classNames			= require('classnames');

const	EventForm			= require('module/as_manager/pages/events/manager/event_form/event_form'),
		Button				= require('module/ui/button/button');

const	EventFormActions	= require('module/as_manager/pages/events/manager/event_form/event_form_actions');

const	LocalEventHelper	= require('module/as_manager/pages/events/eventHelper'),
		EventHelper			= require('module/helpers/eventHelper'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper');

const	EventFormConsts		= require('module/as_manager/pages/events/manager/event_form/consts/consts');

const	Loader				= require('module/ui/loader');

const Manager = React.createClass({
	mixins:[Morearty.Mixin ],
	listeners: [],
	onDebounceChangeSaveButtonState: undefined,
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	getDefaultState: function () {
		const calendarBinding = this.getBinding('calendar');

		const currentDate = calendarBinding.toJS('selectedDate');
		currentDate.setHours(10);
		currentDate.setMinutes(0);

		return Immutable.fromJS({
			// if true - then user click to finish button
			// so we must block finish button
			isSubmitProcessing: false,
			model: {
				name:			'',
				startTime:		currentDate,
				endTime:		currentDate,
				sportId:		undefined,
				gender:			undefined,
				ages:			[],
				description:	'',
				type:			'inter-schools'
			},
			schoolInfo: {},
			inviteModel: {},
			availableAges: [],
			rivals: [],
			error: [],
			isEventManagerSync: false,
			isSync: false,
			fartherThen: LocalEventHelper.distanceItems[0].id,
			eventFormOpponentSchoolKey: undefined,
			isShowAllSports: false,
		});
	},
	componentWillMount: function () {
		this.isCopyMode = false;

		this.setSchoolInfo()
			.then(() => EventFormActions.getSports(this.props.activeSchoolId))
			.then(sports => {
				this.getDefaultBinding().set('sports', Immutable.fromJS(sports));
				this.getDefaultBinding().set('isSync', true);
			});
	},
	setSchoolInfo: function() {
		//get school data
		return window.Server.school.get(this.props.activeSchoolId)
			.then(schoolData => {
				// get forms data
				this.getDefaultBinding().set('schoolInfo', Immutable.fromJS(schoolData));
				this.getDefaultBinding().set(
					'availableAges',
					Immutable.fromJS(
						this.getAges(schoolData.ageGroups)
					)
				);

				return true;
			})
	},
	getAges: function (ageGroups) {
		const ages = [];

		let age = 0;
		ageGroups.forEach(() => {
			ages.push(age);
			age++;
		});

		return ages;
	},
	isSync: function () {
		return this.getDefaultBinding().toJS('isSync');
	},
	isFinishButtonActive: function() {
		const	self			= this,
				binding			= self.getDefaultBinding();

		return (
			typeof binding.get('model.startTime')				!== 'undefined' &&
			binding.get('model.startTime') 						!== null &&
			binding.get('model.startTime') 						!== '' &&
			typeof binding.toJS('model.sportId')				!== 'undefined' &&
			binding.toJS('model.sportId')						!== '' &&
			typeof binding.toJS('model.gender')					!== 'undefined' &&
			binding.toJS('model.gender')						!== '' &&
			binding.toJS('model.gender')						!== 'not-selected-gender' &&
			typeof binding.toJS('model.type')					!== 'undefined' &&
			binding.toJS('model.type')							!== '' &&
			typeof binding.toJS('model.venue.postcodeData')		!== 'undefined' &&
			typeof binding.toJS('model.venue.postcodeData.id')	!== 'undefined' &&
			self.isAllRivalsSelected()
		);
	},
	isAllRivalsSelected: function() {
		const binding = this.getDefaultBinding();

		let isStepComplete = false;

		const inviterSchoolRival = binding.toJS('inviterSchool');

		if(
			binding.toJS('rivals').length > 0 &&
			typeof inviterSchoolRival !== 'undefined'
		) {
			isStepComplete = true;
		}

		return isStepComplete;
	},
	getEventFormBinding: function () {
		return {
			default		: this.getDefaultBinding(),
			// this stupid design is legacy from prev developer
			// i don't have any time for fix it
			sports		: this.getDefaultBinding().sub('sports'),
			calendar	: this.getBinding('calendar')
		};
	},
	submitEvent: function() {
		const binding = this.getDefaultBinding();

		const model = binding.toJS('model');

		const inviterSchoolRival = binding.toJS('inviterSchool');

		const body = {
			gender:					TeamHelper.convertGenderToServerValue(model.gender),
			// invited
			// convert client event type const to server event type const
			eventType:				EventHelper.clientEventTypeToServerClientTypeMapping[model.type],
			ages:					model.ages,
			sportId:				model.sportId,
			startTime:				model.startTime,
			endTime:				model.endTime,
			startRegistrationTime:	model.startRegistrationTime,
			endRegistrationTime:	model.endRegistrationTime,
			inviterSchoolId:		inviterSchoolRival.school.id
		};

		this.setVenueToBody(body);

		const rivals = binding.toJS('rivals');
		body.invitedSchoolIds = rivals
			.filter(r => r.school.id !== this.props.activeSchoolId)
			.map(r => r.school.id);

		return window.Server.events.post(
			this.props.activeSchoolId,
			body
		);
	},
	activateEvent: function(event) {
		return window.Server.schoolEventActivate.post({
			schoolId:	this.props.activeSchoolId,
			eventId:	event.id
		});
	},
	setVenueToBody: function(body) {
		const binding = this.getDefaultBinding();

		const modelVenue = binding.toJS('model.venue');
		body.venue = {
			venueType: modelVenue.venueType
		};
		if(modelVenue.postcodeData.id !== 'TBD') {
			body.venue.postcodeId = modelVenue.postcodeData.id;
		}
	},
	submit: function () {
		let event;

		this.submitEvent()
			.then(_event => {
				event = _event;

				return this.activateEvent(event);
			})
			.then(() => this.afterEventCreation(event))
	},
	afterEventCreation: function (newEvent) {
		const binding = this.getDefaultBinding();

		document.location.hash = 'event/' + newEvent.id + '?tab=gallery&new=true';
		binding.clear();
		binding.meta().clear();

		return true;
	},
	handleClickFinishButton: function () {
		if(
			this.isFinishButtonActive() &&
			!this.getDefaultBinding().toJS('isSubmitProcessing')
		) {
			this.getDefaultBinding().set('isSubmitProcessing', true);
			this.submit();
		}
	},
	renderContinueButton: function () {
		const	isDisabled = !this.isFinishButtonActive(),
				continueButtonClassName = classNames({
					mWidth:		true,
					mDisable:	isDisabled
				});

		return (
			<div className="eManager_controlButtons">
				<Button
					text				= "Finish"
					onClick				= { this.handleClickFinishButton }
					extraStyleClasses	= { continueButtonClassName }
					isDisabled			= { isDisabled }
				/>
			</div>
		);
	},
	render: function() {
		let content;
		if(this.isSync()) {
			content = (
				<div className={'bManager'}>
					<EventForm
						binding			= { this.getEventFormBinding() }
						activeSchoolId	= { this.props.activeSchoolId }
						mode			= { EventFormConsts.EVENT_FORM_MODE.SCHOOL_UNION }
						isCopyMode		= { this.isCopyMode }
					/>
					{ this.renderContinueButton() }
				</div>
			);
		} else {
			content = (
				<Loader condition = { true }/>
			);
		}

		return content;
	}
});

module.exports = Manager;