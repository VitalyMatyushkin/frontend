/**
 * Created by Anatoly on 26.09.2016.
 */

import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';

import {Challenges} from '../../../../ui/challenges/challenges';
import {Calendar} from './calendar';
import {CalendarActions} from './calendar-actions';
import {CalendarSize} from "module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard_calendar_widget/dashboard_calendar_widget";
import {CalendarFooter} from "module/as_manager/pages/events/calendar/calendar_footer";
import * as EventHeaderActions from 'module/as_manager/pages/event/view/event_header/event_header_actions';
import {ConfirmPopup} from 'module/ui/confirm_popup';
import * as RoleHelper from 'module/helpers/role_helper';
import './../../../../../../styles/pages/events/b_events.scss';

export enum EventsCalendarViewMode {
	Default = 'DEFAULT',
	LeftCol = 'LEFT_COL',
	RightCol = 'RIGHT_COL'
}

/** Show calendar section: month calendar and events for selected date */
export const EventsCalendar = (React as any).createClass({
	mixins:[Morearty.Mixin ],
	propTypes: {
		size: (React as any).PropTypes.string,
		extraStyleForContainer: (React as any).PropTypes.string,
		extraStyleForCol: (React as any).PropTypes.string
	},
	componentWillReceiveProps(newProps) {
		let viewMode;
		if(newProps.size === CalendarSize.ExtraSmall || newProps.size === CalendarSize.Small) {
			viewMode = EventsCalendarViewMode.LeftCol;
		} else {
			viewMode = EventsCalendarViewMode.Default;
		}

		this.getDefaultBinding().set('eventsCalendarComponentState', Immutable.fromJS({viewMode}));
	},
	componentWillMount () {
		const	binding         = this.getDefaultBinding(),
				activeSchoolId  = this.getMoreartyContext().getBinding().get('userRules.activeSchoolId');

		binding.set('isSyncSlider', false);
		/** Loading initial data for this month */
		CalendarActions.setSelectedDate(new Date(), activeSchoolId, binding);
		this.initCalendarViewMode();

		if (this.isSchoolWorker()) {
			(window as any).Server.profile.get().then(p => {
				binding.set('isSyncSlider', true);
				binding.set('webIntroEnabled', p.webIntroEnabled);
				binding.set('webIntroShowTimes', p.webIntroShowTimes);
			});
		}
	},
	initCalendarViewMode() {
		let viewMode;

		switch (this.props.size) {
			case CalendarSize.ExtraSmall: {
				viewMode = EventsCalendarViewMode.LeftCol;
				break;
			}
			case CalendarSize.Small: {
				viewMode = EventsCalendarViewMode.LeftCol;
				break;
			}
			default: {
				viewMode = EventsCalendarViewMode.Default;
			}
		}

		this.getDefaultBinding().set('eventsCalendarComponentState', Immutable.fromJS( { viewMode: viewMode } ) );
	},
	isSchoolWorker (): boolean {
		const	role		= RoleHelper.getLoggedInUserRole(this),
				schoolKind	= RoleHelper.getActiveSchoolKind(this);

		return typeof role !== "undefined" && schoolKind === "School";
	},
	isShowLeftCol(): boolean {
		const viewMode = this.getDefaultBinding().toJS('eventsCalendarComponentState.viewMode');

		return viewMode === EventsCalendarViewMode.Default || viewMode === EventsCalendarViewMode.LeftCol;
	},
	isShowRightCol(): boolean {
		const viewMode = this.getDefaultBinding().toJS('eventsCalendarComponentState.viewMode');

		return viewMode === EventsCalendarViewMode.Default || viewMode === EventsCalendarViewMode.RightCol;
	},
	getStyleForContainer() {
		let style = "bEvents";

		if(typeof this.props.extraStyleForContainer !== 'undefined') {
			style += ` ${this.props.extraStyleForContainer}`;
		}

		return style;
	},
	getColModifierStyle() {
		let style = '';

		if(typeof this.props.extraStyleForCol !== 'undefined') {
			style = ` ${this.props.extraStyleForCol}`
		}

		return style;
	},
	getSizeModifierStyle() {
		switch (this.props.size) {
			case CalendarSize.ExtraSmall: {
				return ' mExtraSmall';
			}
			case CalendarSize.Small: {
				return ' mSmall';
			}
			case CalendarSize.Medium: {
				return ' mMedium';
			}
			default: {
				return ''
			}
		}
	},
	handleClickBackButton(): void {
		this.getDefaultBinding().set('eventsCalendarComponentState', Immutable.fromJS( { viewMode: EventsCalendarViewMode.LeftCol } ) );
	},
	handleEventClick: function(eventId){
		document.location.hash = 'event/' + eventId + '?tab=gallery';
	},
	handleRemoveEvent(eventId: string): void {
		const binding = this.getDefaultBinding();

		binding.atomically()
			.set("deleteEventId", eventId)
			.set("isDeleteEventPopupOpen", true)
			.commit();
	},
	handleClickDeleteButton(): void {
		const 	activeSchoolId 	= this.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
			binding 		= this.getDefaultBinding(),
			selectedDate 	= typeof binding.toJS('selectedDate') !== 'undefined' ? binding.toJS('selectedDate') : new Date(),
			eventId 		= binding.toJS("deleteEventId");

		EventHeaderActions.deleteEvent(activeSchoolId, eventId).then( () => {
			binding.set("isDeleteEventPopupOpen", false);
			(window as any).simpleAlert(
				'Event has been successfully deleted',
				'Ok',
				() => {
					CalendarActions.setSelectedDate(selectedDate, activeSchoolId, binding);
				}
			);
		});
	},
	handleCancelDeleteEventPopup(): void {
		const binding = this.getDefaultBinding();

		binding.set("isDeleteEventPopupOpen", false);
	},
	handleClickAddEventButton(): void {
		document.location.hash = 'events/manager';
	},
	handleClickCalendarDate(): void {
		if(this.props.size === CalendarSize.Small) {
			this.getDefaultBinding().set(
				'eventsCalendarComponentState',
				Immutable.fromJS({
					viewMode: EventsCalendarViewMode.RightCol
				})
			);
		}
	},

	renderAddEventButtonForLeftCol() {
		switch (this.props.size) {
			case CalendarSize.Small: {
				return (
					<CalendarFooter
						size={this.props.size}
						handleClick={this.handleClickAddEventButton}
						extraStyle={'mLeftCol'}
					/>
				);
			}
			default: {
				return null;
			}
		}
	},
	renderDeleteEventPopupOpen(): React.ReactNode | null {
		const binding = this.getDefaultBinding();

		if(binding.get("isDeleteEventPopupOpen")) {
			return (
				<ConfirmPopup
					okButtonText="Delete"
	                cancelButtonText="Cancel"
					isOkButtonDisabled={false}
					handleClickOkButton={this.handleClickDeleteButton}
					handleClickCancelButton={this.handleCancelDeleteEventPopup}
				>
					<div>Are you sure you want to delete the selected event?</div>
				</ConfirmPopup>
			)
		} else {
			return null;
		}
	},
	render(){
		const binding = this.getDefaultBinding();
		const activeSchoolId = this.getMoreartyContext().getBinding().get('userRules.activeSchoolId');
		const isSelectedDateEventsInSync = binding.get('selectedDateEventsData.isSync');
		const isUserSchoolWorker = RoleHelper.isUserSchoolWorker(this);
		const selectedDateEvents = binding.toJS('selectedDateEventsData.events');

		return (
			<div className={this.getStyleForContainer()}>
				<div className="eEvents_row">
					{
						this.isShowLeftCol() ?
							<div className={`eEvents_leftSideContainer ${this.getColModifierStyle()} ${this.getSizeModifierStyle()}`}>
								<Calendar
									onSelect={() => this.handleClickCalendarDate()}
									size={this.props.size}
									binding={binding}
								/>
								{this.renderAddEventButtonForLeftCol()}
							</div> : null
					}
					{
						this.isShowRightCol() ?
							<div className={`eEvents_rightSideContainer ${this.getSizeModifierStyle()}`}>
								<Challenges
									size={this.props.size}
									activeSchoolId={activeSchoolId}
									isSync={isSelectedDateEventsInSync}
									events={selectedDateEvents}
									onClick={(eventId) => this.handleEventClick(eventId)}
									onClickDeleteEvent={(eventId) => this.handleRemoveEvent(eventId)}
									isUserSchoolWorker={isUserSchoolWorker}
								/>
								<CalendarFooter
									size={this.props.size}
									isShowBackButton={true}
									handleClick={() => this.handleClickAddEventButton()}
									handleClickBackButton={() => this.handleClickBackButton()}
									extraStyle={this.props.size === CalendarSize.Small ? 'mNoLeftMargin' : ''}
								/>
							</div> : null
					}
				</div>
				{ this.renderDeleteEventPopupOpen() }
			</div>
		);
	}
});