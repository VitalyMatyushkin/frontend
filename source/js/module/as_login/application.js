/**
 * Created by wert on 16.01.16.
 */
const 	HeadView 		= require('module/as_login/head'),
        CenterView 		= require('module/as_login/center'),
        React 			= require('react'),
        Morearty        = require('morearty');

const ApplicationView = React.createClass({
    mixins: [Morearty.Mixin],

    render: function() {
        const binding = this.getDefaultBinding();

        return (
            <div>
                <HeadView binding={binding} />
                <CenterView binding={binding} />
            </div>
        );
    }
});


module.exports = ApplicationView;