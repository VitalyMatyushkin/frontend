/**
 * Created by bridark on 15/07/15.
 */
var UserLogs,
    DateTimeMixin = require('module/mixins/datetime');
UserLogs = React.createClass({
    mixins:[Morearty.Mixin,DateTimeMixin],
    propTypes:{
      logData: React.PropTypes.array.isRequired
    },
    _renderLogData:function(data){
        var self = this;
        if(data.length !== undefined){
            return data.map(function(log){
                return <tr key={log.id}>
                    <td>{self.getTimeFromIso(log.meta.created) + ' \r\n[ '+self.getDateFromIso(log.meta.created)+']' }</td>
                    <td>{log.method}</td>
                    <td>{log.responseTime}</td>
                    <td>{log.statusCode}</td><td>{log.ip}</td>
                    <td>{log.referer}</td>
                    <td>{log.scope}</td><
                    td>{log.message.split(' ')[8]}</td>
                </tr>
            });
        }
    },
    render:function(){
        var self = this,
            logList = self._renderLogData(self.props.logData);
        return (
            <tbody>
                {logList}
            </tbody>
        );
    }
});
module.exports = UserLogs;