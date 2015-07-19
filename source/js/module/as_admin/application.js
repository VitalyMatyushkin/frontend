/**
 * Created by bridark on 04/06/15.
 */
var HeadView = require('module/as_admin/head'),
    CenterView = require('module/as_admin/center'),
    ApplicationView;

ApplicationView = React.createClass({
    mixins: [Morearty.Mixin],
    render: function() {
        var self = this,
            binding = self.getDefaultBinding();

        return (
            <div>
                <HeadView binding={binding} />
                <CenterView binding={binding} />
            </div>
        );
    }
});


module.exports = ApplicationView;