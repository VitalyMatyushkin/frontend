var Table,
	If = require('module/ui/if/if');

Table = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string,
		onAddNew: React.PropTypes.func,
		onItemEdit: React.PropTypes.func,
		onItemView: React.PropTypes.func,
		onItemRemove: React.PropTypes.func,
		onFilterChange: React.PropTypes.func,
		hideActions: React.PropTypes.bool
	},
	componentWillMount: function() {
		var self = this;

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
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			dataList = binding.toJS(),
			tableHeadFields,
			itemsNodes;

		if (dataList) {
			itemsNodes = dataList.map(function (item) {
				var itemCells,
					itemButtons = [],
					getEditFunction = function() { return function(event) { self.props.onItemEdit(item); event.stopPropagation();	} },
					getViewFunction = function() { return function(event) { self.props.onItemView(item); event.stopPropagation();	} },
					getRemoveFunction = function() { return function(event) { self.props.onItemRemove(item); event.stopPropagation();	} };

				self.props.onItemEdit && itemButtons.push(<span onClick={getEditFunction()} className="bLinkLike">Edit</span>);
				self.props.onItemView && itemButtons.push(<span onClick={getViewFunction()} className="bLinkLike">View</span>);
				self.props.onItemRemove && itemButtons.push(<span onClick={getRemoveFunction()} className="bLinkLike">Remove</span>);

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
					onChange: self.updateFilterState
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
