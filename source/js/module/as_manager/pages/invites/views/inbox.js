const   Invites         = require('./invite-list'),
        React           = require('react'),
		Morearty		= require('morearty');

/** Component to show all inbox invites */
const InboxView = React.createClass({
    mixins: [Morearty.Mixin],
    render: function() {
        const binding = this.getDefaultBinding();

        return <Invites binding={binding} type="inbox" />;
    }
});


module.exports = InboxView;
