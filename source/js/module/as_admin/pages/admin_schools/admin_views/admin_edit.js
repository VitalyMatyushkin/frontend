/**
 * Created by bridark on 09/06/15.
 */
const   SchoolForm		= require('../../schools/school_form'),
        React       	= require('react'),
        Morearty    	= require('morearty'),
        Immutable   	= require('immutable'),
		SchoolHelper	= require('module/helpers/school_helper');

const EditSchoolForm = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function () {
        const 	binding			= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding(),
				routingData		= globalBinding.sub('routing.parameters').toJS(),
				schoolId		= routingData.id;

        if (schoolId) {
            window.Server.school.get(schoolId).then( data => {
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

            this.schoolId = schoolId;
        }
    },
    submitEdit: function(schoolData) {
		/**
		 * !!! Method modify arg !!!
		 * Method replace client publicSite.password field value by server value
		 */
		SchoolHelper.setServerPublicSiteAccessPasswordValue(schoolData);
        window.Server.school.put(this.schoolId, schoolData).then(() => {
            document.location.hash = 'schools/admin_views/list';
        });

    },
    render: function() {
        return (
            <SchoolForm title="Edit school..." onSubmit={this.submitEdit} binding={this.getDefaultBinding()} />
        )
    }
});


module.exports = EditSchoolForm;
