/**
 * Created by Vitaly on 12.07.17.
 */
const	React = require('react');

const Logging = React.createClass({
    render: function() {
        let colorBlock = this.props.type === "err" ? "#FFA07A" : "#98FB98";
        const divStyle = {
            background: colorBlock,
            padding: "5px",
            margin: "3px"
        };
        return (
            <div style={divStyle}>
                {this.props.log.split('\n').map((item, i) =>
                    <div key={i}>{item}</div>
                )}
            </div>
        );
    }
});

module.exports = Logging;