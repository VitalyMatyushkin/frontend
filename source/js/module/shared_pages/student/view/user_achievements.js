const React = require('react');
const Morearty = require('morearty');
const Immutable = require('immutable');

const {TeamSportAchievement} = require('module/shared_pages/student/view/achievements/team_sport_achievement');
const {IndividualSportAchievement} = require('module/shared_pages/student/view/achievements/individual_sport_achievement');

const SessionHelper	= require('module/helpers/session_helper');
const TeamHelper = require('module/ui/managers/helpers/team_helper');

const UserAchievements = React.createClass({
    mixins: [Morearty.Mixin],
    onClickChallenge: function (eventId) {
	    const self = this;
    	
    	//we must pass schoolId in hash because event-page component use schoolId from routing.parameters
    	const activeSchoolId = self.getDefaultBinding().toJS().schoolId;

		document.location.hash = 'event/' + eventId  + '?schoolId=' + activeSchoolId;
    },
    sameDay: function (d1, d2) {
        d1 = d1 instanceof Date ? d1 : new Date(d1);
        d2 = d2 instanceof Date ? d2 : new Date(d2);

        return d1.getUTCFullYear() === d2.getUTCFullYear() &&
            d1.getUTCMonth() === d2.getUTCMonth() &&
            d1.getUTCDate() === d2.getUTCDate();
    },
    getEvents: function (date, theData) {
	    const self = this;
	    const binding = self.getDefaultBinding();
		const rootBinding = self.getMoreartyContext().getBinding();

		const role = SessionHelper.getRoleFromSession(rootBinding.sub('userData'));
		const isParent = role === "PARENT";

		const activeSchoolId = isParent ? null : rootBinding.get('userRules.activeSchoolId');

		let eventsByDate;

        if (theData && theData.gamesScoredIn) {
            eventsByDate = theData.gamesScoredIn.filter(event => {
                return self.sameDay(
                    new Date(event.startTime),
                    new Date(date));
            });

            return eventsByDate.map((event, index) => {
                let achievement;

            	switch(true) {
		            case TeamHelper.isTeamSport(event) || TeamHelper.isOneOnOneSport(event) || TeamHelper.isTwoOnTwoSport(event): {
			            achievement = (
				            <TeamSportAchievement
					            key={index}
					            event={event}
					            activeSchoolId={activeSchoolId}
					            handleClick={this.onClickChallenge}
				            />
			            );
			            break;
		            }
		            case TeamHelper.isIndividualSport(event): {
			            achievement = (
				            <IndividualSportAchievement
					            key={index}
					            userId={binding.toJS('id')}
					            permissionId={binding.toJS('permissionId')}
					            event={event}
					            activeSchoolId={activeSchoolId}
					            handleClick={this.onClickChallenge}
				            />
			            );
			            break;
		            }
		            default: {
			            achievement = null;
			            break;
		            }
                }

                return achievement;
            });
        }
    },
    getDates: function (dataFrom) {
    	const self = this;
        let dates;

        if(dataFrom && dataFrom.gamesScoredIn){
            dates = dataFrom.gamesScoredIn.reduce((memo,val) => {
                let date = Date.parse(val.startTime);
                let any = memo.some(d => {
                	return self.sameDay(date, d);
                });

                if(!any){
                    memo = memo.push(date);
                }

                return memo;
            }, Immutable.List());

            return dates.count() !== 0 ? dates.sort().map((datetime, dateTimeIndex) => {
                const date = new Date(datetime);
                const monthNames = [ "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December" ];

                return <div key={dateTimeIndex} className="bAchievementsDate">
                    <div className="eAchievementsDate_date">
                        {date.getDate() + ' ' +
                        monthNames[date.getMonth()] + ' ' +
                        date.getFullYear()}
                    </div>
                    <div className="eChallengeDate_list">{self.getEvents(datetime, dataFrom)}</div>
                </div>;
            }).toArray() : <div>Student hasn't achieved a goal yet!</div>;
        }
    },
    render:function(){
    	const self = this;

        const binding = self.getDefaultBinding();
        const data = binding.toJS();
        console.log(data);
	    const teamStats = self.getDates(data);

        return <div>{teamStats}</div>;
    }
});

module.exports = UserAchievements;