'use strict';
var If = React.createClass({
    propTypes: {
        condition: React.PropTypes.bool.isRequired
    },
    render: function() {
        var self = this,
            condition = self.props.condition;

        if (condition) {
           return this.props.children;
        }
        else {
            return false;
        }
    }
});

module.exports = If;