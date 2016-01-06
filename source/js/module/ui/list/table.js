var Table,
	If = require('module/ui/if/if'),
    React = require('react'),
    ReactDOM = require('reactDom');
Table = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string,
		onAddNew: React.PropTypes.func,
		onItemEdit: React.PropTypes.func,
		onItemView: React.PropTypes.func,
		onItemRemove: React.PropTypes.func,
		onFilterChange: React.PropTypes.func,
		hideActions: React.PropTypes.bool,
        quickEditActionsFactory:React.PropTypes.func, //Implement your own factory of methods to be applied to quick actions
        quickEditActions: React.PropTypes.array,
        displayActionText: React.PropTypes.bool,
        addQuickActions: React.PropTypes.bool
	},
    getDefaultProps:function(){
        return{
            displayActionText:true,
            addQuickActions: false
        }
    },
	componentWillMount: function() {
		var self = this,
            rootBinding = self.getMoreartyContext().getBinding();
        rootBinding.set('popup',false);
		self.filter = {};
		self.usedFields = [];
	},
	updateFilterState: function(field, value) {
		var self = this;
		if (value) {
			self.filter[field] = value;
		} else {
			delete self.filter[field];
		}
        if(Object.keys(self.filter).length >1){
            var keyToDel =Object.keys(self.filter)[0];
            delete self.filter[keyToDel];
        }
		self.props.onFilterChange && self.props.onFilterChange(self.filter);
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
			dataList = binding.toJS(),
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
                self.props.addQuickActions && itemButtons.push(<span key={item.id+'quickEd'} onClick={getQuickEditFunction()} className="bLinkLike edit_btn">Edit
                    <span className="caret caret_down"/><span data-userobj={item.id+'quickAc'} className="eQuickAction_list">{quickActions}</span></span>);

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
                            <div  className="eDataList_listItemCell">
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
                    onSort:self.updateFilterState
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
		</div>
		)
	}
});

module.exports = Table;
