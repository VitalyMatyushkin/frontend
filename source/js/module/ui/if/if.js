// @flow

'use strict';
const React = require('react');

const If = React.createClass({
    propTypes: {
        condition: React.PropTypes.bool.isRequired
    },
    render: function() {
        return this.props.condition === true ? this.props.children : null ;
    }
});

module.exports = If;