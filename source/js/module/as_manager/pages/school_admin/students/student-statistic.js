const   StatsView 			= require('module/shared_pages/student/statistic-view'),
        StudentHelper       = require('module/helpers/studentHelper'),
		React               = require('react'),
        Morearty            = require('morearty'),
        Immutable           = require('immutable');

const StudentStatistic = React.createClass({
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
				studentData.numberOfGamesPlayed = studentData.schoolEvent.length;
				studentData.numOfGamesWon = studentData.gamesWon.length;
				studentData.numOfGamesScoredIn = studentData.gamesScoredIn.length;

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
            <StatsView binding={binding} />
        )
    }
});
module.exports = StudentStatistic;
