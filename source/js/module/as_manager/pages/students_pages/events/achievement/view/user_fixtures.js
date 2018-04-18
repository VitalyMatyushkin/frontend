/**
 * Created by bridark on 25/04/15.
 */

const	React			= require('react'),
		EventHelper		= require('module/helpers/eventHelper'),
		{GameType} 		= require('module/ui/challenges/event-game-type-with-score'),
		Sport 			= require('module/ui/icons/sport_icon'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable');

const UserFixtures = React.createClass({
	mixins:[Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string
	},
	/**
	 * Returns true, if dd-mm-yyyy d1 equal dd-mm-yyyy d2, else false
	 * @returns {Boolean}
	 */
	sameDay: function (d1, d2) {
		d1 = d1 instanceof Date ? d1 : new Date(d1);
		d2 = d2 instanceof Date ? d2 : new Date(d2);

		return d1.getUTCFullYear() === d2.getUTCFullYear() &&
			d1.getUTCMonth() === d2.getUTCMonth() &&
			d1.getUTCDate() === d2.getUTCDate();
	},

	onClickChallenge: function (eventId) {
		const	binding 		= this.getDefaultBinding(),
				activeSchoolId 	= binding.get('schoolData.0.id');

		document.location.hash = 'event/' + eventId  + '?schoolId=' + activeSchoolId;
	},

	/**
	 * Returns list of day events
	 */
	getEvents: function (date,theData) {
		const 	binding 		= this.getDefaultBinding(),
				activeSchoolId 	= binding.get('schoolData.0.id');

		let eventsByDate;
		if(theData && theData.schoolEvent) {
			eventsByDate = theData.schoolEvent.filter(event => {
				return this.sameDay(
					new Date(event.startTime),
					new Date(date));
			});
			return eventsByDate.map((event, index) => {
				const sportName = event.sport && event.sport.name;

				let comment;

				if(event.result && event.result.comment){
					comment = event.result.comment;
				} else {
					comment = "There are no comments on this fixture";
				}
				return <div key={index} className="bChallenge"
							onClick={() => {this.onClickChallenge(event.id)}}
							id={'challenge-' + event.id}
				>
					<div className="eChallenge_type">
						<Sport name={sportName} />
						<span>{sportName}</span>
					</div>
					<GameType event={event} activeSchoolId={activeSchoolId} />
					<div className="eChallenge_type">{event.name}</div>
					<div className="eChallenge_type">
						{EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType]}
					</div>
					{/*<div className="eChallenge_com_container">
					 <div className="eChallenge_comments">
					 {comment}
					 </div>
					 </div>*/}
				</div>;

			});
		}
	},
	/**
	 * Render a list of finished event grouped by date
	 */
	getDates: function (dataFrom) {
		let dates;

		if(typeof dataFrom !== 'undefined' && dataFrom.schoolEvent){
			//Get array of uniq dates events
			dates = dataFrom.schoolEvent.reduce((memo,val) => {
				let date = Date.parse(val.startTime),
					any = memo.some(d => {
						return this.sameDay(date,d);
					});
				if(!any){
					memo = memo.push(date);
				}
				return memo;
			}, Immutable.List());

			return dates.count()!==0 ? dates.sort().map((datetime, dateTimeIndex) => {
					let date = new Date(datetime),
						monthNames = [ "January", "February", "March", "April", "May", "June",
							"July", "August", "September", "October", "November", "December" ],
						dayOfWeek = date.getDay();
					return <div key={dateTimeIndex} className="bChallengeDate">
						<div className="eAchievements_wrap">
							<div className="eChallengeDate_date">
								{date.getDate() + ' ' +
								monthNames[date.getMonth()] + ' ' +
								date.getFullYear()}
							</div>
							<div className="eChallengeDate_list">{this.getEvents(datetime, dataFrom)}</div>
						</div>
					</div>;
				}).toArray() : null;
		}
	},
	render: function () {
		const 	binding 	= this.getDefaultBinding(),
				data 		= binding.toJS(),
				challenges 	= this.getDates(data);

		return (
			<div>
				<div className="bChallenges">{challenges}</div>
			</div>
			)
	}
});
module.exports = UserFixtures;