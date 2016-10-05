/**
 * Created by bridark on 09/06/15.
 */
const   SchoolForm  	= require('module/as_manager/pages/schools/schools_form'),
        React       	= require('react'),
        Morearty    	= require('morearty'),
        Immutable   	= require('immutable'),
		SchoolHelper	= require('module/as_manager/pages/schools/schools_helper');

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
            window.Server.school.get(schoolId).then(function (data) {
				if(data.postcode && data.postcode._id){
					data.postcode.id = data.postcode._id;
				}
				/**
				 * !!! Method modify arg !!!
				 * Method replace server publicSite.password field value by client value
				 */
				SchoolHelper.setClientPublicSiteAccessPasswordValue(data);
                binding.set(Immutable.fromJS(data));
            }).catch(err => {
                window.simpleAlert(
                    `${err.errorThrown} server error`,
                    'Ok',
                    () => {}
                );
            });

            self.schoolId = schoolId;
        }
    },
    submitEdit: function(schoolData) {
        var self = this;

		/**
		 * !!! Method modify arg !!!
		 * Method replace client publicSite.password field value by server value
		 */
		SchoolHelper.setServerPublicSiteAccessPasswordValue(schoolData);
        window.Server.school.put(self.schoolId, schoolData).then(function() {
            document.location.hash = 'admin_schools/admin_views/list';
        });

    },
    render: function() {
        var self = this;

        return (
            <SchoolForm title="Edit school..." onSubmit={self.submitEdit} binding={self.getDefaultBinding()} />
        )
    }
});


module.exports = EditSchoolForm;
