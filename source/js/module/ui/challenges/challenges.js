/**
 * Created by wert on 06.09.16.
 */

const 	React				= require('react'),
		ChallengeModel		= require('./challenge_model'),
		ChallengeListTitle	= require('./challenge_list_title'),
		ChallengeListItem	= require('./challenge_list_item'),
		NoResultItem		= require('./no_result_item');

const Challenges = React.createClass({
	propTypes: {
		onClick:				React.PropTypes.func,
		isSync:					React.PropTypes.bool,
		isDaySelected:			React.PropTypes.bool,
		activeSchoolId:			React.PropTypes.string,
		events:					React.PropTypes.any,
		onClickDeleteEvent: 	React.PropTypes.func,
		isUserSchoolWorker: 	React.PropTypes.bool
	},
	getDefaultProps: function () {
		return {
			isDaySelected: true
		};
	},
	_getEvents: function () {
		const 	isSync				= this.props.isSync,
				events				= this.props.events,
				isDaySelected		= this.props.isDaySelected,
				activeSchoolId		= this.props.activeSchoolId,
				onEventClick		= this.props.onClick,
				onClickDeleteEvent	= this.props.onClickDeleteEvent,
				isUserSchoolWorker 	= this.props.isUserSchoolWorker;

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
					const	model = new ChallengeModel(event, activeSchoolId);
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
			<div className="eEvents_challenges mGeneral">
				<ChallengeListTitle/>
				{this._getEvents()}
			</div>
		);
	}
});


module.exports = Challenges;