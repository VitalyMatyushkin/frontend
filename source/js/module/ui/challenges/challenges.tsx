/**
 * Created by wert on 06.09.16.
 */

import * as React from 'react';
import {ChallengeModel} from './challenge_model';
import {ChallengeListTitle} from './challenge_list_title';
import {ChallengeListItem} from './challenge_list_item';
import {NoResultItem} from './no_result_item';
import {Event} from 'module/as_manager/pages/events/events';

import {CalendarSize} from 'module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard_calendar_widget/dashboard_calendar_widget.tsx';

interface ChallengesProps {
	size?:                  number
	onClick?:				() => void
	isSync?:				boolean
	isDaySelected?:			boolean
	activeSchoolId?:		string
	activeSchoolKind?:		string
	events?:				Event[]
	onClickDeleteEvent?: 	() => void
	isUserSchoolWorker?: 	boolean
	isPublicSite?:          boolean
}

export class Challenges  extends React.Component<ChallengesProps, {}> {
	static defaultProps: Partial<ChallengesProps> = {
		isDaySelected: true,
		isPublicSite: false
	};

	getSizeModifierStyle (): string {
		switch (this.props.size) {
			case (CalendarSize as any).Small: {
				return ' mSmall';
			}
			case (CalendarSize as any).Medium: {
				return ' mMedium';
			}
			default: {
				return ''
			}
		}
	}

	_getEvents (): React.ReactNode {
		const 	isSync				= this.props.isSync,
				events				= this.props.events,
				isDaySelected		= this.props.isDaySelected,
				activeSchoolId		= this.props.activeSchoolId,
				activeSchoolKind	= this.props.activeSchoolKind,
				onEventClick		= this.props.onClick,
				onClickDeleteEvent	= this.props.onClickDeleteEvent,
				isUserSchoolWorker 	= this.props.isUserSchoolWorker,
				isPublicSite 	    = this.props.isPublicSite;

		switch (true) {
			/* when no day selected */
			case isDaySelected !== true:
				return <NoResultItem text="Please select day"/>;
			/* when data is still loading */
			case isSync !== true:
				return <NoResultItem text="Loading..."/>;
			/* when there are some events */
			case Array.isArray(events) && events.length > 0:		// actually it shouldn't be an array, but Immutable.List instead... but this is what we get from binding
				return events.map( event =>  {
					const	model = new ChallengeModel(event, activeSchoolId, activeSchoolKind, isPublicSite);
					return <ChallengeListItem
						key 				= { event.id }
						event 				= { event }
						model 				= { model }
						onClick 			= { onEventClick }
						onClickDeleteEvent 	= { onClickDeleteEvent }
						isUserSchoolWorker 	= { isUserSchoolWorker }
					/>;
				});
			default:
				return <NoResultItem text="There are no events for selected day"/>;
		}
	}

	render () {
		return (
			<div className={`eEvents_challenges mGeneral ${this.getSizeModifierStyle()}`}>
				<ChallengeListTitle/>
				{this._getEvents()}
			</div>
		);
	}
}