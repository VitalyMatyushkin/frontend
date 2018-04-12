/**
 * Created by wert on 06.09.16.
 */

const 	React				= require('react'),
		ChallengeModel		= require('./challenge_model'),
		ChallengeListTitle	= require('./challenge_list_title'),
		ChallengeListItem	= require('./challenge_list_item'),
		NoResultItem		= require('./no_result_item')

import {CalendarSize} from 'module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard_calendar_widget/dashboard_calendar_widget.tsx';

const Challenges = React.createClass({
	propTypes: {
		size:                   React.PropTypes.number,
		onClick:				React.PropTypes.func,
		isSync:					React.PropTypes.bool,
		isDaySelected:			React.PropTypes.bool,
		activeSchoolId:			React.PropTypes.string,
		activeSchoolKind:		React.PropTypes.string,
		events:					React.PropTypes.any,
		onClickDeleteEvent: 	React.PropTypes.func,
		isUserSchoolWorker: 	React.PropTypes.bool,
		isPublicSite:           React.PropTypes.bool
	},
	getDefaultProps: function () {
		return {
			isDaySelected: true,
			isPublicSite: false
		};
	},

	getSizeModifierStyle() {
		switch (this.props.size) {
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

	_getEvents: function () {
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
	},

	render: function() {
		return (
			<div className={`eEvents_challenges mGeneral ${this.getSizeModifierStyle()}`}>
				<ChallengeListTitle/>
				{this._getEvents()}
			</div>
		);
	}
});


module.exports = Challenges;