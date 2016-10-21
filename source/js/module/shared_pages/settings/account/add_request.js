/**
 * Created by Anatoly on 21.04.2016.
 */

const   Form        = require('module/ui/form/form'),
        FormField 	= require('module/ui/form/form_field'),
        React       = require('react'),
        Morearty    = require('morearty'),
        Immutable   = require('immutable'),
        classNames  = require('classnames'),
        roleList    = require('module/data/roles_data');

const AddPermissionRequest = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes: {
        onSuccess:          React.PropTypes.func
    },
    getDefaultState:function() {
        return Immutable.Map({
            preset:         '',
            schoolId:       '',
            comment:        ''
        });
    },
    componentWillUnmount:function(){
        this.getDefaultBinding().clear();
    },
    continueButtonClick:function(model){
        const self = this;

        if(model.studentName)
            model.comment = `Request to be parent of [ ${model.studentName} ] \r\n` + model.comment;

        window.Server.profileRequests.post(model)
            .then(function(result){
                return self.props.onSuccess && self.props.onSuccess(result);
            });
    },
    isSchoolSelected: function() {
        const binding = this.getDefaultBinding();

        return binding.meta().toJS('schoolId.value') !== '';
    },
    getPlaceHolderForRoleSelect: function() {
        return this.isSchoolSelected() ? 'Please select role' : "Please select school";
    },
    isRoleSelectDisabled: function() {
        return !this.isSchoolSelected();
    },
    render: function() {
        const   self        = this,
                binding     = self.getDefaultBinding(),
                getSchools  = window.Server.publicSchools.filter,
                isParent    = binding.meta('preset.value').toJS() === 'parent' && binding.meta('schoolId.value').toJS();

        console.log(this.isRoleSelectDisabled());

        return (
            <Form   name            = "New Request"
                    updateBinding   = { true }
                    binding         = { binding }
                    onSubmit        = { self.continueButtonClick }
                    formStyleClass  = "bGrantContainer"
                    defaultButton   = "Submit"
            >
                <FormField type             = "autocomplete"
                           field            = "schoolId"
                           serviceFullData  = {getSchools}
                           validation       = "required"
                >
                    School
                </FormField>
                <FormField type         = "select"
                           field        = "preset"
                           sourceArray  = {roleList}
                           placeHolder  = {this.getPlaceHolderForRoleSelect()}
                           isDisabled   = {this.isRoleSelectDisabled()}
                >
                    Role
                </FormField>
                <FormField type             = "text"
                           field            = "studentName"
                           fieldClassName   = {classNames({mHidden:!isParent})}
                >
                    Student
                </FormField>
                <FormField type         = "textarea"
                           field        = "comment"
                           validation   = "alphanumeric"
                >
                    Comment
                </FormField>
            </Form>
        );
    }
});

module.exports = AddPermissionRequest;