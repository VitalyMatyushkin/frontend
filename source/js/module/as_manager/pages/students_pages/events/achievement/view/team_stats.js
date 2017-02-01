/**
 * Created by bridark on 03/05/15.
 */
const 	React			= require('react'),
		EventRivals		= require('./event-rivals'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable');


const TeamStats = React.createClass({
	mixins: [Morearty.Mixin],

	onClickChallenge: function (eventId) {
		const	binding 		= this.getDefaultBinding(),
				activeSchoolId 	= binding.get('schoolData.0.id');

		document.location.hash = 'event/' + eventId  + '?schoolId=' + activeSchoolId;
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
	/**
	 * Returns list of day events
	 */
	getEvents: function (date, theData) {
		const 	binding 		= this.getDefaultBinding(),
				activeSchoolId 	= binding.get('schoolData.0.id');

		let eventsByDate;

		if (theData && theData.gamesWon) {
			eventsByDate = theData.gamesWon.filter(event => {
				return this.sameDay(
					new Date(event.startTime),
					new Date(date));
			});
			return eventsByDate.map((event, index) => {
				let comment;
				if(event.result && event.result.comment){
					comment = event.result.comment;
				} else {
					comment = "There are no comments on this fixture";
				}

				return <div key={index} className="bAchievement"
							onClick={() => {this.onClickChallenge(event.id)}}
							id={'challenge-' + event.id}
				>
					<h4>{event.name}</h4>
					<EventRivals event={event} activeSchoolId={activeSchoolId} />
					{/*<div className="eAchievement_com_container">
					 <div className="eChallenge_comments">
					 {comment}
					 </div>
					 </div>*/}
				</div>;

			});
		}
	},
	/**
	 * Render a list of won event grouped by date
	 */
	getDates: function (dataFrom) {
		let dates;

		if(typeof dataFrom !== 'undefined' && dataFrom.gamesWon){
			//Get array of uniq dates events
			dates = dataFrom.gamesWon.reduce((memo,val) => {
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
							"July", "August", "September", "October", "November", "December" ];
					return <div key={dateTimeIndex} className="bAchievementsDate">
						<div className="eAchievementsDate_date">
							{date.getDate() + ' ' +
							monthNames[date.getMonth()] + ' ' +
							date.getFullYear()}
						</div>
						<div className="eChallengeDate_list">{this.getEvents(datetime,dataFrom)}</div>
					</div>;
				}).toArray() : (<div>Looks like the team is having a bad run</div>);
		}
	},

	render:function(){
		const 	binding 	= this.getDefaultBinding(),
				data 		= binding.toJS(),
				teamStats 	= this.getDates(data);

		return (<div>{teamStats}</div>)
	}
});
module.exports = TeamStats;