var Table,
	If = require('module/ui/if/if'),
    GrantRole = require('module/as_admin/pages/admin_schools/admin_comps/grant_role'),
    Popup = require('module/ui/popup');
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
        onItemQuickEdit:React.PropTypes.func,
        quickEditActions: React.PropTypes.array,
        displayActionText: React.PropTypes.bool
	},
    getDefaultProps:function(){
        return{
            displayActionText:true
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

		self.props.onFilterChange && self.props.onFilterChange(self.filter);
	},
    getQuickEditActions:function(){
        var self = this,
            el = self.props.quickEditActions;
        if(el !== undefined){
            return el.map(function(action){
                return (
                    <div onClick={function(event){self.defaultQuickActionMethod(event)}} className="eQuickAction_item">{action}</div>
                );
            });
        }
    },
    //default actions for quick edits
    defaultQuickActionMethod:function(evt){
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            userId = [];
            userId.push(evt.currentTarget.parentNode.dataset.userobj);
        switch (evt.currentTarget.innerText){
            case 'Add Role':
                rootBinding.set('popup',true);
                rootBinding.set('groupIds',userId);
                self.forceUpdate();
                break;
            case 'Revoke All Roles':
                self._revokeAllRoles(userId);
                break;
            case 'Unblock':
                self._accessRestriction(userId,0);
                break;
            case 'Block':
                self._accessRestriction(userId,1);
                break;
            default :
                break;
        }
    },
    _revokeAllRoles:function(ids){
        var self = this;
        if(ids !== undefined && ids.length >= 1){
            ids.forEach(function(id){
                window.Server.Permissions.get({filter:{where:{principalId:id}}})
                    .then(function (res) {
                        res.forEach(function(p){
                            window.Server.Permission.delete({id:p.id}).then(function(response){
                                console.log(response);
                                window.location.reload(true);
                            });
                        });
                    });
            });
        }
    },
    _accessRestriction:function(ids,action){
        var self = this;
        if(ids !== undefined && ids.length >= 1){
            switch(action){
                case 0:
                    ids.forEach(function(id){
                        window.Server.user.put({id:id},{blocked:false}).then(function(res){
                            //console.log(res);
                            window.location.reload(true);
                        });
                    });
                    break;
                case 1:
                    ids.forEach(function(id){
                        window.Server.user.put({id:id},{blocked:true}).then(function(res){
                            //console.log(res);
                            window.location.reload(true);
                        });
                    });
                    break;
                default :
                    break;
            }
        }
    },
    _closePopup:function(){
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding();
        rootBinding.set('popup',false);
        self.forceUpdate();
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
			dataList = binding.toJS(),
			tableHeadFields,
            quickActions = self.getQuickEditActions(),
			itemsNodes;
		if (dataList) {
			itemsNodes = dataList.map(function (item) {
				var itemCells,
					itemButtons = [],
					getEditFunction = function() { return function(event) { self.props.onItemEdit(item); event.stopPropagation();}},
					getViewFunction = function() { return function(event) { self.props.onItemView(item); event.stopPropagation();}},
					getRemoveFunction = function() { return function(event) { self.props.onItemRemove(item); event.stopPropagation();}},
                    getQuickEditFunction = function(){return function(event){self.props.onItemQuickEdit(item,event);event.stopPropagation();}};

				self.props.onItemEdit && itemButtons.push(<span onClick={getEditFunction()} className="bLinkLike">Edit</span>);
				self.props.onItemView && self.props.displayActionText && itemButtons.push(<span onClick={getViewFunction()} className="bLinkLike">View</span>);
				self.props.onItemRemove && itemButtons.push(<span onClick={getRemoveFunction()} className="bLinkLike">Remove</span>);
                self.props.onItemQuickEdit && itemButtons.push(<span onClick={getQuickEditFunction()} className="bLinkLike edit_btn">Edit
                    <span className="caret caret_down"></span><span data-userobj={item.id} className="eQuickAction_list">{quickActions}</span></span>);

				itemCells = React.Children.map(self.props.children, function(child) {
					var dataField = child.props.dataField,
						value = item[dataField];

					if (child.props.parseFunction) {
						value = child.props.parseFunction(value);
					}

					if (child.props.filterType === 'colors') {
						value = value.map(function(useColor){
							return <div className="eDataList_listItemColor" style={{background: useColor}}></div>
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
						<div className="eDataList_listItemCell">{value}</div>
					);
				});

				return (
					<div className="eDataList_listItem" onClick={self.props.onItemView && getViewFunction()}>

						{itemCells}
						<If condition={self.props.hideActions !== true}>
							<div className="eDataList_listItemCell mActions">
								{itemButtons}
							</div>
						</If>
					</div>
				);
			});

			tableHeadFields = React.Children.map(this.props.children, function (child) {
				return React.addons.cloneWithProps(child, {
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
            <Popup binding={rootBinding} stateProperty={'popup'} onRequestClose={function(){self._closePopup()}} otherClass="bPopupGrant">
                <GrantRole binding={rootBinding}/>
            </Popup>
		</div>
		)
	}
});

module.exports = Table;
