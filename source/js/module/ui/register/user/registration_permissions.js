/**
 * Created by bridark on 15/10/15.
 */
const   If                      = require('module/ui/if/if'),
		PermissionFieldsReact	= require('module/ui/register/user/permission_fields_react'),
        React                   = require('react');
/*
 * It is a component for registration permission requests
 * It generates and sends a requests to the server
 */
const RegistrationPermissions = React.createClass({
    propTypes:{
        isFormFilled:   			React.PropTypes.bool,
        onSuccess:      			React.PropTypes.func.isRequired,
		addFieldArray:      		React.PropTypes.func.isRequired,
		handlerSelectSchool: 		React.PropTypes.func.isRequired,
		handlerSelectHouse: 		React.PropTypes.func.isRequired,
		handlerSelectForm: 			React.PropTypes.func.isRequired,
		handlerChangeFirstName: 	React.PropTypes.func.isRequired,
		handlerChangeLastName: 		React.PropTypes.func.isRequired,
		handlerChangeComment: 		React.PropTypes.func.isRequired,
		handlerChangePromo: 		React.PropTypes.func.isRequired,
		currentType:				React.PropTypes.string,
		fieldsAr:					React.PropTypes.object,
		currentFieldArray:			React.PropTypes.number
    },
    onSuccess: function() {
        const 	currentType = this.props.currentType,
				fieldsAr	= this.props.fieldsAr,
                dataToPost  = {
                    preset:currentType
                };

		for(let i in fieldsAr){
			const fields = fieldsAr[i];
			if(fields.schoolId){
				dataToPost.schoolId = fields.schoolId;
				dataToPost.promo = fields.promo ? fields.promo : '';
				dataToPost.comment = fields.comment ? fields.comment : '';
				if(currentType === 'parent') {
					dataToPost.comment += " Student - " + fields.firstName + " " + fields.lastName + "." +
						" Form - " + fields.formName + ". House - " + fields.houseName + ".";
				}
				window.Server.profileRequests.post(dataToPost).then( _ => this.props.onSuccess());
			}
		}
    },

	render:function(){

		const 	schoolId0 	= this.props.fieldsAr && this.props.fieldsAr[0] && this.props.fieldsAr[0].schoolId  ? this.props.fieldsAr[0].schoolId : '',
				schoolId1 	= this.props.fieldsAr && this.props.fieldsAr[1] && this.props.fieldsAr[1].schoolId ? this.props.fieldsAr[1].schoolId : '',
				schoolId2 	= this.props.fieldsAr && this.props.fieldsAr[2] && this.props.fieldsAr[2].schoolId ? this.props.fieldsAr[2].schoolId : '',
				houseId0 	= this.props.fieldsAr && this.props.fieldsAr[0] && this.props.fieldsAr[0].houseId ? this.props.fieldsAr[0].houseId : '',
				houseId1 	= this.props.fieldsAr && this.props.fieldsAr[1] && this.props.fieldsAr[1].houseId ? this.props.fieldsAr[1].houseId : '',
				houseId2 	= this.props.fieldsAr && this.props.fieldsAr[2] && this.props.fieldsAr[2].houseId ? this.props.fieldsAr[2].houseId : '',
				formId0 	= this.props.fieldsAr && this.props.fieldsAr[0] && this.props.fieldsAr[0].formId ? this.props.fieldsAr[0].formId : '',
				formId1 	= this.props.fieldsAr && this.props.fieldsAr[1] && this.props.fieldsAr[1].formId ? this.props.fieldsAr[1].formId : '',
				formId2 	= this.props.fieldsAr && this.props.fieldsAr[2] && this.props.fieldsAr[2].formId ? this.props.fieldsAr[2].formId : '';


		return (
			<div className="eRegistration_permissionsField">
				<PermissionFieldsReact
					type					= { this.props.currentType }
					handlerSelectSchool 	= { this.props.handlerSelectSchool }
					handlerSelectHouse		= { this.props.handlerSelectHouse }
					handlerSelectForm		= { this.props.handlerSelectForm }
					handlerChangeFirstName	= { this.props.handlerChangeFirstName }
					handlerChangeLastName	= { this.props.handlerChangeLastName }
					handlerChangeComment	= { this.props.handlerChangeComment }
					handlerChangePromo		= { this.props.handlerChangePromo }
					schoolId				= { schoolId0 }
					houseId					= { houseId0 }
					formId					= { formId0 }
					numberField				= { '0' }
				/>
				<If condition={this.props.currentFieldArray >= 1 && this.props.currentType ==='parent'} >
					<PermissionFieldsReact
						type					= { this.props.currentType }
						handlerSelectSchool 	= { this.props.handlerSelectSchool }
						handlerSelectHouse		= { this.props.handlerSelectHouse }
						handlerSelectForm		= { this.props.handlerSelectForm }
						handlerChangeFirstName	= { this.props.handlerChangeFirstName }
						handlerChangeLastName	= { this.props.handlerChangeLastName }
						handlerChangeComment	= { this.props.handlerChangeComment }
						handlerChangePromo		= { this.props.handlerChangePromo }
						schoolId				= { schoolId1 }
						houseId					= { houseId1 }
						formId					= { formId1 }
						numberField				= { '1' }
					/>
				</If>
				<If condition={this.props.currentFieldArray >= 2 && this.props.currentType ==='parent'} >
					<PermissionFieldsReact
						type					= { this.props.currentType }
						handlerSelectSchool 	= { this.props.handlerSelectSchool }
						handlerSelectHouse		= { this.props.handlerSelectHouse }
						handlerSelectForm		= { this.props.handlerSelectForm }
						handlerChangeFirstName	= { this.props.handlerChangeFirstName }
						handlerChangeLastName	= { this.props.handlerChangeLastName }
						handlerChangeComment	= { this.props.handlerChangeComment }
						handlerChangePromo		= { this.props.handlerChangePromo }
						schoolId				= { schoolId2 }
						houseId					= { houseId2 }
						formId					= { formId2 }
						numberField				= { '2' }
					/>
				</If>
				<div>
					<If condition={this.props.isFormFilled}>
						<div className="bButton bButton_reg" onClick={this.onSuccess}>Continue</div>
					</If>
					<If condition=
							{
								this.props.isFormFilled &&
								this.props.currentType ==='parent' &&
								this.props.currentFieldArray < 2
							}
					>
						<div className="bButton bButton_reg" onClick={this.props.addFieldArray}>Add child</div>
					</If>
				</div>
			</div>
		)
	}
});
module.exports = RegistrationPermissions;