/**
 * Created by bridark on 25/04/15.
 */
const 	React			= require('react'),
		EventRivals 	= require('./event-rivals'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable');

const UserAchievements = React.createClass({
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
		const binding = this.getDefaultBinding();
		const activeSchoolId = binding.get('schoolData.0.id');

		let eventsByDate;

		if (theData && theData.gamesScoredIn) {
			eventsByDate = theData.gamesScoredIn.filter(event => {
				return this.sameDay(
					new Date(event.startTime),
					new Date(date));
			});

			return eventsByDate.map((event, index) => {
				return (
					<div
						key={index}
						id={'challenge-' + event.id}
						className="bAchievement"
						onClick={() => {this.onClickChallenge(event.id)}}
					>
						<h4>{event.name}</h4>
						<h6>{`Scored: ${event.studentScore}`}</h6>
						<EventRivals event={event} activeSchoolId={activeSchoolId} />
						<br/>
					</div>
				);
			});
		}
	},

	/**
	 * Render a list of event (with score) grouped by date
	 */
	getDates: function (dataFrom) {
		let dates;

		if (typeof dataFrom !== 'undefined' && dataFrom.gamesScoredIn){
			//Get array of uniq dates events
			dates = dataFrom.gamesScoredIn.reduce((memo,val) => {
				let date = Date.parse(val.startTime);
				let any = memo.some(d => this.sameDay(date, d));

				if(!any) {
					memo = memo.push(date);
				}

				return memo;
			}, Immutable.List());

			return dates.count() !== 0 ? dates.sort().map((datetime, dateTimeIndex) => {
				let date = new Date(datetime);
				let	monthNames = [ "January", "February", "March", "April", "May", "June",
						"July", "August", "September", "October", "November", "December" ];

				return (
					<div key={dateTimeIndex} className="bAchievementsDate">
						<div className="eAchievementsDate_date">
							{
								date.getDate() + ' ' +
								monthNames[date.getMonth()] + ' ' +
								date.getFullYear()
							}
						</div>
						<div className="eChallengeDate_list">
							{this.getEvents(datetime,dataFrom)}
						</div>
					</div>
				);
			}).toArray() : <div>Student hasn't achieved a goal yet!</div>;
		}
	},

	render:function(){
		const binding = this.getDefaultBinding();
		const data = binding.toJS();
		const teamStats = this.getDates(data);

		return <div>{teamStats}</div>;
	}
});

module.exports = UserAchievements;