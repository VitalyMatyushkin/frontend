/**
 * Created by bridark on 15/10/15.
 */
const	If						= require('module/ui/if/if'),
		PermissionFieldsReact	= require('module/ui/register/user/permission_fields_react'),
		propz					= require('propz'),
		React					= require('react');
/*
 * It is a component for registration permission requests
 * It generates and sends a requests to the server
 */
const RegistrationPermissions = React.createClass({
	propTypes:{
		isFormFilled:				React.PropTypes.bool,
		onSuccess:		 			React.PropTypes.func.isRequired,
		addFieldArray:				React.PropTypes.func.isRequired,
		handleSchoolSelect: 		React.PropTypes.func.isRequired,
		handleHouseSelect: 			React.PropTypes.func.isRequired,
		handleFormSelect: 			React.PropTypes.func.isRequired,
		handleFirstNameChange: 		React.PropTypes.func.isRequired,
		handleLastNameChange: 		React.PropTypes.func.isRequired,
		handleCommentChange: 		React.PropTypes.func.isRequired,
		handlePromoChange: 			React.PropTypes.func.isRequired,
		currentType:				React.PropTypes.string,
		fieldsAr:					React.PropTypes.object,	// array of fields
		currentFieldArray:			React.PropTypes.number
	},
	onSuccess: function() {
		const 	currentType = this.props.currentType,
				fieldsAr	= this.props.fieldsAr,
				dataToPost	= {
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
				window.Server.profileRequests.post(dataToPost).then( () => this.props.onSuccess());
			}
		}
	},

	render:function(){

		const 	schoolId0 	= propz.get(this.props, ['fieldsAr', 0, 'schoolId']),
				houseId0 	= propz.get(this.props, ['fieldsAr', 0, 'houseId']),
				formId0 	= propz.get(this.props, ['fieldsAr', 0, 'formId']),
				firstName0 	= propz.get(this.props, ['fieldsAr', 0, 'firstName'], ''),
				lastName0 	= propz.get(this.props, ['fieldsAr', 0, 'lastName'], ''),
				schoolId1 	= propz.get(this.props, ['fieldsAr', 1, 'schoolId']),
				houseId1 	= propz.get(this.props, ['fieldsAr', 1, 'houseId']),
				formId1 	= propz.get(this.props, ['fieldsAr', 1, 'formId']),
				firstName1 	= propz.get(this.props, ['fieldsAr', 1, 'firstName'], ''),
				lastName1 	= propz.get(this.props, ['fieldsAr', 1, 'lastName'], ''),
				schoolId2 	= propz.get(this.props, ['fieldsAr', 2, 'schoolId']),
				houseId2 	= propz.get(this.props, ['fieldsAr', 2, 'houseId']),
				formId2 	= propz.get(this.props, ['fieldsAr', 2, 'formId']),
				firstName2 	= propz.get(this.props, ['fieldsAr', 2, 'firstName'], ''),
				lastName2 	= propz.get(this.props, ['fieldsAr', 2, 'lastName'], ''),
				houseName0 	= propz.get(this.props, ['fieldsAr', 0, 'houseName']),
				houseName1 	= propz.get(this.props, ['fieldsAr', 1, 'houseName']),
				houseName2 	= propz.get(this.props, ['fieldsAr', 2, 'houseName']),
				formName0 	= propz.get(this.props, ['fieldsAr', 0, 'formName']),
				formName1 	= propz.get(this.props, ['fieldsAr', 1, 'formName']),
				formName2 	= propz.get(this.props, ['fieldsAr', 2, 'formName']);

		return (
			<div className="eRegistration_permissionsField">
				<PermissionFieldsReact
					type					= { this.props.currentType }
					handleSchoolSelect 		= { this.props.handleSchoolSelect }
					handleHouseSelect		= { this.props.handleHouseSelect }
					handleFormSelect		= { this.props.handleFormSelect }
					handleFirstNameChange	= { this.props.handleFirstNameChange }
					handleLastNameChange	= { this.props.handleLastNameChange }
					handleCommentChange		= { this.props.handleCommentChange }
					handlePromoChange		= { this.props.handlePromoChange }
					schoolId				= { schoolId0 }
					houseId					= { houseId0 }
					formId					= { formId0 }
					firstName 				= { firstName0 }
					lastName 				= { lastName0 }
					fieldNumber				= { '0' }
					houseName				= { houseName0 }
					formName				= { formName0 }
				/>
				<If condition={this.props.currentFieldArray >= 1 && this.props.currentType === 'parent'} >
					<PermissionFieldsReact
						type					= { this.props.currentType }
						handleSchoolSelect 		= { this.props.handleSchoolSelect }
						handleHouseSelect		= { this.props.handleHouseSelect }
						handleFormSelect		= { this.props.handleFormSelect }
						handleFirstNameChange	= { this.props.handleFirstNameChange }
						handleLastNameChange	= { this.props.handleLastNameChange }
						handleCommentChange		= { this.props.handleCommentChange }
						handlePromoChange		= { this.props.handlePromoChange }
						schoolId				= { schoolId1 }
						houseId					= { houseId1 }
						formId					= { formId1 }
						firstName 				= { firstName1 }
						lastName 				= { lastName1 }
						fieldNumber				= { '1' }
						houseName				= { houseName1 }
						formName				= { formName1 }
					/>
				</If>
				<If condition={this.props.currentFieldArray >= 2 && this.props.currentType === 'parent'} >
					<PermissionFieldsReact
						type					= { this.props.currentType }
						handleSchoolSelect 		= { this.props.handleSchoolSelect }
						handleHouseSelect		= { this.props.handleHouseSelect }
						handleFormSelect		= { this.props.handleFormSelect }
						handleFirstNameChange	= { this.props.handleFirstNameChange }
						handleLastNameChange	= { this.props.handleLastNameChange }
						handleCommentChange		= { this.props.handleCommentChange }
						handlePromoChange		= { this.props.handlePromoChange }
						schoolId				= { schoolId2 }
						houseId					= { houseId2 }
						formId					= { formId2 }
						firstName 				= { firstName2 }
						lastName 				= { lastName2 }
						fieldNumber				= { '2' }
						houseName				= { houseName2 }
						formName				= { formName2 }
					/>
				</If>
				<div>
					<If condition={this.props.isFormFilled}>
						<div className="bButton bButton_reg" onClick={this.onSuccess}>Continue</div>
					</If>
					<If condition=
							{
								this.props.isFormFilled &&
								this.props.currentType === 'parent' &&
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