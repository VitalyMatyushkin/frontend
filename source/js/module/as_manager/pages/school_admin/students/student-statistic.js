const   StatsView 			= require('module/shared_pages/student/statistic-view'),
		StudentHelper       = require('module/helpers/studentHelper'),
		React               = require('react'),
		Morearty            = require('morearty'),
		Immutable           = require('immutable');

const Loader = require('module/ui/loader');

const StudentStatistic = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	componentWillMount: function () {
		const 	binding         = this.getDefaultBinding(),
				globalBinding   = this.getMoreartyContext().getBinding();

		const   studentId   = globalBinding.get('routing.parameters.id'),
				schoolId    = globalBinding.get('userRules.activeSchoolId');

		if(!studentId) {
			document.location.hash = 'events/calendar';
		}
		binding.clear();

		binding.set('isSync', false);
		StudentHelper.getStudentDataForPersonalStudentPage(studentId, schoolId)
			.then(studentData => {
				studentData.numberOfGamesPlayed = studentData.schoolEvent.length;
				studentData.numOfGamesWon = studentData.gamesWon.length;
				studentData.numOfGamesScoredIn = studentData.gamesScoredIn.length;

				binding.set('achievements', Immutable.fromJS(studentData));
				binding.set('isSync', true);
			});
	},
	render: function () {
		const binding = this.getDefaultBinding();

		if(binding.toJS('isSync')) {
			return <StatsView binding={binding} activeSchoolId={this.props.activeSchoolId} type={'STUFF'}/>;
		} else {
			return (
				<div className='bLoaderWrapper'>
					<Loader condition={ true }/>
				</div>
			);
		}
	}
});
module.exports = StudentStatistic;
