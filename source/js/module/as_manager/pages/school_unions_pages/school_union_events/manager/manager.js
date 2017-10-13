const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable');

const	EventForm			= require('module/as_manager/pages/events/manager/event_form/event_form');

const	LocalEventHelper	= require('module/as_manager/pages/events/eventHelper');

const	Loader				= require('module/ui/loader');

const Manager = React.createClass({
	mixins:[Morearty.Mixin ],
	listeners: [],
	onDebounceChangeSaveButtonState: undefined,
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	getDefaultState: function () {
		var calendarBinding = this.getBinding('calendar');

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
			step: 1,
			availableAges: [],
			rivals: [],
			error: [],
			isEventManagerSync: false,
			isSync: false,
			isSavingChangesModePopupOpen: false,
			fartherThen: LocalEventHelper.distanceItems[0].id,
			eventFormOpponentSchoolKey: undefined,
			isShowAllSports: false,
			isSaveButtonActive: false
		});
	},
	componentWillMount: function () {
		this.isCopyMode = false;
	},
	render: function() {
		const	binding				= this.getDefaultBinding(),
				isEventManagerSync	= true;

		const	commonBinding	= {
			default		: binding,
			sports		: this.getBinding('sports'),
			calendar	: this.getBinding('calendar')
		};

		let content;
		if(isEventManagerSync && this.getBinding('sports').toJS().sync) {
			content = (
				<EventForm
					binding			= { commonBinding }
					activeSchoolId	= { this.props.activeSchoolId }
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