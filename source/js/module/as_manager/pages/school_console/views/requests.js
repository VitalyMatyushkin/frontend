/**
 * Created by bridark on 19/06/15.
 */
const   React       = require('react'),
        LiveRequest = require('module/as_admin/pages/admin_schools/admin_views/admin_requests'),

SchoolRequest = React.createClass({
    mixins: [Morearty.Mixin],
    render:function(){
        const self = this,
            binding = self.getDefaultBinding();

        return (
            <LiveRequest serviceName="schoolPermissions" serviceCount="schoolPermissionsCount" binding={binding} />
        );
    }
});
module.exports = SchoolRequest;