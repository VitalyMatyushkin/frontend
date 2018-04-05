const 	RouterView 				= require('module/core/router'),
		React 					= require('react'),
		Morearty				= require('morearty'),
		Route 					= require('module/core/route'),
		{RegionHelper} 	        = require('module/helpers/region_helper'),
		StudentsListComponent 	= require("module/as_manager/pages/school_admin/students/list/student-list"),
		StudentsAddComponent 	= require("module/as_manager/pages/school_admin/students/student_add"),
		StudentsEditComponent 	= require("module/as_manager/pages/school_admin/students/student_edit"),
		StudentsMergeComponent 	= require("module/as_manager/pages/school_admin/students/student_with_permission_merge"),
		StudentStatsComponent 	= require('module/as_manager/pages/school_admin/students/student-statistic');


const StudentPage = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	//The function, which will call when user click on <Row> in Grid
	handleClick: function(studentId) {
		document.location.hash = 'school_admin/students/stats?id=' + studentId;
	},
	render: function() {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				region          = RegionHelper.getRegion(globalBinding);

		return (
			<RouterView routes={ binding.sub('studentsRouting') } binding={globalBinding}>
				<Route
					path		="/school_admin/students"
					binding		={ binding.sub('studentsList') }
					component	={ StudentsListComponent }
					handleClick	={ this.handleClick }
					region      ={region}
				/>
				<Route
					path		="/school_admin/students/add"
					binding		={ binding.sub('studentAdd') }
					component	={ StudentsAddComponent }
					region      ={region}
				/>
				<Route
					path		="/school_admin/students/edit"
					binding		={ binding.sub('studentEdit') }
					component	={ StudentsEditComponent }
					region      ={region}
				/>
				<Route
					path="/school_admin/students/merge"
					binding={binding.sub('studentMerge')}
					component={StudentsMergeComponent}
				/>
				<Route
					path="/school_admin/students/stats"
					binding={binding.sub('studentStats')}
					component={StudentStatsComponent}
					activeSchoolId={this.props.activeSchoolId}
				/>
			</RouterView>
		)
	}
});


module.exports = StudentPage;
