/**
 * Created by Woland on 12.01.2017.
 */
const	React 			= require ('react'),
		If				= require('module/ui/if/if'),
		AutoComplete	= require('module/ui/autocomplete2/OldAutocompleteWrapper');



const PermissionFieldsReact = React.createClass({
	propTypes: {
		handlerSelectSchool: 		React.PropTypes.func.isRequired,
		handlerSelectHouse: 		React.PropTypes.func.isRequired,
		handlerSelectForm: 			React.PropTypes.func.isRequired,
		handlerChangeFirstName: 	React.PropTypes.func.isRequired,
		handlerChangeLastName: 		React.PropTypes.func.isRequired,
		handlerChangeComment: 		React.PropTypes.func.isRequired,
		handlerChangePromo: 		React.PropTypes.func.isRequired,
		schoolId:					React.PropTypes.string,
		houseId:					React.PropTypes.string,
		formId:						React.PropTypes.string,
		numberField:				React.PropTypes.string
	},
	/**
	 * school filter by schoolName
	 * @param schoolName
	 * @returns {*}
	 */
	serviceSchoolFilter: function (schoolName) {
		return window.Server.publicSchools.get( {
			filter: {
				where: {
					name: {
						like: schoolName,
						options: 'i'
					},
					/* this param was added later, so it is undefined on some schools. Default value is true.
					 * undefined considered as 'true'. So, just checking if it is not explicitly set to false
					 */
					availableForRegistration: { $ne: false }
				},
				limit: 1000,
				order: 'name ASC'
			}
		});
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

	onSelectSchool: function(schoolId) {
		this.props.handlerSelectSchool(schoolId, this.props.numberField);
	},

	onSelectHouse: function(houseId) {
		window.Server.publicSchoolHouse.get({houseId: houseId, schoolId: this.props.schoolId}).then( house => {
			this.props.handlerSelectHouse(houseId, house.name, this.props.numberField);
		});
	},

	onSelectForm: function(formId) {
		window.Server.publicSchoolForm.get({formId: formId, schoolId: this.props.schoolId}).then(form => {
			this.props.handlerSelectForm(formId, form.name, this.props.numberField);
		});
	},

	onChangeFirstName: function(event) {
		this.props.handlerChangeFirstName(event.currentTarget.value, this.props.numberField);
	},

	onChangeLastName: function(event) {
		this.props.handlerChangeLastName(event.currentTarget.value, this.props.numberField);
	},

	onChangeComment: function(event) {
		this.props.handlerChangeComment(event.currentTarget.value);
	},

	onChangePromo: function(event) {
		this.props.handlerChangePromo(event.currentTarget.value);
	},

	schoolMessage: function () {
		return (
			<div className="eForm_message">
				<span className="margin-right">Haven’t found your school?</span>
				<a className="margin-right" href="mailto:support@squadintouch.com?subject=Please add school">Email us</a>
				<span>and we will add it!</span>
			</div>)
	},

	render: function() {
		const 	currentType		= this.props.type,
				message			= this.schoolMessage();
		return (
			<div>
				<If condition={!!currentType}>
					<div>
						<AutoComplete
							serviceFilter={this.serviceSchoolFilter}
							serverField="name"
							onSelect={this.onSelectSchool}
							placeholder="school's name"
						/>
						{message}
					</div>
				</If>
				<If condition={!!this.props.schoolId && currentType === 'parent'}>
					<AutoComplete
						serviceFilter={this.serviceHouseFilter}
						serverField="name"
						onSelect={this.onSelectHouse}
						placeholder="house's name"
					/>
				</If>
				<If condition={!!this.props.houseId && currentType === 'parent'}>
					<AutoComplete
						serviceFilter={this.serviceFormFilter}
						serverField="name"
						onSelect={this.onSelectForm}
						placeholder="form's name"
					/>
				</If>
				<If condition={!!this.props.formId && currentType === 'parent'}>
					<div>
						<div className="eRegistration_input">
							<input ref="firstNameField" placeholder="first name" type={'text'} onChange={this.onChangeFirstName} />
						</div>
						<div className="eRegistration_input">
							<input ref="lastNameField" placeholder="last name" type={'text'} onChange={this.onChangeLastName} />
						</div>
					</div>
				</If>
				<If condition={!!this.props.schoolId}>
					<div>
						<div className="eRegistration_input">
							<textarea placeholder="Comment" onChange={this.onChangeComment}/>
						</div>
					</div>
				</If>
				<If condition={!!this.props.schoolId && currentType === 'admin'}>
					<div>
						<div className="eRegistration_input">
							<input ref="promo" placeholder="promo" type={'text'} onChange={this.onChangePromo} />
						</div>
					</div>
				</If>
			</div>
		)
	}
});

module.exports = PermissionFieldsReact;
