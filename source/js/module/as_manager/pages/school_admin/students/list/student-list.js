/**
 * Created by Anatoly on 11.08.2016.
 */
const   React 				= require('react'),
		Morearty			= require('morearty'),
		StudentListModel  	= require('./student-list-model'),
		Grid 				= require('module/ui/grid/grid'),
		schoolHelper 		= require('module/helpers/school_helper'),
		schoolConsts 		= require('module/helpers/consts/schools');

const StudentList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const
			self = this,
			binding = this.getDefaultBinding();

		schoolHelper.loadActiveSchoolInfo(this).then(data => {
			binding.set('schoolSubscriptionPlan', data.subscriptionPlan);
			self.model = new StudentListModel(this).init();
		});
	},
	render: function () {
		const
			binding = this.getDefaultBinding(),
			subscriptionPlan = binding.get('schoolSubscriptionPlan');

		if(subscriptionPlan === schoolConsts.SCHOOL_SUBSCRIPTION_PLAN.FULL){
			return (
				<Grid model={this.model.grid}/>
			);
		}

		if(subscriptionPlan === schoolConsts.SCHOOL_SUBSCRIPTION_PLAN.LITE){
			window.simpleAlert(
				'For your subscription level, this action is not available. For adding students go to the full version.',
				'Ok',
				() => {}
			)
		}


		return null;
	}
});

module.exports = StudentList;