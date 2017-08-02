/**
 * Created by Vitaly on 31.07.17.
 */
const   React           = require('react'),
        Immutable       = require('immutable'),
        Morearty        = require('morearty'),
        Form 		    = require('module/ui/form/form'),
        FormField 	    = require('module/ui/form/form_field');

const STATUS = {
    ACTIVE:     'ACTIVE',
    BLOCKED:    'BLOCKED',
    REMOVED:    'REMOVED',
    ARCHIVED:   'ARCHIVED'
};

const EditPermission = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes: {
        onCancel: React.PropTypes.func.isRequired
    },
    componentWillMount: function(){
        const   binding         = this.getDefaultBinding(),
                userId          = binding.get('userWithPermissionDetail.id'),
                permissionId    = binding.get('editPermissionId');

        window.Server.userPermission.get({userId, permissionId})
        .then((data) => {
            binding.set('formPermission',Immutable.fromJS(data));
            return data;
        });
    },
    componentWillUnmount: function(){
        const binding = this.getDefaultBinding();
        binding.clear('formPermission');
    },
    getStatus: function () {
        return [
            {
                text: 'Active',
                value: STATUS.ACTIVE
            },
            {
                text: 'Blocked',
                value: STATUS.BLOCKED
            },
            {
                text: 'Removed',
                value: STATUS.REMOVED
            },
            {
                text: 'Archived',
                value: STATUS.ARCHIVED
            }
        ];
    },
    onSubmitPermission: function (data) {
        const   binding = this.getDefaultBinding(),
                userId = binding.get('userWithPermissionDetail.id'),
                permissionId = binding.get('editPermissionId');


        if (data.activatedAt) data.activatedAt += 'T00:00:00.000Z';
        if (data.deactivatedAt) data.deactivatedAt += 'T00:00:00.000Z';

        window.Server.userPermission.put({userId, permissionId}, data)
        .then((res) => {
            binding.set('editPermission',false);
            return res;
        });
    },
    render: function() {
        const binding = this.getDefaultBinding();

        return (
            <div className="bPopupEdit_container">
                <Form
                    formStyleClass  = "mNarrow"
                    name            = "Edit permission"
                    binding         = {binding.sub('formPermission')}
                    onSubmit        = {this.onSubmitPermission}
                    defaultButton   = "Save"
                    onCancel        = {this.props.onCancel}
                >
                    <FormField type="dropdown"  field="status" options={this.getStatus()}>Status</FormField>
                    <FormField type="date"      field="activatedAt" validation="date">Activated</FormField>
                    <FormField type="date"      field="deactivatedAt" validation="date">Deactivated</FormField>
                </Form>
            </div>
        );
    }
});
module.exports = EditPermission;