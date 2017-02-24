/**
 * Created by bridark on 15/10/15.
 */
const	If						= require('module/ui/if/if'),
		PermissionDetails		= require('./permission_details/permission_details'),
		propz					= require('propz'),
		React					= require('react'),
		Promise					= require('bluebird');
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
					preset:currentType.toUpperCase()
				};

		let arrayPromise = [];

		for (let key in fieldsAr) {
			let fields = fieldsAr[key];

			if (fields.schoolId) {
				dataToPost.schoolId = fields.schoolId;
				dataToPost.promo = fields.promo ? fields.promo : '';
				dataToPost.comment = fields.comment ? fields.comment : '';
				if (currentType === 'parent') {
					dataToPost.comment += " Student - " + fields.firstName + " " + fields.lastName + "." +
						" Form - " + fields.formName + ". House - " + fields.houseName + ".";
				}
				arrayPromise.push(window.Server.profileRequests.post(dataToPost));
			}
		}

		Promise.all(arrayPromise).then(
			() => this.props.onSuccess()
		);
	},

	render:function(){

		const propsArray = [];

		/**
		 * Create array of props for transfer in components Permission Details
		 */
		for (let i=0; i<3; i++) {
			propsArray.push({
				schoolId 	: propz.get(this.props, ['fieldsAr', i, 'schoolId']),
				schoolName	: propz.get(this.props, ['fieldsAr', i, 'schoolName']),
				houseId 	: propz.get(this.props, ['fieldsAr', i, 'houseId']),
				formId 		: propz.get(this.props, ['fieldsAr', i, 'formId']),
				/* empty string because input value don't understand undefined */
				firstName 	: propz.get(this.props, ['fieldsAr', i, 'firstName'], ''),
				/* empty string because input value don't understand undefined */
				lastName 	: propz.get(this.props, ['fieldsAr', i, 'lastName'], ''),
				houseName 	: propz.get(this.props, ['fieldsAr', i, 'houseName']),
				formName 	: propz.get(this.props, ['fieldsAr', i, 'formName']),
				/* empty string because textarea value don't understand undefined */
				comment 	: propz.get(this.props, ['fieldsAr', i, 'comment'], ''),
				/* empty string because input value don't understand undefined */
				promo 		: propz.get(this.props, ['fieldsAr', i, 'promo'], '')
			});
		}

		return (
			<div className="eRegistration_permissionsField">
				{/**
				 * Permission details component
				 * Availible for all roles
				 * For parent contains fields for first children
				 * Max number children for this component - three. This decision not final, I think
				 *
				 */}
				<PermissionDetails
					type					= { this.props.currentType }
					handleSchoolSelect 		= { this.props.handleSchoolSelect }
					handleHouseSelect		= { this.props.handleHouseSelect }
					handleFormSelect		= { this.props.handleFormSelect }
					handleFirstNameChange	= { this.props.handleFirstNameChange }
					handleLastNameChange	= { this.props.handleLastNameChange }
					handleCommentChange		= { this.props.handleCommentChange }
					handlePromoChange		= { this.props.handlePromoChange }
					schoolId				= { propsArray[0].schoolId }
					schoolName				= { propsArray[0].schoolName }
					houseId					= { propsArray[0].houseId }
					formId					= { propsArray[0].formId }
					firstName 				= { propsArray[0].firstName }
					lastName 				= { propsArray[0].lastName }
					houseName				= { propsArray[0].houseName }
					formName				= { propsArray[0].formName }
					comment					= { propsArray[0].comment }
					promo					= { propsArray[0].promo }
					fieldNumber				= { '0' }
				/>
				{/**
				 * Permission details component
				 * Availible only for parent
				 * Contains fields for second children
				 */}
				<If condition={this.props.currentFieldArray >= 1 && this.props.currentType === 'parent'} >
					<PermissionDetails
						type					= { this.props.currentType }
						handleSchoolSelect 		= { this.props.handleSchoolSelect }
						handleHouseSelect		= { this.props.handleHouseSelect }
						handleFormSelect		= { this.props.handleFormSelect }
						handleFirstNameChange	= { this.props.handleFirstNameChange }
						handleLastNameChange	= { this.props.handleLastNameChange }
						handleCommentChange		= { this.props.handleCommentChange }
						handlePromoChange		= { this.props.handlePromoChange }
						schoolId				= { propsArray[1].schoolId }
						schoolName				= { propsArray[1].schoolName }
						houseId					= { propsArray[1].houseId }
						formId					= { propsArray[1].formId }
						firstName 				= { propsArray[1].firstName }
						lastName 				= { propsArray[1].lastName }
						houseName				= { propsArray[1].houseName }
						formName				= { propsArray[1].formName }
						comment					= { propsArray[1].comment }
						promo					= { propsArray[1].promo }
						fieldNumber				= { '1' }
					/>
				</If>
				{/**
				 * Permission details component
				 * Availible only for parent
				 * Contains fields for third children
				 */}
				<If condition={this.props.currentFieldArray >= 2 && this.props.currentType === 'parent'} >
					<PermissionDetails
						type					= { this.props.currentType }
						handleSchoolSelect 		= { this.props.handleSchoolSelect }
						handleHouseSelect		= { this.props.handleHouseSelect }
						handleFormSelect		= { this.props.handleFormSelect }
						handleFirstNameChange	= { this.props.handleFirstNameChange }
						handleLastNameChange	= { this.props.handleLastNameChange }
						handleCommentChange		= { this.props.handleCommentChange }
						handlePromoChange		= { this.props.handlePromoChange }
						schoolId				= { propsArray[2].schoolId }
						schoolName				= { propsArray[2].schoolName }
						houseId					= { propsArray[2].houseId }
						formId					= { propsArray[2].formId }
						firstName 				= { propsArray[2].firstName }
						lastName 				= { propsArray[2].lastName }
						houseName				= { propsArray[2].houseName }
						formName				= { propsArray[2].formName }
						comment					= { propsArray[2].comment }
						promo					= { propsArray[2].promo }
						fieldNumber				= { '2' }
					/>
				</If>
				<div>
					<If condition={this.props.isFormFilled}>
						<div className="bButton bButton_reg" onClick={this.onSuccess}>Continue</div>
					</If>
					{/**
					 * Show button "Add child" only for parent, when form with permission details filled and number of child less 3
					 */}
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