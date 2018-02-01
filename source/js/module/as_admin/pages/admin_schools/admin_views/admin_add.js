/**
 * Created by bridark on 09/06/15.
 */
const   SchoolForm  = require('module/as_manager/pages/schools/schools_form'),
        React       = require('react'),
		Morearty    = require('morearty');

const AddSchoolForm = React.createClass({
    mixins: [Morearty.Mixin],
    submitAdd: function(schoolData) {
        window.Server.schools.post(schoolData).then(() => {
            document.location.hash = 'schools/admin_views/list';
        });
    },
    render: function() {
        var self = this;

        return (
            <SchoolForm
                title="Add new school..."
                onSubmit={self.submitAdd}
                binding={self.getDefaultBinding().sub('form')}
                isSuperAdmin={true}
            />
        )
    }
});


module.exports = AddSchoolForm;
