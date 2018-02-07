import * as StudentHelper from "../../../../helpers/studentHelper";
import * as Loader from 'module/ui/loader';

const React = require('react');
const Morearty = require('morearty');
const Immutable = require('immutable');


const {AchievementOneChild} = require('module/as_manager/pages/parents_pages/events/achievement/achievement_one_child');

const StudentStatistic = React.createClass({
    mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
    componentWillMount: function () {
        const 	binding         = this.getDefaultBinding(),
                globalBinding   = this.getMoreartyContext().getBinding();

        this.studentId = globalBinding.get('routing.parameters.id');
        if(!this.studentId) {
            document.location.hash = 'events/calendar';
        }
	    binding.clear();

	    StudentHelper._getStudent(this.studentId, this.props.activeSchoolId)
		    .then(studentProfile => binding.set('studentProfile', Immutable.fromJS(studentProfile)));
    },
    render: function () {
        const binding = this.getDefaultBinding();

	    const studentProfile = binding.toJS('studentProfile');
	    if(typeof studentProfile !== 'undefined') {
	    	console.log(studentProfile);
		    return (
			    <AchievementOneChild
				    schoolId={this.props.activeSchoolId}
				    activeChildId={this.studentId}
				    children={[studentProfile]}
				    binding={binding.sub('studentAchievements')}
				    type={'STUFF'}
			    />
		    );
	    } else {
		    return (
		    	<div className="eAchievementMessage">
			        <Loader condition={true}/>
		        </div>
		    );
	    }
    }
});

module.exports = StudentStatistic;