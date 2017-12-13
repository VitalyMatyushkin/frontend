/**
 * Created by bridark on 15/10/15.
 */
const   {Autocomplete}          = require('module/ui/autocomplete2/OldautocompleteWrapper'),
       	{If}                    = require('module/ui/if/if'),
		Morearty            	= require('morearty'),
        React                   = require('react');
/*
 * Form with fields for permission request
 *
 */
const PermissionFields = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
		type:		React.PropTypes.string
    },
    /**
     * school filter by schoolName
     * @param schoolName
     * @returns {*}
     */
    serviceSchoolFilter: function(schoolName) {
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
    serviceHouseFilter: function(houseName) {
        const binding = this.getDefaultBinding();

        return window.Server.publicSchoolHouses.get(binding.get('schoolId'), {
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
    serviceFormFilter: function(formName) {
        const binding = this.getDefaultBinding();

        return window.Server.publicSchoolForms.get(binding.get('schoolId'), {
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
        const binding = this.getDefaultBinding();
        binding
            .atomically()
            .set('schoolId', schoolId)
            .commit();
    },
    onSelectHouse: function(houseId) {
        const   self    = this,
                binding = self.getDefaultBinding();

        window.Server.publicSchoolHouse.get({houseId: houseId, schoolId: binding.get('schoolId')}).then( house => {
            binding
                .atomically()
                .set('houseId', houseId)
                .set('houseName', house.name)
                .commit();
        });

    },
    onSelectForm: function(formId) {
        const   self    = this,
                binding = self.getDefaultBinding();

        window.Server.publicSchoolForm.get({formId: formId, schoolId: binding.get('schoolId')}).then(form => {
            binding
                .atomically()
                .set('formId', formId)
                .set('formName', form.name)
                .commit();
        });
    },
    onChangeFirstName: function(event) {
        const   self = this,
                binding = self.getDefaultBinding();

        binding.set('firstName', event.currentTarget.value);
    },
    onChangeLastName: function(event) {
        const   self = this,
                binding = self.getDefaultBinding();

        binding.set('lastName', event.currentTarget.value);
    },
	onChangeComment: function(event) {
		const   self = this,
			binding = self.getDefaultBinding();

		binding.set('comment', event.currentTarget.value);
	},
    onChangePromo: function(event) {
        const binding = this.getDefaultBinding();

        binding.set('promo', event.currentTarget.value);
    },    
    schoolMessage: function () {
        return (
            <div className="eForm_message">
                <span className="margin-right">Haven’t found your school?</span>
				<a className="margin-right" href="mailto:support@squadintouch.com?subject=Please add school">Email us</a>
				<span>and we will add it!</span>
            </div>)
    },

    render:function(){
        const   self        = this,
                binding     = self.getDefaultBinding(),
                currentType = self.props.type,
                message     = self.schoolMessage();
        return(
            <div>
				<If condition={!!currentType}>
					<div>
					<Autocomplete
						serviceFilter={self.serviceSchoolFilter}
						serverField="name"
						onSelect={self.onSelectSchool}
						placeholder="school's name"
					/>
						{message}
					</div>
				</If>
				<If condition={!!binding.get('schoolId') && currentType === 'parent'}>
					<Autocomplete
						serviceFilter={self.serviceHouseFilter}
						serverField="name"
						onSelect={self.onSelectHouse}
						placeholder="house's name"
					/>
				</If>
				<If condition={!!binding.get('houseId') && currentType === 'parent'}>
					<Autocomplete
						serviceFilter={self.serviceFormFilter}
						serverField="name"
						onSelect={self.onSelectForm}
						placeholder="form's name"
						binding={binding.sub('_formAutocomplete')}
					/>
				</If>
				<If condition={!!binding.get('formId') && currentType === 'parent'}>
					<div>
						<div className="eRegistration_input">
							<input ref="firstNameField" placeholder="first name" type={'text'} onChange={self.onChangeFirstName} />
						</div>
						<div className="eRegistration_input">
							<input ref="lastNameField" placeholder="last name" type={'text'} onChange={self.onChangeLastName} />
						</div>
					</div>
				</If>
				<If condition={!!binding.get('formId') || !!binding.get('schoolId') && currentType !== 'parent'}>
                    <div>
                        <div className="eRegistration_input">
                            <textarea placeholder="Comment" onChange={self.onChangeComment}/>
                        </div>
                    </div>
				</If>
                <If condition={!!binding.get('schoolId') && currentType === 'admin'}>
                    <div>
                        <div className="eRegistration_input">
                            <input ref="promo" placeholder="promo" type={'text'} onChange={self.onChangePromo} />
                        </div>
                    </div>
                </If>
            </div>
        )
    }
});
module.exports = PermissionFields;