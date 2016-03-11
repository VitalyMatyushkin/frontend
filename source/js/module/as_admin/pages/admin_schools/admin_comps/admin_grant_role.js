/**
 * Created by Anatoly on 11.03.2016.
 */

const   GrantRole  = require('module/ui/grant_role/grant_role'),
        React         = require('react'),

AdminGrantRole = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes: {
        userIdsBinding:     React.PropTypes.object,
        onSuccess:          React.PropTypes.func,
        schoolsFilter:      React.PropTypes.func
    },
    getDefaultProps: function() {
        return {
            schoolsFilter: window.Server.getAllSchools.filter
        };
    },
    onSuccess:function(permission){
        const self = this;

        if(permission.preset === 'parent' && permission.studentId || permission.preset !== 'parent')
            return window.Server.setPermissions.post({id:permission.id},{accepted:true})
                .then(function(setPermissions){
                    return self.props.onSuccess && self.props.onSuccess(setPermissions);
                });

        return self.props.onSuccess && self.props.onSuccess(permission);
    },
    getStudents:function(filter){
        const   self        = this,
                binding     = self.getDefaultBinding(),
                schoolId    = binding.meta('schoolId.value').toJS();
        return window.Server.students.filter(schoolId, filter);
    },
    render:function(){
        const   self        = this,
                binding     = self.getDefaultBinding(),
                studentFieldProps = {
                    type:"autocomplete",
                    field:"studentId",
                    serverField:"fullName",
                    serviceFullData: this.getStudents
                    };

        return (
            <GrantRole userIdsBinding={self.props.userIdsBinding} onSuccess={self.onSuccess} binding={binding}
                       studentFieldProps={studentFieldProps} schoolsFilter={self.props.schoolsFilter} />
        );
    }
});

module.exports = AdminGrantRole;