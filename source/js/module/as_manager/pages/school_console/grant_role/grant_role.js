/**
 * Created by Anatoly on 09.03.2016.
 */

const   Form        = require('module/ui/form/form'),
        FormField 	= require('module/ui/form/form_field'),
        React       = require('react'),
        classNames  = require('classnames'),
        roleList    = require('module/data/roles_data');

const GrantRole = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes: {
        userIdsBinding: React.PropTypes.object,
        onSuccess:      React.PropTypes.func
    },
    componentWillMount:function(){
        const   self    = this,
                ids     = self.props.userIdsBinding.toJS();

        if(!ids)
            console.error('Error! "userIdsBinding" is not set.');
    },
    componentWillUnmount:function(){
        this.getDefaultBinding().clear();
    },
    getStudents:function(filter){
        const   self        = this,
                rootBinding = self.getMoreartyContext().getBinding(),
                activeSchoolId = rootBinding.get('userRules.activeSchoolId');

        return window.Server.schoolStudents.filter(activeSchoolId, filter);
    },
    continueButtonClick:function(model){
        const   self        = this,
                rootBinding = self.getMoreartyContext().getBinding(),
                activeSchoolId = rootBinding.get('userRules.activeSchoolId');

        let ids = self.props.userIdsBinding.toJS();
        ids = ids && typeof ids === 'string' ? [ids] : ids;

        ids.forEach(function(currentId){
            let body;

            switch(model.preset) {
                case 'parent':
                    body = {
                        preset:     model.preset,
                        schoolId:   model.schoolId,
                        studentId:  model.studentId
                    };
                    break;
                default:
                    body = {
                        preset:     model.preset,
                        schoolId:   model.schoolId
                    };
                    break;
            }

            window.Server.userPermissions.post(currentId, body)
                .then(function(result){
                    return self.props.onSuccess && self.props.onSuccess(result);
                });

        });
    },
    render:function(){
        const   self        = this,
                binding     = self.getDefaultBinding(),
                isParent    = binding.meta('preset.value').toJS() === 'parent';

        return (
            <Form name="New Permission" updateBinding={true} binding={binding} onSubmit={self.continueButtonClick}
                  formStyleClass="bGrantContainer" defaultButton="Submit">
                <FormField type="select" field="preset" sourceArray={roleList} >Role</FormField>
                <FormField type="autocomplete" field="studentId" serverField="fullName" serviceFullData={self.getStudents}
                           fieldClassName={classNames({mHidden:!isParent})} >Student</FormField>
                <FormField type="textarea" field="comment" validation="alphanumeric" >Comment</FormField>
            </Form>
        );
    }
});

module.exports = GrantRole;