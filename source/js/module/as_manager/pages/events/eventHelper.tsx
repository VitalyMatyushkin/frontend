import * as TeamHelper from 'module/ui/managers/helpers/team_helper';
import * as propz from 'propz';
import * as Immutable from 'immutable';
import * as EventConsts from 'module/helpers/consts/events';
import * as ViewModeConsts from 'module/ui/view_selector/consts/view_mode_consts';
import * as ManagerWrapperHelper from '../event/view/manager_wrapper/manager_wrapper_helper';
import * as NewManagerWrapperHelper from '../event/view/manager_wrapper/new_manager_wrapper_helper';
import * as RivalManager from 'module/as_manager/pages/event/view/rivals/helpers/rival_manager';
import {EVENT_FORM_MODE} from 'module/as_manager/pages/events/manager/event_form/consts/consts';
import {Event} from './events';

export const LocalEventHelper = {
	clientEventTypeToServerClientTypeMapping: {
		'inter-schools':	'EXTERNAL_SCHOOLS',
		'houses':			'INTERNAL_HOUSES',
		'internal':			'INTERNAL_TEAMS'
	},

	serverEventTypeToClientEventTypeMapping: {
		'EXTERNAL_SCHOOLS':	'inter-schools',
		'INTERNAL_HOUSES':	'houses',
		'INTERNAL_TEAMS':	'internal'
	},

	distanceItems: [
		{id: 'UNLIMITED', text:'Unlimited'},
		{id: '10M', value: 10, text: '10 miles'},
		{id: '20M', value: 20, text: '20 miles'},
		{id: '30M', value: 30, text: '30 miles'},
		{id: '40M', value: 40, text: '40 miles'},
		{id: '50M', value: 50, text: '50 miles'}
	],

	setParamsFromUrl: function(eventManagerContext): void {
		const rootBinding = eventManagerContext.getMoreartyContext().getBinding();

		eventManagerContext.mode = rootBinding.get('routing.parameters.mode');
		if(typeof eventManagerContext.mode !== 'undefined') {
			eventManagerContext.eventId = rootBinding.get('routing.parameters.eventId');
		}
	},

	setEvent: function(eventManagerContext, eventId: string, schoolType: string): Promise<any> {
		const binding = eventManagerContext.getDefaultBinding();

		let event;

		// TODO check inter-schools case
		return (window as any).Server.schoolEvent.get({
			schoolId	: eventManagerContext.props.activeSchoolId,
			eventId		: eventId
		})
			.then(_event => {
				event = _event;

				return TeamHelper.getSchoolsArrayWithFullDataByEvent(event);
			})
			.then(schoolsData => {
				// Schools data need for rival helper
				event.schoolsData = schoolsData;

				delete event.status;
				// It's a convertation event data to EventForm component format,
				// because event
				event.gender = this.convertServerGenderConstToClient(event);
				event.type = this.convertServerEventTypeConstToClient(event);

				// TODO need reviver for postcode on server side
				const postcodeId = propz.get(event, ['venue', 'postcodeData', '_id'], undefined);
				if(typeof postcodeId !== 'undefined') {
					event.venue.postcodeData.id = postcodeId;
				}
				if (event.venue.venueType === "TBD") {
					event.venue.postcodeData = {
						id: "TBD",
						postcode: "TBD"
					}
				}
				const rivals = this.getRivals(eventManagerContext, event, schoolType);
				binding.atomically()
					.set('isSubmitProcessing',				false)
					.set('isSavingChangesModePopupOpen',	false)
					.set('model',							Immutable.fromJS(event))
					.set('model.sportModel',				Immutable.fromJS(event.sport))
					.set('rivals',							Immutable.fromJS(rivals))
					.set('error',							Immutable.fromJS([
						{
							isError: false,
							text: ""
						},
						{
							isError: false,
							text: ""
						}
					]))
					.commit();

				return true;
			});
	},

	getRivals: function(eventManagerContext, event: Event, schoolType: string): any[] {
		let rivals;
		if(TeamHelper.isNewEvent(event)) {
			let filteredRivals = [];

			RivalManager.getRivalsByEvent(
				eventManagerContext.props.activeSchoolId,
				event,
				ViewModeConsts.VIEW_MODE.TABLE_VIEW
			)
				.forEach(rival => {
					if(rival.school.id === eventManagerContext.props.activeSchoolId) {
						filteredRivals.push(rival);
					} else if(
						filteredRivals.findIndex(_rival => _rival.school.id === rival.school.id) === -1
					) {
						filteredRivals.push(rival);
					}
				});

			rivals = NewManagerWrapperHelper.getRivals(event, filteredRivals);
		} else {
			rivals = ManagerWrapperHelper.getRivals(eventManagerContext.props.activeSchoolId, event, true);
			if(TeamHelper.isNonTeamSport(event)) {
				rivals.forEach(rival => {
					rival.players.forEach(p => {
						p.id = p.userId;
					});
				});
			}
		}

		if(schoolType === EVENT_FORM_MODE.SCHOOL_UNION) {
			rivals = rivals.filter(r => r.school.id !== eventManagerContext.props.activeSchoolId);
		}

		return rivals;
	},

	/**
	 * Get event from server by eventId and set date from this event to event form.
	 * It needs for 'another' creation mode - when user create event by click "add another event" button.
	 */
	setDateFromEventByEventId:function (eventManagerContext, eventId: string) {
		return (window as any).Server.schoolEvent.get(
			{
				schoolId	: eventManagerContext.props.activeSchoolId,
				eventId		: eventId
			}
		).then(event => {
			eventManagerContext.getDefaultBinding().set(
				'model.startTime',
				Immutable.fromJS(event.startTime)
			);

			return true;
		});
	},

	convertServerGenderConstToClient: function(event: Event) {
		switch (event.gender) {
			case EventConsts.EVENT_GENDERS_SERVER.FEMALE_ONLY:
				return EventConsts.EVENT_GENDERS.FEMALE_ONLY;
			case EventConsts.EVENT_GENDERS_SERVER.MALE_ONLY:
				return EventConsts.EVENT_GENDERS.MALE_ONLY;
			case EventConsts.EVENT_GENDERS_SERVER.MIXED:
				return EventConsts.EVENT_GENDERS.MIXED;
		}
	},

	convertServerEventTypeConstToClient: function(event: Event) {
		return this.serverEventTypeToClientEventTypeMapping[event.eventType];
	}
};