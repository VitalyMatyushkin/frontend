/**
 * Created by Vitaly on 12.07.17.
 */
const	React = require('react');

const Logging = React.createClass({
    render: function() {
        return (
            <div>
                {this.props.log}
            </div>
        );
    }
});

module.exports = Logging;