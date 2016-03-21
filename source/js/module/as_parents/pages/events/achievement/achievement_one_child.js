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
            return window.Server.student.get({studentId:studentId,
                filter:{
                    include:['form','house','school','parents']
                }
            }).then(function (data) {
                leanerData = data;
                return window.Server.form.get(data.formId).then(function (classData) {
                    leanerData.classData = classData;
                    return window.Server.house.get(data.houseId).then(function (houseData) {
                        leanerData.houseData = houseData;
                        return window.Server.school.get(data.schoolId).then(function (schoolData) {
                            leanerData.schoolData = schoolData;
                            return window.Server.studentGamesWon.get({
                                id: studentId,
                                include: JSON.stringify([{"invites": ["inviter", "guest"]}, {"participants": ["players", "house", "school"]}, {"result": "points"}])
                            }).then(function (gamesWon) {
                                leanerData.gamesWon = gamesWon;
                                self.numOfGamesWon = gamesWon.length;
                                leanerData.numOfGamesWon = gamesWon.length;
                                return window.Server.studentGamesScored.get({
                                    id: studentId,
                                    include: JSON.stringify([{"invites": ["inviter", "guest"]}, {"participants": ["players", "house", "school"]}, {"result": "points"}])
                                }).then(function (gamesScoredIn) {
                                    leanerData.gamesScoredIn = gamesScoredIn;
                                    self.numOfGamesScoredIn = gamesScoredIn.length;
                                    leanerData.numOfGamesScoredIn = gamesScoredIn.length;
                                    return window.Server.studentEvents.get({id: studentId}).then(function (gamesPlayed) {
                                        leanerData.numberOfGamesPlayed = gamesPlayed.length;
                                        self.numberOfGamesPlayed = gamesPlayed.length;
                                        leanerData.schoolEvent = gamesPlayed;
                                        binding.atomically().set('achievements', Immutable.fromJS(leanerData)).commit();
                                    });
                                });
                            })
                        });
                    });
                });
            });
        }
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
