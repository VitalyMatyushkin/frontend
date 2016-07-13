/**
 * Created by bridark on 15/10/15.
 */
const   AutoComplete            = require('module/ui/autocomplete2/OldAutocompleteWrapper'),
        If                      = require('module/ui/if/if'),
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
                    }
                }
            }
        });
    },
    /**
     * house filter by houseName
     * @param houseName
     * @returns {*}
     */
    serviceHouseFilter: function(houseName) {
        const   self    = this,
                binding = self.getDefaultBinding();

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
        const   self    = this,
                binding = self.getDefaultBinding();

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
        const   self        = this,
                binding     = self.getDefaultBinding();
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
    schoolMessage: function () {
        return (
            <div className="eForm_message">
                Haven’t found your school?
				<a href="mailto:support@squadintouch.com?subject=Please add school">Email us</a>
				and we will add it!
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
					<AutoComplete
						serviceFilter={self.serviceSchoolFilter}
						serverField="name"
						onSelect={self.onSelectSchool}
						binding={binding.sub('_schoolAutocomplete')}
						placeholderText="school's name"
						/>
						{message}
					</div>
				</If>
				<If condition={!!binding.get('schoolId') && currentType === 'parent'}>
					<AutoComplete
						serviceFilter={self.serviceHouseFilter}
						serverField="name"
						onSelect={self.onSelectHouse}
						binding={binding.sub('_houseAutocomplete')}
						placeholderText="house's name"
					/>
				</If>
				<If condition={!!binding.get('houseId') && currentType === 'parent'}>
					<AutoComplete
						serviceFilter={self.serviceFormFilter}
						serverField="name"
						onSelect={self.onSelectForm}
						placeholderText="form's name"
						binding={binding.sub('_formAutocomplete')}
					/>
				</If>
				<If condition={!!binding.get('formId') && currentType === 'parent'}>
					<div>
						<div className="eRegistration_input">
							<input ref="firstNameField" placeholder="Firstname" type={'text'} onChange={self.onChangeFirstName} />
						</div>
						<div className="eRegistration_input">
							<input ref="lastNameField" placeholder="Lastname" type={'text'} onChange={self.onChangeLastName} />
						</div>
					</div>
				</If>
            </div>
        )
    }
});
module.exports = PermissionFields;