/**
 * Created by bridark on 16/07/15.
 */
    //TODO: Add filtering
const   React       = require('react'),
        ReactDOM    = require('reactDom'),
        Immutable   = require('immutable');

const LogPagination = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        filterActive: React.PropTypes.bool,
        filterMode: React.PropTypes.string
    },
    getInitialState:function(){
        return {perPage:''};
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        //window.Server.logCount.get().then(function (count) {
        //   binding.set('logCount',count);
        //    self._setPageCount();
        //    self._populateSelectOptions();
        //});
    },
    _setPageCount:function(per){
        var self = this,
            binding = self.getDefaultBinding(),
            pageCount = binding.get('logCount'),
            pageLimit = per !== undefined ? per : 40;
        binding.set('numPages',Math.floor(pageCount.count/pageLimit));
        self.requestLimit = pageLimit;
    },
    _setNumOfLogsPerPage:function(limit){
        var self = this,
            binding = self.getDefaultBinding();
        if(self.props.filterActive === false){
            window.Server.activityLogs.get({filter:{limit:limit}}).then(function (res) {
                binding
                    .atomically()
                    .set('logs',Immutable.fromJS(res))
                    .commit();
                self._setPageCount(limit);
                self._populateSelectOptions();
                self.setState({perPage:limit});
            });
        }else{
            window.Server.activityLogs.get({filter:{order:self.props.filterMode,limit:limit}}).then(function (res) {
                binding
                    .atomically()
                    .set('logs',Immutable.fromJS(res))
                    .commit();
                self._setPageCount(limit);
                self._populateSelectOptions();
                self.setState({perPage:limit});
            });
        }
    },
    _populateSelectOptions:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            selectEl = React.findDOMNode(self.refs.pageSelect),
            pages = binding.get('numPages');
        selectEl.options.length = 0;
        for(var i=1; i<pages; i++){
            var option = document.createElement('option');
            option.text = i;
            option.value = i;
            selectEl.add(option);
        }
    },
    _handleSelectChange:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            amt = self.requestLimit,
            el = React.findDOMNode(self.refs.pageSelect),
            optVal = el.options[el.selectedIndex].value,
            skipLimit = optVal >= 2 ? (optVal - 1) * self.requestLimit  : 0;
        if(self.props.filterActive === false){
            window.Server.activityLogs.get({
                filter:{
                    limit:amt,
                    skip: skipLimit
                }
            }).then(function (res) {
                binding
                    .atomically()
                    .set('logs',Immutable.fromJS(res))
                    .commit();
                //self._setPageCount(skipLimit);
            });
        }else{
            window.Server.activityLogs.get({
                filter:{
                    order:self.props.filterMode,
                    limit:amt,
                    skip: skipLimit
                }
            }).then(function (res) {
                binding
                    .atomically()
                    .set('logs',Immutable.fromJS(res))
                    .commit();
                //self._setPageCount(skipLimit);
            });
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            logPerPage = self.state.perPage;
        return (
            <div className="ePagination_container">
                <div className="ePage_num">
                    Logs per page :
                    <span className={logPerPage === 20 ? 'perActive':'perInActive'} onClick={function(){self._setNumOfLogsPerPage(20)}}>20</span>
                    <span className={logPerPage === 60 ? 'perActive':'perInActive'} onClick={function(){self._setNumOfLogsPerPage(60)}}>60</span>
                    <span className={logPerPage === 100 ? 'perActive':'perInActive'} onClick={function(){self._setNumOfLogsPerPage(100)}}>100</span>
                </div>
                <div className="ePage_limit">
                    <span>Page</span>
                    <select ref="pageSelect" onChange={self._handleSelectChange.bind(null,this)}>
                    </select>
                    <span>out of {}</span>
                </div>
            </div>
        );
    }
});
module.exports = LogPagination;