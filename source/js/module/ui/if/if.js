'use strict';
var React = require('react');
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
            return null;
        }
    }
});

module.exports = If;