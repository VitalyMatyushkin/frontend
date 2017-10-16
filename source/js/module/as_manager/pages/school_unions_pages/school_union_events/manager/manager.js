const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable');

const	EventForm			= require('module/as_manager/pages/events/manager/event_form/event_form');

const	EventFormActions	= require('module/as_manager/pages/events/manager/event_form/event_form_actions');

const	LocalEventHelper	= require('module/as_manager/pages/events/eventHelper');

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
			isTeamManagerSync: false,
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
			isSaveButtonActive: false
		});
	},
	componentWillMount: function () {
		this.isCopyMode = false;

		EventFormActions.getSports(this.props.activeSchoolId).then(sports => {
			this.getDefaultBinding().set('sports', Immutable.fromJS(sports));
			this.getDefaultBinding().set('isSync', true);
		});
	},
	isSync: function () {
		return this.getDefaultBinding().toJS('isSync');
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
	render: function() {
		console.log(
			this.getDefaultBinding().toJS()
		);

		let content;
		if(this.isSync()) {
			content = (
				<EventForm
					binding			= { this.getEventFormBinding() }
					activeSchoolId	= { this.props.activeSchoolId }
					mode			= { EventFormConsts.EVENT_FORM_MODE.SCHOOL_UNION }
					isCopyMode		= { this.isCopyMode }
				/>
			);
		} else {
			content = (
				<Loader
					condition	= { true }
				/>
			);
		}

		return (
			<div className={'bManager'}>
				{ content }
			</div>
		);
	}
});

module.exports = Manager;