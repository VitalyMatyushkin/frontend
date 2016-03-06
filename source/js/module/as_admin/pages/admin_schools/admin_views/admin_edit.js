/**
 * Created by bridark on 09/06/15.
 */
const   SchoolForm  = require('module/as_manager/pages/schools/schools_form'),
        React       = require('react'),
        Immutable   = require('immutable');

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
                self.isMounted() && binding.set(Immutable.fromJS(data));
            }).catch(function(err){
                alert(err.errorThrown+' server error');
            });

            self.schoolId = schoolId;
        }
    },
    submitEdit: function(schoolData) {
        var self = this;
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
