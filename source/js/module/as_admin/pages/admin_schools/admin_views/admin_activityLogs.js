/**
 * Created by bridark on 15/07/15.
 */
var ActivityLogPage,
    SVG = require('module/ui/svg'),
    UserLogs = require('../admin_comps/user_logs'),
    LogPagination = require('../admin_comps/log_pagination'),
    DateTimeMixin = require('module/mixins/datetime');
ActivityLogPage = React.createClass({
    mixins:[Morearty.Mixin,DateTimeMixin],
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
            binding.set('filterMode','').set('filterActive',false);
        });
    },
    _handleFiltering:function(filter){
        var self = this,
            binding = self.getDefaultBinding(),
            orderString = '';
        switch (filter){
            case 1:
                orderString = 'meta.created DESC';
                binding.set('filterMode',orderString).set('filterActive',true);
                break;
            case 2:
                orderString = 'meta.created ASC';
                binding.set('filterMode',orderString).set('filterActive',true);
                break;
            default :
                //orderString = 'meta.created ASC';
                //binding.set('filterMode',orderString).set('filterActive',true);
                orderString = '';
                break;
        }
        window.Server.activityLogs.get({
            filter:{
                order:orderString,
                limit:40
            }
        }).then(function(res){
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
                <div className="eLogDataList_filtering">
                    <em>Filter by :</em>
                    <span className={binding.get('filterMode') === 'meta.created DESC'? 'perActive':'perInActive'} onClick={function(){self._handleFiltering(1)}}>Latest</span>
                    <span> | </span>
                    <span className={binding.get('filterMode') === 'meta.created ASC'? 'perActive':'perInActive'} onClick={function(){self._handleFiltering(2)}}>Oldest</span>
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
                <LogPagination filterActive={binding.get('filterActive')} filterMode={binding.get('filterMode')} binding={binding} />
            </div>
        );
    }
});
module.exports = ActivityLogPage;