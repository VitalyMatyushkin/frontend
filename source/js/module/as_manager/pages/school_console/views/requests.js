/**
 * Created by bridark on 19/06/15.
 */
const   React       = require('react'),
        LiveRequest = require('module/shared_pages/permission_requests/request-list'),
        Morearty	= require('morearty');

const SchoolRequest = React.createClass({
    mixins: [Morearty.Mixin],
    render:function(){
        const self = this,
            binding = self.getDefaultBinding();

        return (
            <LiveRequest binding={binding} />
        );
    }
});
module.exports = SchoolRequest;