/**
 * Created by Anatoly on 17.03.2016.
 */
const   StatsView 			= require('module/shared_pages/student/statistic-view'),
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
		binding.set('achievements', null);

        if(!studentId) {
            document.location.hash = 'events/calendar/all';
        } else if(studentId && studentId !=='all') {
            StudentHelper.getStudentDataForPersonalStudentPage(studentId)
                .then(studentData => {
                    binding.set('achievements', Immutable.fromJS(studentData));
                });
        }
    },
    render: function () {
        const self = this,
            binding = self.getDefaultBinding();

        if(self.activeChildId !== binding.get('activeChildId')){
            self.reRender = true;
            self._updateViewOnActiveChildIdChange();
            self.activeChildId = binding.get('activeChildId');
        }

        return (
			<StatsView binding={binding} />
        )
    }
});
module.exports = AchievementOneChild;
