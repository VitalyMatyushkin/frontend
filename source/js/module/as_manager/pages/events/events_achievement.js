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
    If = require('module/ui/if/if'),
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
        console.log(studentId);
        if(studentId === undefined)document.location.hash = 'events/calendar';
        if(studentId && studentId !=='all'){
            console.log('entered');
            console.log(studentId);
            return window.Server.student.get({studentId:studentId,
                filter:{
                    include:['form','house','school','parents']
                }
            }).then(function (data) {
                leanerData = data;
                return Server.form.get(data.formId).then(function (classData) {
                    leanerData.classData = classData;
                    return Server.house.get(data.houseId).then(function (houseData) {
                        leanerData.houseData = houseData;
                        return Server.school.get(data.schoolId).then(function (schoolData) {
                            leanerData.schoolData = schoolData;
                            return Server.studentGamesWon.get({
                                id: studentId,
                                include: JSON.stringify([{"invites": ["inviter", "guest"]}, {"participants": ["players", "house", "school"]}, {"result": "points"}])
                            }).then(function (gamesWon) {
                                leanerData.gamesWon = gamesWon;
                                self.numOfGamesWon = gamesWon.length;
                                leanerData.numOfGamesWon = gamesWon.length;
                                return Server.studentGamesScored.get({
                                    id: studentId,
                                    include: JSON.stringify([{"invites": ["inviter", "guest"]}, {"participants": ["players", "house", "school"]}, {"result": "points"}])
                                }).then(function (gamesScoredIn) {
                                    leanerData.gamesScoredIn = gamesScoredIn;
                                    self.numOfGamesScoredIn = gamesScoredIn.length;
                                    leanerData.numOfGamesScoredIn = gamesScoredIn.length;
                                    return Server.studentEvents.get({id: studentId}).then(function (gamesPlayed) {
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
    renderAllAchievements:function(){
       var self = this,
           binding = self.getDefaultBinding();
        return binding.get('eventChild') && binding.get('eventChild').count() ? binding.get('eventChild').map(function (child) {
            return(
                <div className="eAchievement_row">
                    <div className="eAchievement_common eAchievement_name">{child.get('firstName')+' '+child.get('lastName')}</div>
                    <div className="eAchievement_common eAchievementGamesPlayed">{'not set'}</div>
                    <div className="eAchievement_common eAchievementGamesWon">{'not set'}</div>
                    <div className="eAchievement_common eAchievementGamesLost">{'not set'}</div>
                    <div className="eAchievement_common eAchievementGoalsScored">{'not set'}</div>
                </div>
            )
        }).toArray() :<div className="eAchievement_row">{'nothing'}</div>;
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
                <If condition={binding.get('activeChildId')!=='all'}>
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
                </If>
                <If condition={binding.get('activeChildId') === 'all'}>
                    <div className="eAllAchievements_container">
                        <div className="eAchievement_header">
                            <div className="eAchievement_common eAchievement_name">Child Name</div>
                            <div className="eAchievement_common eAchievementGamesPlayed">Games Played</div>
                            <div className="eAchievement_common eAchievementGamesWon">Games Won</div>
                            <div className="eAchievement_common eAchievementGamesLost">Games Lost</div>
                            <div className="eAchievement_common eAchievementGoalsScored">Goals Scored</div>
                        </div>
                        {self.renderAllAchievements()}
                    </div>
                </If>
            </div>
        )
    }
});
module.exports = ParentChildAchievement;
