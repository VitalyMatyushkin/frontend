/**
 * Created by Anatoly on 17.03.2016.
 */
const   AboutMe             = require('module/as_manager/pages/student/view/about_me'),
        UserName            = require('module/as_manager/pages/student/view/user_name'),
        UserAchievements    = require("module/as_manager/pages/student/view/user_achievements"),
        UserFixtures        = require('module/as_manager/pages/student/view/user_fixtures'),
        TeamStats           = require('module/as_manager/pages/student/view/team_stats'),
        IndicatorView       = require('module/ui/progress_indicator/loading_prompt'),
        React               = require('react'),
        If                  = require('module/ui/if/if'),
        EventHelper         = require('module/helpers/eventHelper'),
        Lazy                = require('lazyjs'),
        Immutable           = require('immutable');

const AchievementOneChild = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        self.activeChildId = binding.get('activeChildId');
        self._updateViewOnActiveChildIdChange();
    },
    _updateViewOnActiveChildIdChange:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            studentId = binding.get('activeChildId'),
            leanerData = {};
        if(studentId === undefined)document.location.hash = 'events/calendar/all';
        if(studentId && studentId !=='all'){
            return window.Server.userChild.get({childId: studentId}).then(child => {
                leanerData = child;
                return window.Server.schoolForm.get({schoolId: child.schoolId, formId: child.formId});
            })
            .then(classData => {
                leanerData.classData = classData;
                return window.Server.schoolHouse.get({schoolId: leanerData.schoolId, houseId: leanerData.houseId});
            })
            .then(houseData => {
                leanerData.houseData = houseData;
                return window.Server.school.get({schoolId: leanerData.schoolId});
            })
            .then(schoolData => {
                leanerData.schoolData = schoolData;
                return window.Server.parentsChild.get({childId: leanerData.id});
            })
            .then(parents => {
                leanerData.parents = parents;
                return self._getWinChildEvents(leanerData.id);
            })
            .then(events => {
                leanerData.schoolEvent = events;
                leanerData.numberOfGamesPlayed = events.length;
                self.numberOfGamesPlayed = events.length;

                leanerData.gamesWon = self._getWinGames(leanerData.id, events);
                leanerData.numOfGamesWon = leanerData.gamesWon.length;
                self.numOfGamesWon = leanerData.gamesWon.length;

                leanerData.gamesScoredIn = self._getScoredInEvents(leanerData.id, events);
                leanerData.numOfGamesScoredIn = leanerData.gamesScoredIn.length;
                self.numOfGamesScoredIn = leanerData.gamesScoredIn.length;

                binding.atomically().set('achievements', Immutable.fromJS(leanerData)).commit();
            });
        }
    },
    _getScoredInEvents: function(childId, events) {
        const self = this;

        return events.filter(event => {
            return self._isChildGetScores(childId, event);
        });
    },
    _isChildGetScores: function(childId, event) {
        return event.result && event.result.points[childId] ? true : false;
    },
    _isChildFromCurentTeam: function(childId, team) {
        return Lazy(team.players).findWhere({userId:childId}) ? true : false;
    },
    _isChildTeamWin: function(childId, event) {
        const self = this;

        let isChildTeamWin = false;

        if(event.status === EventHelper.EVENT_STATUS.FINISHED && event.result) {
            const winnerId = EventHelper.getWinnerId(event.result);
            winnerId && (isChildTeamWin = self._isChildFromCurentTeam(
                childId,
                Lazy(event.participants).findWhere({id: winnerId})
            ));
        }

        return isChildTeamWin;
    },
    _getWinGames: function(childId, events) {
        const self = this;

        return events.filter(event => {
            return self._isChildTeamWin(childId, event);
        });
    },
    _getTeam: function(schoolId, teamId) {
        let team;

        return window.Server.team.get({schoolId: schoolId, teamId: teamId})
            .then(_team => {
                team = _team;

                return window.Server.publicSchool.get({schoolId: team.schoolId});
            })
            .then(school => {
                team.school = school;

                if(team.houseId) {
                    return window.Server.publicSchoolHouse.get({schoolId: team.schoolId, houseId: team.houseId})
                        .then(house => {
                            team.house = house;

                            return team;
                        });
                } else {
                    return team;
                }
            });
    },
    _getWinChildEvents: function(childId) {
        const self = this;

        return window.Server.userChildEvents.get({childId: childId})
            .then(events => Promise.all(events.map(event =>
                window.Server.sport.get({sportId:event.sportId}).then(sport => {
                    event.sport = sport;

                    return event;
                })
            )))
            .then(events => {
                return Promise.all(events.map(event => {
                    return Promise.all(event.teams.map(teamId => {
                            return self._getTeam(event.inviterSchoolId, teamId);
                        }))
                        .then(teams => {
                            event.participants = teams;

                            return event;
                        });
                }))
            })
    },
    render: function () {
        var self = this,
            binding = self.getDefaultBinding();
        if(self.activeChildId !== binding.get('activeChildId')){
            self.reRender = true;
            self._updateViewOnActiveChildIdChange();
            self.activeChildId = binding.get('activeChildId');
        }
        return (
            <div>
                <div className="bUserColumn bParentViewColumn">
                    <div className="eUserColumnData">
                        <UserName binding={binding.sub('achievements')}/>
                        <AboutMe title="About me" binding={binding.sub('achievements')}/>
                    </div>
                </div>
                <div className="bUserDataColumn bParentView">
                    <div className="eUserDataColumn_wrap" id="jsSubPage">
                        <div id="progressBarDiv" className="bUserFullInfo mDates">
                            <IndicatorView reDraw={self.reRender} binding={binding.sub('achievements')}/>
                        </div>
                        <div className="bUserFullInfo mDates">
                            <div className="eUserFullInfo_block">
                                <h3>Personal Achievements: {binding.get('achievements.numOfGamesScoredIn')}</h3>
                                <UserAchievements binding={binding.sub('achievements')}/>
                            </div>
                        </div>
                        <div className="bUserFullInfo mDates">
                            <div className="eUserFullInfo_block">
                                <h3>Team Statistics(Games Won): {self.numOfGamesWon}</h3>
                                <TeamStats binding={binding.sub('achievements')}/>
                            </div>
                        </div>
                        <h3>All Fixtures: {self.numberOfGamesPlayed}</h3>
                        <UserFixtures binding={binding.sub('achievements')}/>
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = AchievementOneChild;
