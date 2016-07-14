/**
 * Created by bridark on 19/06/15.
 */
const   AdminArchive    = require('module/as_admin/pages/admin_schools/admin_views/admin_archive'),
        Morearty	    = require('morearty'),
        React           = require('react');

const SchoolRequestArchive = React.createClass({
    mixins:[Morearty.Mixin],
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return(
            <AdminArchive binding={binding} serviceName="permissionRequests" serviceCount="permissionRequestsCount"/>
        )
    }
});
module.exports = SchoolRequestArchive;