/**
 * Created by bridark on 15/07/15.
 */
var ActivityLogPage,
    SVG = require('module/ui/svg'),
    UserLogs = require('../admin_comps/user_logs'),
    LogPagination = require('../admin_comps/log_pagination');
ActivityLogPage = React.createClass({
    mixins:[Morearty.Mixin],
    getDefaultState: function () {
        return Immutable.fromJS({
            logs:[]
        });
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        window.Server.activityLogs.get({filter:{limit:40}}).then(function (res) {
            binding
                .atomically()
                .set('logs',Immutable.fromJS(res))
                .commit();
        });
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            logData = binding.get('logs').toJS();
        return (
            <div className="eLogDataList">
                <div className="eLogDataList_header">
                    <span><SVG icon="icon_stats-dots"/> ACTIVITY LOGS</span>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th className="eLogDateTime">Time</th><th>Method</th><th>Response Time</th><th>Status Code</th>
                            <th>IP</th><th>Referrer</th><th>Scope</th><th>Device</th>
                        </tr>
                    </thead>
                    <UserLogs logData={logData} binding={binding} />
                </table>
                <LogPagination binding={binding} />
            </div>
        );
    }
});
module.exports = ActivityLogPage;