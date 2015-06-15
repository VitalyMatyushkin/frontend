/**
 * Created by bridark on 12/06/15.
 */
var Form = require('module/ui/form/form'),
    FormField = require('module/ui/form/form_field'),
    FormColumn = require('module/ui/form/form_column'),
    ModifyUser;

ModifyUser = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            userId = globalBinding.get('routing.parameters.id');

        if (userId) {
            window.Server.user.get(userId).then(function (data) {
                self.isMounted() && binding.set(Immutable.fromJS(data));
            });

            self.userId = userId;
        }
    },
    submitEdit: function(data) {
        var self = this;

        data.id = self.userId;

        self.userId && window.Server.user.put(self.userId, data).then(function() {
            alert('user updated');
        });
    },
    render: function() {
        var self = this;

        return (
            <Form name="Modify User" onSubmit={self.submitEdit} binding={self.getDefaultBinding()} defaultButton="Save" loadingButton="Saving..." >
                <FormField type="text" field="firstName" validation="required alphanumeric">First name</FormField>
                <FormField type="text" field="lastName" validation="required alphanumeric">Last name</FormField>
                <FormField type="text" field="phone" validation="required">Phone</FormField>
            </Form>
        )
    }
});
module.exports = ModifyUser;
