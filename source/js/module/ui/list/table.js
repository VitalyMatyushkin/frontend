var Table;

Table = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string,
		onAddNew: React.PropTypes.func,
		onItemEdit: React.PropTypes.func,
		onItemView: React.PropTypes.func,
		onItemRemove: React.PropTypes.func
	},
	componentWillMount: function() {
		var self = this;

		self.usedFields = [];
		React.Children.map(self.props.children, function (child) {
			//TODO: Добавить поддержку сборки имени из нескольких полей
			self.usedFields.push(child.props.dataField);
		});

	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			dataList = binding.toJS(),
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


				itemCells = self.usedFields.map(function(field) {
					return (
						<div className="eDataList_listItemCell">{item[field]}</div>
					);
				});

				return (
					<div className="eDataList_listItem" onClick={getViewFunction()}>
						{itemCells}
						<div className="eDataList_listItemCell mActions">
							{itemButtons}
						</div>
					</div>
				);
			});
		}

		return (
		<div className="bDataList">
			<div className="eDataList_list mTable">
				<div className="eDataList_listItem mHead">
					{self.props.children}
					<div className="eDataList_listItemCell mActions">Actions</div>
				</div>
				{itemsNodes}
			</div>
		</div>
		)
	}
});

module.exports = Table;
