/**
 * Created by Anatoly on 09.03.2016.
 */

const   Form        = require('module/ui/form/form'),
        FormField 	= require('module/ui/form/form_field'),
        React       = require('react'),
        Morearty    = require('morearty'),
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
            binding     = self.getDefaultBinding(),
            schoolId    = binding.meta('schoolId.value').toJS();

        return window.Server.schoolStudents.filter(schoolId, filter);
    },
    continueButtonClick:function(model){
        let ids = this.props.userIdsBinding.toJS();
        ids = ids && typeof ids === 'string' ? [ids] : ids;

        ids.forEach(currentId => {
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

			if((model.preset === 'parent' && typeof model.studentId !== 'undefined') || model.preset !== 'parent') {
				window.Server.userPermissions.post(currentId, body)
					.then(result => this.props.onSuccess && this.props.onSuccess(result));
			}
        });
    },
    render:function(){
        const   self        = this,
                binding     = self.getDefaultBinding(),
                isParent    = binding.meta('preset.value').toJS() === 'parent' && binding.meta('schoolId.value').toJS();

        return (
            <Form name="New Permission" updateBinding={true} binding={binding} onSubmit={self.continueButtonClick}
                  formStyleClass="bGrantContainer" defaultButton="Submit">
                <FormField type="autocomplete" field="schoolId" serviceFullData={window.Server.publicSchools.filter} >School</FormField>
                <FormField type="select" field="preset" sourceArray={roleList} >Role</FormField>
                <FormField type="autocomplete" field="studentId" serverField="fullName" serviceFullData={self.getStudents}
                           fieldClassName={classNames({mHidden:!isParent})} >Student</FormField>
                <FormField type="textarea" field="comment" validation="alphanumeric" >Comment</FormField>
            </Form>
        );
    }
});

module.exports = GrantRole;