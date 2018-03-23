const 	SchoolForm 		= require('module/as_manager/pages/schools/schools_form'),
		React 			= require('react'),
		Morearty 		= require('morearty'),
		Immutable 		= require('immutable'),
		SchoolHelper 	= require('./../../../helpers/school_helper');

const EditSchoolForm = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				schoolId 		= routingData.id;
		
		if (schoolId) {
			window.Server.school.get(schoolId, { filter: { include:'postcode '} }).then(data => {
				if(data.postcode && data.postcode._id){
					data.postcode.id = data.postcode._id;
				}
				binding.set(Immutable.fromJS(data));
				binding.set('isSync', true);
			});
			
			this.schoolId = schoolId;
		} else {
			binding.set('isSync', true);
		}
	},
	componentWillUnmount: function(){
		const binding = this.getDefaultBinding();
		binding.clear();
	},
	submitEdit: function(schoolData) {
		window.Server.school.put(this.schoolId, schoolData).then(res => {
			document.location.hash = 'school_admin/summary';
			return res;
		});

	},
	render: function() {
		const isSync = Boolean(this.getDefaultBinding().toJS('isSync'));

		if (isSync) {
			return (
				<div className="bSchoolEdit">
					<SchoolForm
						title 			= "Edit school..."
						onSubmit 		= { this.submitEdit }
						binding 		= { this.getDefaultBinding() }
						isSuperAdmin 	= { false }
					/>
				</div>
			)
		} else {
			return null;
		}
	}
});


module.exports = EditSchoolForm;
