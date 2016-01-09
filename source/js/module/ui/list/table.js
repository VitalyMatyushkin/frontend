const   If          = require('module/ui/if/if'),
        Pagination  = require('module/ui/list/pagination'),
        Filter      = require('module/ui/list/filter'),
        React       = require('react'),
        ReactDOM    = require('reactDom');

const Table = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string,
		onAddNew: React.PropTypes.func,
		onItemEdit: React.PropTypes.func,
		onItemView: React.PropTypes.func,
		onItemRemove: React.PropTypes.func,
        onFilterChange: React.PropTypes.func,
        getDataPromise: React.PropTypes.func,
        getTotalCountPromise: React.PropTypes.func,
        isPaginated: React.PropTypes.bool,
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

        self.filter = new Filter(binding);
        self.filter.isPaginated = self.props.isPaginated;

        self._oldFilters = {}; // old functional filters
	},
    updateFilterState: function(field, value) {
        var self = this;

        self._oldUpdateFilterState(field, value);

        self.filter.setFileldFilter(field, value);
    },
    onSort: function(field, value) {
        var self = this;

        _oldUpdateFilterState(field, value);

        self.filter.setOrder(field, value);
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
