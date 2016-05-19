/**
 * Created by bridark on 15/10/15.
 */
const   If                      = require('module/ui/if/if'),
		PermissionFields 		= require('module/ui/register/user/permission_fields'),
        React                   = require('react');
/*
 *
 *
 */
const RegistrationPermissions = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        isFormFilled:   React.PropTypes.bool,
        onSuccess:      React.PropTypes.func.isRequired,
        fieldCounter:   React.PropTypes.number.isRequired,
        onAnother:      React.PropTypes.func.isRequired,
        showButtons:    React.PropTypes.bool.isRequired
    },
    onSuccess: function() {
        const   self        = this,
                binding     = self.getDefaultBinding(),
                currentType = binding.get('type'),
                dataToPost  = {
                    preset:     binding.get('type'),
                    schoolId:   binding.get('schoolId')
                };
        if(currentType === 'parent') {
            dataToPost.comment = "Student - " + binding.get('firstName') + " " + binding.get('lastName') + "." +
                " Form - " + binding.get('formName') + ". House - " + binding.get('houseName') + ".";
            if(binding.get('studentExtra_1')){
                dataToPost.comment +="Student - "+binding.get('studentExtra_1').firstName+" "+binding.get('studentExtra_1').lastName+"."+
                    " Form - "+binding.get('studentExtra_1').form+". House - "+binding.get('studentExtra_1').house+".";
            }
            if(binding.get('studentExtra_2')){
                dataToPost.comment +="Student - "+binding.get('studentExtra_2').firstName+" "+binding.get('studentExtra_2').lastName+"."+
                    " Form - "+binding.get('studentExtra_2').form+". House - "+binding.get('studentExtra_2').house+".";
            }
        }
        window.Server.profileRequests.post(dataToPost).then( _ => self.props.onSuccess());
    },

    render:function(){
        const   self        = this,
                binding     = self.getDefaultBinding(),
                currentType = binding.get('type');
        return(
            <div>
				<PermissionFields binding={binding} extraFieldKey="studentExtra_1"></PermissionFields>
                <If condition={self.props.fieldCounter > 1 && currentType ==='parent'}>
                    <div className="eRegistration_permissionsField">
                        <PermissionFields binding={binding} extraFieldKey="studentExtra_1"></PermissionFields>
                    </div>
                </If>
                <If condition={self.props.fieldCounter > 2 && currentType ==='parent'}>
                    <div className="eRegistration_permissionsField">
                        <PermissionFields binding={binding} extraFieldKey="studentExtra_2"></PermissionFields>
                    </div>
                </If>
				<If condition={self.props.showButtons == true}>
					<div>
						<If condition={self.props.isFormFilled && currentType ==='parent'}>
							<div>
								<div className="bButton bButton_reg" onClick={self.onSuccess}>Continue</div>
								<div className="bButton bButton_reg" onClick={self.props.onAnother}>Add</div>
							</div>
						</If>
						<If condition={self.props.isFormFilled && currentType !== 'parent'}>
							<div className="bButton bButton_reg" onClick={self.onSuccess}>Continue</div>
						</If>
					</div>
				</If>

			</div>
        )
    }
});
module.exports = RegistrationPermissions;