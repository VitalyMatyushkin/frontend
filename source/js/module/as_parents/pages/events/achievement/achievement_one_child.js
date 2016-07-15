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
        StudentHelper       = require('module/helpers/studentHelper'),
        Morearty            = require('morearty'),
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
        const   self    = this,
                binding = self.getDefaultBinding();

        const studentId = binding.get('activeChildId');

        if(!studentId) {
            document.location.hash = 'events/calendar/all';
        } else if(studentId && studentId !=='all') {
            StudentHelper.getStudentDataForPersonalStudentPage(studentId)
                .then(studentData => {
                    self.numberOfGamesPlayed = studentData.schoolEvent.length;
                    self.numOfGamesWon = studentData.gamesWon.length;
                    self.numOfGamesScoredIn = studentData.gamesScoredIn.length;

                    binding.set('achievements', Immutable.fromJS(studentData));
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
