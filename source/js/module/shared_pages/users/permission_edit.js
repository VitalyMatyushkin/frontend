/**
 * Created by Vitaly on 31.07.17.
 */
const   React           = require('react'),
        Immutable       = require('immutable'),
        Morearty        = require('morearty'),
        Form 		    = require('module/ui/form/form'),
        FormField 	    = require('module/ui/form/form_field'),
	    {SVG} 	        = require('module/ui/svg'),
        RoleHelper      = require('module/helpers/role_helper'),
        {DateHelper}    = require('module/helpers/date_helper'),
		Moment		    = require('moment'),
		MoreartyHelper  = require('module/helpers/morearty_helper'),
		SportManager    = require('module/shared_pages/settings/account/helpers/sport-manager');

const STATUS = {
    ACTIVE:     'ACTIVE',
    BLOCKED:    'BLOCKED',
    REMOVED:    'REMOVED',
    ARCHIVED:   'ARCHIVED'
};

const EditPermission = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes: {
        onCancel: React.PropTypes.func.isRequired,
	    isSuperAdmin: React.PropTypes.bool.isRequired
    },
    componentWillMount: function(){
        const binding = this.getDefaultBinding();

        binding.set('isSync', false);
        this.getUserPermissionsService().get(this.getUserPermissionsServiceParams())
	        .then(userPermission => {
	            if(userPermission.preset === RoleHelper.USER_ROLES.COACH) {
		            binding.set('sportManager', Immutable.fromJS({
			            rivals: userPermission.sports
		            }));
	            }
		        binding.set('isSync', true);
		        binding.set('formPermission',Immutable.fromJS(userPermission));
	            return true;
	        });
    },
    componentWillUnmount: function(){
        const binding = this.getDefaultBinding();

        binding.clear('formPermission');
    },
	getUserPermissionsServiceParams() {
		const binding = this.getDefaultBinding();
		const userId = binding.get('userWithPermissionDetail.id');
		const permissionId = binding.get('editPermissionId');

		if(this.props.isSuperAdmin) {
			return {userId, permissionId};
		} else {
			const activeSchoolId = MoreartyHelper.getActiveSchoolId(this);

			return {userId, schoolId: activeSchoolId, permissionId};
		}
	},
	getUserPermissionsService: function () {
		if(this.props.isSuperAdmin) {
			return window.Server.userPermission;
		} else {
			return window.Server.schoolUserPermission;
		}
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
        const binding = this.getDefaultBinding();

		if (data.activatedAt){
            data.activatedAt = DateHelper.getFormatDateTimeUTCString(data.activatedAt);
		}
		if (data.deactivatedAt){
			data.deactivatedAt = DateHelper.getFormatDateTimeUTCString(data.deactivatedAt);
		}
		const userPermission = binding.toJS('formPermission');
	    if(userPermission.preset === RoleHelper.USER_ROLES.COACH) {
		    const sports = binding.toJS('sportManager.rivals');
		    const sportIds = sports.map(s => s.id);
		    data.sportIds = sportIds;
	    }
        this.getUserPermissionsService().put(this.getUserPermissionsServiceParams(), data)
	        .then(res => {
	            binding.set('editPermission',false);
	            return res;
	        });
    },
	renderSports() {
		const binding = this.getDefaultBinding();
		const userPermission = binding.toJS('formPermission');
		
		if(userPermission.preset === RoleHelper.USER_ROLES.COACH) {
			return (
				<div className="eForm_field">
					<div className="eForm_fieldName mNoLeftPadding">
						Allow coach sports
					</div>
					<SportManager
						binding			= { binding.sub('sportManager') }
						schoolId		= { userPermission.schoolId }
						serviceName 	= { 'schoolSports' }
						extraCssStyle	= "mInline mRightMargin mWidth250"
					/>
				</div>
			);
		} else {
			// unfortunately form can't ignore null for example in lifecycle process
			// and try to obtain it
			// it will fall in this case
			// so we can't use null for this case
			return <div/>;
		}
	},
    render: function() {
        const   binding = this.getDefaultBinding(),
                isSync = binding.get('isSync');

		if (isSync) {
			return (
                <div className="bPopupEdit_container">
                    <Form
                        formStyleClass="mWidth300"
                        name="Edit permission"
                        binding={binding.sub('formPermission')}
                        onSubmit={this.onSubmitPermission}
                        defaultButton="Save"
                        onCancel={this.props.onCancel}
                    >
                        <FormField type="dropdown" field="status" options={this.getStatus()}>Status</FormField>
                        <FormField type="datetime" field="activatedAt">Activated</FormField>
                        <FormField type="datetime" field="deactivatedAt">Deactivated</FormField>
	                    {this.renderSports()}
                    </Form>
                </div>
			);
		} else {
			return (
                <div className="bPopupEdit_container">
                    <div className="bForm mWidth300">
                        <div className="eForm_atCenter" style={{width: '300px'}}>
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