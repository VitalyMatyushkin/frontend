const 	SchoolForm		= require('module/as_manager/pages/schools/schools_form'),
		React 			= require('react'),
		Morearty		= require('morearty'),
		Immutable 		= require('immutable'),

		SchoolHelper	= require('./schools_helper');

const EditSchoolForm = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			routingData = globalBinding.sub('routing.parameters').toJS(),
			schoolId = routingData.id;

		//binding.clear();

		if (schoolId) {
			window.Server.school.get(schoolId, {filter:{include:'postcode'}}).then(function (data) {
				if(data.postcode && data.postcode._id){
					data.postcode.id = data.postcode._id;
				}
				// !!! Method modify schoolData !!!
				// Side effect bro
				SchoolHelper.setClientPublicAccessSchoolValue(data);
				binding.set(Immutable.fromJS(data));
			});

			self.schoolId = schoolId;
		}
	},
	submitEdit: function(schoolData) {
		var self = this;

		// !!! Method modify schoolData !!!
		// Side effect bro
		SchoolHelper.setServerPublicAccessSchoolValue(schoolData);
		console.log(schoolData);
		window.Server.school.put(self.schoolId, schoolData).then(function(res) {
			document.location.hash = 'school_admin/summary';
			return res;
		});

	},
	render: function() {
		var self = this;

		return (
            <div className="bSchoolEdit">
                <SchoolForm title="Edit school..." onSubmit={self.submitEdit} binding={self.getDefaultBinding()} />
            </div>
		)
	}
});


module.exports = EditSchoolForm;
