/**
 * Created by bridark on 09/06/15.
 */
const 	SchoolForm 		= require('../../schools/school_form'),
		React 			= require('react'),
		Morearty 		= require('morearty'),
		Immutable 		= require('immutable'),
		Loader          = require('module/ui/loader');

const EditSchoolForm = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				schoolId 		= routingData.id;

		binding.set('isSync', false);
		if (schoolId) {
			window.Server.school.get(schoolId).then( data => {
				if(data.postcode && data.postcode._id){
					data.postcode.id = data.postcode._id;
				}
				binding.set('form', Immutable.fromJS(data));
				binding.set('isSync', true);
			}).catch(err => {
				window.simpleAlert(
					`${err.errorThrown} server error`,
					'Ok',
					() => {}
				);
			});

			this.schoolId = schoolId;
		}
	},
	submitEdit: function(schoolData) {
		window.Server.school.put(this.schoolId, schoolData).then(() => {
			document.location.hash = 'schools/admin_views/list';
		});

	},
	render: function() {
		if (this.getDefaultBinding().toJS('isSync')) {
			return (
				<SchoolForm
					title="Edit school..."
					onSubmit={this.submitEdit}
					binding={this.getDefaultBinding()}
					isSuperAdmin={true}
				/>
			)
		} else {
			return <Loader/>;
		}
	}
});


module.exports = EditSchoolForm;
