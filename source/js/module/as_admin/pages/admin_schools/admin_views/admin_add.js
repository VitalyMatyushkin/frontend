/**
 * Created by bridark on 09/06/15.
 */
const 	SchoolForm 	= require('module/as_manager/pages/schools/schools_form'),
		React 		= require('react'),
		Morearty 	= require('morearty');

const schoolFormStyles = require('styles/pages/schools/b_school_add.scss');

const AddSchoolForm = React.createClass({
	mixins: [Morearty.Mixin],
	submitAdd: function(schoolData) {
		window.Server.schools.post(schoolData).then(() => {
			document.location.hash = 'schools/admin_views/list';
		});
	},
	render: function() {

		return (
			<div className = "bSchoolAdd">
				<SchoolForm
					title 			= "Add new school..."
					onSubmit 		= { this.submitAdd }
					binding 		= { this.getDefaultBinding() }
					isSuperAdmin 	= { true }
				/>
			</div>
		)
	}
});


module.exports = AddSchoolForm;
