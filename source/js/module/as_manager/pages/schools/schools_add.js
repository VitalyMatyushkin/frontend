const 	SchoolForm 	= require('module/as_manager/pages/schools/schools_form'),
		React 		= require('react'),
		Immutable 	= require('immutable');

const AddSchoolForm = React.createClass({
	mixins: [Morearty.Mixin],
	submitAdd: function(schoolData) {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding();
		window.Server.schools.post(schoolData).then(function(data) {
			// Добавляемая школа всегда становится школой "по умолчанию"
			if(document.location.href.indexOf('admin')=== -1){
				globalBinding.set('userRules.activeSchoolId', data.id);
			}
			return data;
		}).catch((error)=>{
			alert(error.errorThrown+' occurred while adding school to database');
		});

		// Добавление школы в списк
		//What is this doing? //TODO: uncomment this if it gives problems but at the moment it causes issues as it is
		//binding.update(function(ImmutableValue){
		//	ImmutableValue = ImmutableValue || Immutable.List();
		//	return ImmutableValue.push(schoolData);
		//});

		 //Return to admin dashboard based on either manager or superadmin
		if(document.location.href.indexOf('admin')!== -1){
			document.location.hash = 'admin_schools/admin_views/list';
		}else{
			document.location.hash = 'schools';
		}
	},
	render: function() {
		var self = this;

		return (
			<SchoolForm title="Add new school..." onSubmit={self.submitAdd} binding={self.getDefaultBinding().sub('form')} />
		)
	}
});


module.exports = AddSchoolForm;
