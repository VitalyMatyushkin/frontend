/**
 * Created by Vitaly on 17.07.17.
 */
const	React = require('react'),
        Logging = require('module/test_api/logging');

const LoggingList = React.createClass({
    getInitialState: function() {
        return {
            visibleLogs: false
        };
    },

    showLogs: function() {
        let visible = this.state.visibleLogs;
        this.setState({visibleLogs: !visible});
    },

    render: function() {
        let logsNode;
        if (this.state.visibleLogs){
            const logs = this.props.logs;
            logsNode = logs.map((log) => {
                return (<Logging log={log.text} key={log.id} type={log.type}/>)
            });
        }
        return (
            <div className="bLogTest">
                <input type="submit" className="bButton" id="show-requests-button" value="Details" onClick={this.showLogs}/>
                {logsNode}
            </div>
        );
    }
});

module.exports = LoggingList;