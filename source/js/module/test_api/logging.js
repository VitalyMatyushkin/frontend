/**
 * Created by Vitaly on 12.07.17.
 */
const	React       = require('react'),
        classNames  = require('classnames');

const ERROR = "error";

const Logging = React.createClass({
    propTypes: {
      type: React.PropTypes.string
    },

    render: function() {
        let classLog = this.props.type === ERROR ? "errorLog" : "messageLog";

        return (
            <div className={classNames("logBlock", classLog)}>
                {this.props.log.split('\n').map((item, i) =>
                    <div key={i}>{item}</div>
                )}
            </div>
        );
    }
});

module.exports = Logging;