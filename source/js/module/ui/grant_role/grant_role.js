/**
 * Created by Anatoly on 09.03.2016.
 */

const   Form        = require('module/ui/form/form'),
        FormField 	= require('module/ui/form/form_field'),
        React       = require('react'),
        Immutable   = require('immutable'),
        classNames  = require('classnames'),

GrantRole = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes: {
        userIdsBinding:     React.PropTypes.object,
        onSuccess:          React.PropTypes.func,
        studentFieldProps:  React.PropTypes.object,
        schoolsFilter:      React.PropTypes.func
    },
    getDefaultProps: function() {
        return {
            studentFieldProps: {
                type:"text",
                field:"studentName"
            },
            schoolsFilter: window.Server.getAllSchools.filter,
            submitService: window.Server.profileRequests
        };
    },
    getDefaultState:function() {
        return Immutable.Map({
            preset:         '',
            schoolId:       '',
            principalId:    '',
            comment:        ''
        });
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
    continueButtonClick:function(model){
        const self = this,
            service = self.props.submitService;

        let ids = self.props.userIdsBinding.toJS();
        ids = ids && typeof ids === 'string' ? [ids] : ids;

        if(model.studentName)
            model.comment = `Request to be parent of [ ${model.studentName} ] \r\n` + model.comment;

        ids.forEach(function(currentId){
            model.principalId = currentId;
            service.post(model)
                .then(function(result){
                    return self.props.onSuccess && self.props.onSuccess(result);
                });

        });
    },
    render:function(){
        const   self        = this,
                binding     = self.getDefaultBinding(),
                getSchools  = self.props.schoolsFilter,
                isParent    = binding.meta('preset.value').toJS() === 'parent' && binding.meta('schoolId.value').toJS(),
                roleList    = [ {id:'teacher', value:'Teacher'},
                                {id:'coach', value:'Coach'},
                                {id:'parent', value:'Parent'},
                                {id:'admin', value:'School Admin'},
                                {id:'manager', value:'School Manager'}];

        return (
        <Form name="New Request" updateBinding={true} binding={binding} onSubmit={self.continueButtonClick}
              formStyleClass="bGrantContainer" defaultButton="Submit">
            <FormField type="autocomplete" field="schoolId" serviceFullData={getSchools} >School</FormField>
            <FormField type="select" field="preset" sourceArray={roleList} >Role</FormField>
            <FormField {...self.props.studentFieldProps}
                       fieldClassName={classNames({mHidden:!isParent})} >Student</FormField>
            <FormField type="textarea" field="comment" validation="alphanumeric" >Comment</FormField>
        </Form>
        );
    }
});

module.exports = GrantRole;