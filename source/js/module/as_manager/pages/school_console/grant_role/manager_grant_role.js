/**
 * Created by Anatoly on 11.03.2016.
 */

const   GrantRole  = require('module/as_admin/pages/admin_schools/admin_comps/admin_grant_role'),
        React         = require('react'),

ManagerGrantRole = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes: {
        userIdsBinding:     React.PropTypes.object,
        onSuccess:          React.PropTypes.func
    },
    render:function(){
        const   self        = this,
                binding     = self.getDefaultBinding();

        return (
            <GrantRole userIdsBinding={self.props.userIdsBinding} onSuccess={self.props.onSuccess} binding={binding}
                       studentFieldProps={self.props.studentFieldProps} schoolsFilter={window.Server.getMaSchools.filter} />
        );
    }
});

module.exports = ManagerGrantRole;