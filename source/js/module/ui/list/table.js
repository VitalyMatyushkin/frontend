const   If          = require('module/ui/if/if'),
        Pagination  = require('module/ui/list/pagination'),
        Filter      = require('module/ui/list/filter'),
        React       = require('react'),
        Immutable   = require('immutable');

const Table = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string,
        filter: React.PropTypes.object,
		onAddNew: React.PropTypes.func,
		onItemEdit: React.PropTypes.func,
		onItemView: React.PropTypes.func,
		onItemRemove: React.PropTypes.func,
        onFilterChange: React.PropTypes.func,
        getDataPromise: React.PropTypes.func,
        getTotalCountPromise: React.PropTypes.func,
        isPaginated: React.PropTypes.bool,
        pageLimit: React.PropTypes.number,
        hideActions: React.PropTypes.bool,
        quickEditActionsFactory:React.PropTypes.func, //Implement your own factory of methods to be applied to quick actions
        quickEditActions: React.PropTypes.array,
        displayActionText: React.PropTypes.bool,
        addQuickActions: React.PropTypes.bool
	},
    getDefaultProps:function(){
        return{
            displayActionText:true,
            addQuickActions: false,
            isPaginated:false
        }
    },
	componentWillMount: function() {
		var self = this,
            binding = self.getDefaultBinding();

        self.filter = self.props.filter;
        if(!self.filter)
            self.filter = new Filter(binding.sub('filter'));

        self.props.isPaginated && self.filter.setPageLimit(self.props.pageLimit);

        self._oldFilters = {}; // old functional filters

        self._loadData();
        self._getTotalCount();
	},
    componentDidMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        this.addBindingListener(binding, 'pagination.pageNumber', self._onChangePage);
        this.addBindingListener(binding, 'filter',self._loadData);
        this.addBindingListener(binding, 'filter.where',self._getTotalCount);
        this.addBindingListener(binding, 'onReload',self.onReload);
    },
    componentWillUnmount: function () {
        var self = this,
            binding = self.getDefaultBinding();
        self.request && self.request.cancel();
        self.requestCount && self.requestCount.cancel();
        binding.clear();
    },
    updateFilterState: function(field, value) {
        var self = this;

        self._oldUpdateFilterState(field, value);

        if(self.props.getDataPromise){
            self.filter.addFieldFilter(field, value);
        }
    },
    onSort: function(field, value) {
        var self = this;

        self._oldUpdateFilterState(field, value);

        if(self.props.getDataPromise) {
            self.filter.setOrder(field, value.order);
        }
    },
    _onChangePage:function(changes){
        var self = this;

        self.filter.setPageNumber(changes.getCurrentValue());
    },
    _loadData:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            filter = self.filter.getFilters();
        console.log('Table load data started');
        if(self.props.getDataPromise) {
            self.request = self.props.getDataPromise(filter).then(function (data) {
                binding.set('data', Immutable.fromJS(data));
            });
        }
    },
    _getTotalCount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            where = self.filter.getWhere();

        if(self.props.getTotalCountPromise) {
            self.requestCount = self.props.getTotalCountPromise(where).then(function (data) {
                if (data && data.count) {
                    binding.set('pagination.totalCount', data.count);
                }
            });
        }
    },
    onReload:function(){
        const self = this,
            binding = self.getDefaultBinding(),
            reload = binding.get('onReload');

        if(reload){
            binding.set('onReload', false);
            self._loadData();
            self._getTotalCount();
        }
    },
    _oldUpdateFilterState: function(field, value) {
        var self = this;
        if (value) {
            self._oldFilters[field] = value;
        } else {
            delete self._oldFilters[field];
        }
        if(Object.keys(self._oldFilters).length >1){
            var keyToDel =Object.keys(self._oldFilters)[0];
            delete self._oldFilters[keyToDel];
        }
        self.props.onFilterChange && self.props.onFilterChange(self._oldFilters);
    },
    getQuickEditActions:function(){
        var self = this,
            el = self.props.quickEditActions;
        if(el !== undefined){
            return el.map(function(action, actIn){
                var handleQuickActionClick = function(){return function(event){self.props.quickEditActionsFactory(event); event.stopPropagation();}};
                return (
                    <div key={actIn} onClick={handleQuickActionClick()} className="eQuickAction_item">{action}</div>
                );
            });
        }
    },
    _quickEditMenu:function(model,event){
        var target = event.currentTarget.childNodes[2];
        if(target.classList.contains('groupActionList_show')){
            target.classList.remove('groupActionList_show');
        }else{
            target.classList.add('groupActionList_show');
        }
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			dataList = binding.sub('data').toJS(),
			tableHeadFields,
            quickActions = self.getQuickEditActions(),
			itemsNodes;

        //Hack for a weird bug where instead of @dataList being an empty array if no data is returned by server
        // It sometimes returns an empty object causing the rest of the UI elements to disappear
        if(typeof dataList === 'object' && Object.keys(dataList).length === 0){dataList = []}
        if (dataList) {
            itemsNodes = dataList.map(function (item, itemIndex) {
                var itemCells,
                    itemButtons = [],
                    getEditFunction = function() { return function(event) { self.props.onItemEdit(item); event.stopPropagation();}},
                    getViewFunction = function() { return function(event) { self.props.onItemView(item); event.stopPropagation();}},
                    getRemoveFunction = function() { return function(event) { self.props.onItemRemove(item); event.stopPropagation();}},
                    getQuickEditFunction = function(){return function(event){self._quickEditMenu(item,event);event.stopPropagation();}};

                self.props.onItemEdit && itemButtons.push(<span key={item.id+'edit'} onClick={getEditFunction()} className="bLinkLike">Edit</span>);
                self.props.onItemView && self.props.displayActionText && itemButtons.push(<span key={item.id+'view'} onClick={getViewFunction()} className="bLinkLike">View</span>);
                self.props.onItemRemove && itemButtons.push(<span key={item.id+'remove'} onClick={getRemoveFunction()} className="bLinkLike">Remove</span>);
                self.props.addQuickActions && itemButtons.push(
                    <span key={item.id+'quickEd'} onClick={getQuickEditFunction()} className="bLinkLike edit_btn">
                        Edit
                        <span className="caret caret_down"/>
                        <span key={item.id+'quickAc'} data-userobj={item.id} className="eQuickAction_list">{quickActions}</span>
                    </span>
                );

                itemCells = React.Children.map(self.props.children, function(child, childIndex) {
                    var dataField = child.props.dataField,
                        value = item[dataField];

                    if (child.props.parseFunction) {
                        value = child.props.parseFunction(value);
                    }

                    if (child.props.filterType === 'colors') {
                        value = value.map(function(useColor,clrKey){
                            return <div key={clrKey} className="eDataList_listItemColor" style={{background: useColor}}></div>
                        });
                    }
                    //For checkboxes
                    if(dataField ==='checkBox'){
                        return (
                            <div className="eDataList_listItemCell">
                                <input data-id={item.id} className="tickBoxGroup" type="checkbox"/>
                            </div>);
                    }
                    return (
                        <div key={childIndex} className="eDataList_listItemCell">{value}</div>
                    );
                });

                return (
                    <div key={itemIndex} className="eDataList_listItem" onClick={self.props.onItemView && getViewFunction()}>
                        {itemCells}
                        <If condition={self.props.hideActions !== true}>
                            <div className="eDataList_listItemCell mActions">
                                {itemButtons}
                            </div>
                        </If>
                    </div>
                );
            });
            tableHeadFields = React.Children.map(this.props.children, function (child,index) {
                return React.cloneElement(child, {
                    key:index,
                    onChange: self.updateFilterState,
                    onSort:self.onSort
                });
            });
        }
		return (
		<div className="bDataList">
			<div className="eDataList_list mTable">
				<div className="eDataList_listItem mHead">
					{tableHeadFields}
					<If condition={self.props.hideActions !== true}>
						<div className="eDataList_listItemCell mActions">Actions</div>
					</If>
				</div>
				{itemsNodes}
			</div>
            <If condition={self.props.isPaginated}>
                <Pagination binding={binding.sub('pagination')} />
            </If>
		</div>
		)
	}
});

module.exports = Table;
