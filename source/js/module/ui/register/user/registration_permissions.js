/**
 * Created by bridark on 15/10/15.
 */
const   If                      = require('module/ui/if/if'),
		PermissionFields 		= require('module/ui/register/user/permission_fields'),
        React                   = require('react');
/*
 * It is a component for registration permission requests
 * It generates and sends a requests to the server
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
				fieldsAr	= binding.toJS('fields'),
                dataToPost  = {
                    preset:currentType
                };

		for(let i in fieldsAr){
			const fields = fieldsAr[i];
			if(fields.schoolId){
				dataToPost.schoolId = fields.schoolId;
				if(currentType === 'parent') {
					dataToPost.comment = "Student - " + fields.firstName + " " + fields.lastName + "." +
						" Form - " + fields.formName + ". House - " + fields.houseName + ".";
				}
				window.Server.profileRequests.post(dataToPost).then( _ => self.props.onSuccess());
			}
		}
    },

    render:function(){
        const   self        = this,
                binding     = self.getDefaultBinding(),
                currentType = binding.get('type');
        return(
            <div className="eRegistration_permissionsField">
				<PermissionFields binding={binding.sub('fields.0')} type={currentType} />
                <If condition={self.props.fieldCounter > 1 && currentType ==='parent'}>
					<PermissionFields binding={binding.sub('fields.1')} type={currentType} />
                </If>
                <If condition={self.props.fieldCounter > 2 && currentType ==='parent'}>
					<PermissionFields binding={binding.sub('fields.2')} type={currentType} />
                </If>
				<If condition={self.props.showButtons == true}>
					<div>
						<If condition={self.props.isFormFilled}>
							<div className="bButton bButton_reg" onClick={self.onSuccess}>Continue</div>
						</If>
						<If condition={self.props.isFormFilled && currentType ==='parent'}>
							<div className="bButton bButton_reg" onClick={self.props.onAnother}>Add child</div>
						</If>
					</div>
				</If>

			</div>
        )
    }
});
module.exports = RegistrationPermissions;