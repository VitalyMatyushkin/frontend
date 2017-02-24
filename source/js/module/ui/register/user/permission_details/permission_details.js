/**
 * Created by Woland on 12.01.2017.
 */
const	React 					= require ('react');

const	If						= require('../../../../ui/if/if'),
		CrossButton				= require('../../../../ui/cross_button/cross_button'),
		AutoComplete			= require('../../../../ui/autocomplete2/OldAutocompleteWrapper'),
		PostcodeSelector		= require('./postcode_selector/postcode_selector');

const	PermissionDetailsHelper	= require('./permission_detail_helper');

const PermissionDetails = React.createClass({
	propTypes: {
		type:						React.PropTypes.string,
		handleSchoolSelect: 		React.PropTypes.func.isRequired,
		handleHouseSelect: 			React.PropTypes.func.isRequired,
		handleFormSelect: 			React.PropTypes.func.isRequired,
		handleFirstNameChange: 		React.PropTypes.func.isRequired,
		handleLastNameChange: 		React.PropTypes.func.isRequired,
		handleCommentChange: 		React.PropTypes.func.isRequired,
		handlePromoChange: 			React.PropTypes.func.isRequired,
		schoolId:					React.PropTypes.string,
		houseId:					React.PropTypes.string,
		formId:						React.PropTypes.string,
		firstName:					React.PropTypes.string,
		lastName:					React.PropTypes.string,
		houseName:					React.PropTypes.string,
		schoolName:					React.PropTypes.string,
		formName:					React.PropTypes.string,
		promo:						React.PropTypes.string,
		comment:					React.PropTypes.string,
		fieldNumber:				React.PropTypes.string.isRequired
	},
	getInitialState: function(){
		return {
			postcode: undefined
		};
	},
	/**
	 * school filter by schoolName
	 * @param schoolName
	 * @returns {*}
	 */
	serviceSchoolFilter: function (schoolName) {
		if(typeof this.state.postcode === 'undefined') {
			return this.searchSchool(schoolName);
		} else {
			return this.searchSchoolNearCurrentPostcode(schoolName);
		}
	},
	searchSchool: function(schoolName) {
		return window.Server.publicSchools.get(PermissionDetailsHelper.getSchoolServiceFilter(schoolName, this.props.type));
	},
	searchSchoolNearCurrentPostcode: function(schoolName) {
		const point = this.state.postcode.point;

		const filter = {
			filter: {
				where: {
					name: {
						like: schoolName,
						options: 'i'
					},
					'postcode.point': {
						$nearSphere: {
							$geometry: {
								type: 'Point',
								coordinates: [point.lng, point.lat] // [longitude, latitude]
							}
						}
					}
				},
				limit: 20
			}
		};

		return window.Server.publicSchools.get(filter);
	},
	/**
	 * house filter by houseName
	 * @param houseName
	 * @returns {*}
	 */
	serviceHouseFilter: function (houseName) {
		const schoolId = this.props.schoolId;

		return window.Server.publicSchoolHouses.get(schoolId, {
			filter: {
				where: {
					name: {
						like: houseName,
						options: 'i'
					}
				}
			}
		});
	},

	/**
	 * form filter by formName
	 * @param formName
	 * @returns {*}
	 */
	serviceFormFilter: function (formName) {
		const schoolId = this.props.schoolId;

		return window.Server.publicSchoolForms.get(schoolId, {
			filter: {
				where: {
					name: {
						like: formName,
						options: 'i'
					}
				}
			}
		});
	},
	/**
	 * Get school name after select school in autocomplete component
	 * It's not good, but autocomplete return only schoolId
	 */
	onSelectSchool: function(schoolId, school) {
		if (typeof schoolId !== 'undefined') {
			window.Server.publicSchool.get({schoolId: schoolId}).then( school => {
				this.props.handleSchoolSelect(schoolId, school.name, this.props.fieldNumber);
			});
		}
	},
	/**
	 * Get house name after select house in autocomplete component
	 * It's not good, but autocomplete return only houseId
	 */
	onSelectHouse: function(houseId) {
		if (typeof houseId !== 'undefined') {
			window.Server.publicSchoolHouse.get({houseId: houseId, schoolId: this.props.schoolId}).then( house => {
				this.props.handleHouseSelect(houseId, house.name, this.props.fieldNumber);
			});
		}
	},
	/**
	 * Get form name after select form in autocomplete component
	 * It's not good, but autocomplete return only formId
	 */
	onSelectForm: function(formId) {
		if (typeof formId !== 'undefined') {
			window.Server.publicSchoolForm.get({formId: formId, schoolId: this.props.schoolId}).then(form => {
				this.props.handleFormSelect(formId, form.name, this.props.fieldNumber);
			});
		}
	},

	onChangeFirstName: function(event) {
		this.props.handleFirstNameChange(event.currentTarget.value, this.props.fieldNumber);
	},

	onChangeLastName: function(event) {
		this.props.handleLastNameChange(event.currentTarget.value, this.props.fieldNumber);
	},

	onChangeComment: function(event) {
		this.props.handleCommentChange(event.currentTarget.value, this.props.fieldNumber);
	},

	onChangePromo: function(event) {
		this.props.handlePromoChange(event.currentTarget.value, this.props.fieldNumber);
	},

	getSchoolMessage: function () {
		return (
			<div className="eForm_message">
				<span className="margin-right">Haven’t found your school?</span>
				<a className="margin-right" href="mailto:support@squadintouch.com?subject=Please add school">Email us</a>
				<span>and we will add it!</span>
			</div>)
	},
	handleSelectPostcode: function(id, postcode) {
		this.setState({
			postcode: postcode
		});
	},
	handleEscapePostcode: function() {
		this.setState({
			postcode: undefined
		});
	},
	render: function() {
		const 	currentType		= this.props.type,
				houseName		= this.props.houseName ? this.props.houseName : '',
				formName		= this.props.formName ? this.props.formName : '',
				schoolName		= this.props.schoolName ? this.props.schoolName : '';

		const	message			= this.getSchoolMessage();

		console.log(this.state.postcode);

		return (
			<div>
				{/**
				 * If select role, show this block
				 * Block "Select school", availible for all roles
				 */}
				<If condition={typeof currentType !== 'undefined'}>
					<div>
						<PostcodeSelector	currentPostcode			= {this.state.postcode}
											handleSelectPostcode	= {this.handleSelectPostcode}
											handleEscapePostcode	= {this.handleEscapePostcode}
						/>
						<AutoComplete
							serviceFilter	= { this.serviceSchoolFilter }
							serverField		= "name"
							onSelect		= { this.onSelectSchool }
							placeholder		= "school's name"
							defaultItem		= { {name: schoolName} }
						/>
						{message}
					</div>
				</If>
				{/**
				 * If select school and role equal parent, show this block
				  * Block "Select house", availible only for parent
				 */}
				<If condition={typeof this.props.schoolId !== 'undefined' && currentType === 'parent'}>
					<AutoComplete
						serviceFilter	= { this.serviceHouseFilter }
						serverField		= "name"
						onSelect		= { this.onSelectHouse }
						placeholder		= "house's name"
						defaultItem		= {{name: houseName}}
					/>
				</If>
				{/**
				 * If select school, house and role equal parent, show this block
				 * Block "Select form", availible only for parent
				 */}
				<If condition={typeof this.props.houseId !== 'undefined' && currentType === 'parent'}>
					<AutoComplete
						serviceFilter	= { this.serviceFormFilter }
						serverField		= "name"
						onSelect		= { this.onSelectForm }
						placeholder		= "form's name"
						defaultItem		= {{name: formName}}
					/>
				</If>
				{/**
				 * If select school, house, form and role equal parent, show this block
				 * Block "First name"/"Last Name" child, availible only for parent
				 */}
				<If condition={typeof this.props.formId !== 'undefined' && currentType === 'parent'}>
					<div>
						<div className="eRegistration_input">
							<input
								ref				= "firstNameField"
								placeholder		= "first name"
								type			= { 'text' }
								value			= { this.props.firstName }
								onChange		= { this.onChangeFirstName }
							/>
						</div>
						<div className="eRegistration_input">
							<input
								ref				= "lastNameField"
								placeholder		= "last name"
								type			= { 'text' }
								value			= { this.props.lastName }
								onChange		= { this.onChangeLastName }
							/>
						</div>
					</div>
				</If>
				{/**
				 * If select role, show this block
				 * Block "Comment", availible for all roles
				 */}
				<If condition={typeof this.props.schoolId !== 'undefined'}>
					<div>
						<div className="eRegistration_input">
							<textarea
								value={ this.props.comment }
								placeholder="Comment"
								onChange={this.onChangeComment}
							/>
						</div>
					</div>
				</If>
				{/**
				 * If select school and role equal admin, show this block
				 * Block "Promo", availible only admin
				 */}
				<If condition={typeof this.props.schoolId !== 'undefined' && currentType === 'admin'}>
					<div>
						<div className="eRegistration_input">
							<input
								ref				= "promo"
								placeholder		= "promo"
								type			= {'text'}
								onChange		= { this.onChangePromo }
								value			= { this.props.promo }
							/>
						</div>
					</div>
				</If>
			</div>
		)
	}
});

module.exports = PermissionDetails;