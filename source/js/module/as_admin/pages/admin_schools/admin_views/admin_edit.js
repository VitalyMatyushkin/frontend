/**
 * Created by bridark on 09/06/15.
 */
var SchoolForm = require('module/as_manager/pages/schools/schools_form'),
    EditSchoolForm;

EditSchoolForm = React.createClass({
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
                self.isMounted() && binding.set(Immutable.fromJS(data));
            });

            self.schoolId = schoolId;
        }
    },
    submitEdit: function(schoolData) {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding();

        window.Server.school.put(self.schoolId, schoolData).then(function() {
            document.location.hash = 'admin_schools/admin_dashboard';
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
