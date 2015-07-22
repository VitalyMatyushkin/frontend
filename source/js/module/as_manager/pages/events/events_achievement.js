/**
 * Created by bright boahen on 02/06/15.
 */
var ParentChildAchievement,
    SVG = require('module/ui/svg'),
    AboutMe = require('module/as_manager/pages/student/view/about_me'),
    UserButtons = require('module/as_manager/pages/student/view/user_buttons'),
    UserName = require('module/as_manager/pages/student/view/user_name'),
    UserPhoto = require('module/as_manager/pages/student/view/user_photo'),
    UserAchievements = require("module/as_manager/pages/student/view/user_achievements"),
    UserFixtures = require('module/as_manager/pages/student/view/user_fixtures'),
    TeamStats = require('module/as_manager/pages/student/view/team_stats'),
    IndicatorView = require('module/ui/progress_indicator/loading_prompt'),
    progressValue;

ParentChildAchievement = React.createClass({
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
            studentId,
            leanerData = {};
        studentId = studentId ? studentId : binding.get('activeChildId');
        progressValue = studentId;
        if(!studentId)document.location.hash = 'events/calendar';
        studentId && window.Server.student.get({studentId:studentId,
            filter:{
                include:['form','house','school','parents']
            }
        }).then(function (data) {
            leanerData = data;
            Server.form.get(data.formId).then(function (classData) {
                leanerData.classData = classData;
                Server.house.get(data.houseId).then(function (houseData) {
                    leanerData.houseData = houseData;
                    Server.school.get(data.schoolId).then(function (schoolData) {
                        leanerData.schoolData = schoolData;
                        Server.studentGamesWon.get({
                            id: studentId,
                            include: JSON.stringify([{"invites": ["inviter", "guest"]}, {"participants": ["players", "house", "school"]}, {"result": "points"}])
                        }).then(function (gamesWon) {
                            leanerData.gamesWon = gamesWon;
                            self.numOfGamesWon = gamesWon.length;
                            leanerData.numOfGamesWon = gamesWon.length;
                            Server.studentGamesScored.get({
                                id: studentId,
                                include: JSON.stringify([{"invites": ["inviter", "guest"]}, {"participants": ["players", "house", "school"]}, {"result": "points"}])
                            }).then(function (gamesScoredIn) {
                                leanerData.gamesScoredIn = gamesScoredIn;
                                self.numOfGamesScoredIn = gamesScoredIn.length;
                                leanerData.numOfGamesScoredIn = gamesScoredIn.length;
                                Server.studentEvents.get({id: studentId}).then(function (gamesPlayed) {
                                    leanerData.numberOfGamesPlayed = gamesPlayed.length;
                                    self.numberOfGamesPlayed = gamesPlayed.length;
                                    leanerData.schoolEvent = gamesPlayed;
                                    binding.set('achievements', Immutable.fromJS(leanerData));
                                });
                            });
                        })
                    });
                });
            });
        });
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
                            <IndicatorView reDraw={self.reRender} binding={binding.sub('achievements')}></IndicatorView>
                        </div>
                        <div className="bUserFullInfo mDates">
                            <div className="eUserFullInfo_block">
                                <h1>Personal Achievements: {binding.get('achievements.numOfGamesScoredIn')}</h1>
                                <UserAchievements binding={binding.sub('achievements')}/>
                            </div>
                        </div>
                        <div className="bUserFullInfo mDates">
                            <div className="eUserFullInfo_block">
                                <h1>Team Statistics(Games Won): {self.numOfGamesWon}</h1>
                                <TeamStats binding={binding.sub('achievements')}/>
                            </div>
                        </div>
                        <h1>All Fixtures: {self.numberOfGamesPlayed}</h1>
                        <UserFixtures binding={binding.sub('achievements')}/>
                    </div>
                </div>
            </div>
        )
    }
});
module.exports = ParentChildAchievement;
