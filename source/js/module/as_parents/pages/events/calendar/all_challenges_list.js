/**
 * Created by Bright on 15/12/2015.
 */
const   React           = require('react'),
        InvitesMixin    = require('module/as_manager/pages/invites/mixins/invites_mixin'),
        Sport           = require('module/ui/icons/sport_icon'),

AllChallengesList = React.createClass({
    mixins:[Morearty.Mixin,InvitesMixin],
    getRivalName: function(event, order) {
        var self = this,
            binding = self.getDefaultBinding(),
            eventIndex = binding.get('models').findIndex(function (model) {
                return model.get('id') === event.get('id');
            }),
            eventBinding = binding.sub(['models', eventIndex]),
            type = event.get('type'),
            played = !!event.get('resultId'),
            rivalName = null,
            participantBinding = eventBinding.sub(['participants', order]),
            eventResult = played ? eventBinding.toJS('result.summary.byTeams') : null;


        if (type === 'internal') {
            rivalName = eventBinding.get(['participants', order, 'name']);
            if (played && rivalName && eventResult) {
                rivalName += '[' + eventResult[participantBinding.get('id')] + ']';
            }
        } else if (type === 'houses') {
            rivalName = eventBinding.get(['participants', order, 'house', 'name']);
            if (played && rivalName && eventResult) {
                rivalName += '[' + eventResult[participantBinding.get('id')] + ']';
            }
        } else {
            rivalName = eventBinding.get(['participants', order, 'school', 'name']);

            if (played && rivalName && eventResult) {
                rivalName += '[' + eventResult[participantBinding.get('id')] + ']';
            } else if (!rivalName) {
                rivalName = eventBinding.get(['invites', 0, 'guest', 'name']);
            }
        }

        return rivalName;
    },
    getSportIcon:function(sport){
        return <Sport name={sport} className="bIcon_invites" ></Sport>;
    },
    getEvents: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            currentDate = binding.get('calendar.currentDate'),
            sync = binding.get('sync'),
            childrenOfUser = binding.get('eventChild'),
            events = binding.get('models').filter(function (event) {
                var eventDate = new Date(event.get('startTime'));
                return eventDate.getMonth() === currentDate.getMonth() &&
                    eventDate.getFullYear() === currentDate.getFullYear();
            });
        //Iterate over the children present in the bag
        return (childrenOfUser && childrenOfUser.count())? childrenOfUser.map(function(child, childInd){
            child.event = events.filter(function(ev){
                return ev.get('childId') === child.get('childId');
            });
            var childFixtures = child.event.count() ? child.event.map(function(childEv, childEvInd){
                var eventDate = new Date(childEv.get('startTime')),
                    hoverDay = binding.get('calendar.hoverDay') && binding.get('calendar.hoverDay').date,
                    stringDate = self.formatDate(childEv.get('startTime')),
                    sport = self.getSportIcon(childEv.get('sport').get('name')),
                    isHoveredDay =  hoverDay &&
                        hoverDay.getMonth() === eventDate.getMonth() &&
                        hoverDay.getDate() === eventDate.getDate();
                return(
                    <div key={childEvInd} className={isHoveredDay?'eChallenge eChallenge_basicMod mActive':'eChallenge eChallenge_basicMod'}>
                        <span className="eChallenge_sport">{sport}</span>
                        <span className="eChallenge_date">{stringDate}</span>
                        <div className="eChallenge_name">{childEv.get('name')}</div>
                    </div>
                );
            }).toArray() : null;
            if(!childFixtures)
                return null;
            else
                return (
                    <div key={childInd} className= "eChallenge eChallenge_all">
                        <div className="eChildFixturesAll"> {childFixtures}</div>
                        <div className="eChallenge_childName">{child.get('firstName')+' '+child.get('lastName')}</div>
                    </div>
                );
        }).toArray():<div className="eChallenge mNotFound">{sync ? "You haven't events on this month." : "Loading..."}</div>;
    },
    render: function() {
        var self = this,
            binding = this.getDefaultBinding();
        return <div className="eEvents_challenges">
            <div className="eChallenge_title">
                <div className="eChildFixturesAll">
                    <span className="eChallenge_sport">Sport</span>
                    <span className="eChallenge_date">Date</span>
                    <span className="eChallenge_name">Event Name</span>
                </div>
                    <span className="eChallenge_childName">Name</span>
            </div>
            {self.getEvents()}
        </div>
    }
});
module.exports = AllChallengesList;