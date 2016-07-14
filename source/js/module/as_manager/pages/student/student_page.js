const   AboutMe             = require('module/as_manager/pages/student/view/about_me'),
		UserName            = require('module/as_manager/pages/student/view/user_name'),
		UserAchievements    = require("module/as_manager/pages/student/view/user_achievements"),
		UserFixtures        = require('module/as_manager/pages/student/view/user_fixtures'),
        React               = require('react'),
		TeamStats           = require('module/as_manager/pages/student/view/team_stats'),
        StudentHelper       = require('module/helpers/studentHelper'),
        Morearty            = require('morearty'),
        Immutable           = require('immutable');

const LeanerView = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function () {
        const   self            = this,
                binding         = self.getDefaultBinding(),
                globalBinding   = self.getMoreartyContext().getBinding();

        const   studentId   = globalBinding.get('routing.parameters.id'),
                schoolId    = globalBinding.get('userRules.activeSchoolId');

        if(!studentId) {
            document.location.hash = 'events/calendar';
        }

        StudentHelper.getStudentDataForPersonalStudentPage(studentId, schoolId)
            .then(studentData => {
                self.numberOfGamesPlayed = studentData.schoolEvent.length;
                self.numOfGamesWon = studentData.gamesWon.length;
                self.numOfGamesScoredIn = studentData.gamesScoredIn.length;

                binding.set('achievements', Immutable.fromJS(studentData));
            });
    },
    componentWillUnmount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.clear('achievements');
    },
    render: function () {
        var self = this,
            binding = self.getDefaultBinding();
        return (
            <div>
                <div className="bUserColumn">
                    <div className="eUserColumnData">
                        <UserName binding={binding.sub('achievements')}/>
                        <AboutMe title="About me" binding={binding.sub('achievements')}/>
                    </div>
                </div>
                <div className="bUserDataColumn">
                    <div className="eUserDataColumn_wrap" id="jsSubPage">
                        <div className="bUserFullInfo mDates">
                            <div className="eUserFullInfo_block">
                                <h1>Personal Achievements: {self.numOfGamesScoredIn}</h1>
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
module.exports = LeanerView;
