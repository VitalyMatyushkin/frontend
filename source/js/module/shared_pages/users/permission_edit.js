/**
 * Created by Vitaly on 31.07.17.
 */
const   React           = require('react'),
        Immutable       = require('immutable'),
        Morearty        = require('morearty'),
        Form 		    = require('module/ui/form/form'),
        FormField 	    = require('module/ui/form/form_field'),
        SVG 	        = require('module/ui/svg'),
        DateHelper 	    = require('module/helpers/date_helper');

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

        binding.set('dataUploaded', false);
        window.Server.userPermission.get({userId, permissionId})
        .then((data) => {
			binding.set('dataUploaded', true);
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

		if (data.activatedAt){
            data.activatedAt = DateHelper.getFormatDateTimeUTCString(data.activatedAt);
		}
		if (data.deactivatedAt){
			data.deactivatedAt = DateHelper.getFormatDateTimeUTCString(data.deactivatedAt);
		}
        window.Server.userPermission.put({userId, permissionId}, data)
        .then((res) => {
            binding.set('editPermission',false);
            return res;
        });
    },
    render: function() {
        const   binding = this.getDefaultBinding(),
                dataUploaded = binding.get('dataUploaded');

		if (dataUploaded) {
			return (
                <div className="bPopupEdit_container">
                    <Form
                        formStyleClass="mNarrow"
                        name="Edit permission"
                        binding={binding.sub('formPermission')}
                        onSubmit={this.onSubmitPermission}
                        defaultButton="Save"
                        onCancel={this.props.onCancel}
                    >
                        <FormField type="dropdown" field="status" options={this.getStatus()}>Status</FormField>
                        <FormField type="datetime" field="activatedAt" validation="datetime">Activated</FormField>
                        <FormField type="datetime" field="deactivatedAt" validation="datetime">Deactivated</FormField>
                    </Form>
                </div>
			);
		} else {
			return (
                <div className="bPopupEdit_container">
                    <div className="bForm mNarrow">
                        <div className="eForm_atCenter" style={{width: '212px'}}>
                            <h2>Edit permission</h2>
                            <div className="eLoader"><SVG icon="icon_spin-loader-black" /></div>
                        </div>
                    </div>
                </div>
			);
        }
    }
});
module.exports = EditPermission;