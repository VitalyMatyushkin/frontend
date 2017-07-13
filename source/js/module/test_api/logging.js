/**
 * Created by Vitaly on 12.07.17.
 */
const	React = require('react');

const Logging = React.createClass({
    render: function() {
        let colorBlock = this.props.type === "err" ? "#FFA07A" : "#98FB98";
        const divStyle = {
            background: colorBlock,
            padding: "5px"
        };
        return (
            <div style={divStyle}>
                {this.props.log}
            </div>
        );
    }
});

module.exports = Logging;