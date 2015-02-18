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
			dataList = binding.get(),
			itemsNodes;

		if (dataList) {
			itemsNodes = dataList.toJS().map(function (item) {
				var itemCells,
					getEditFunction = function() { return function() { self.props.onItemEdit(item);	} },
					getViewFunction = function() { return function() { self.props.onItemView(item);	} },
					getRemoveFunction = function() { return function() { self.props.onItemRemove(item);	} };


				itemCells = self.usedFields.map(function(field) {
					return (
						<div className="eDataList_listItemCell">{item[field]}</div>
					);
				});

				return (
					<div className="eDataList_listItem">
						{itemCells}
						<div className="eDataList_listItemCell mActions">
							<span onClick={getEditFunction()} className="bLinkLike">Edit</span>
							<span onClick={getViewFunction()} className="bLinkLike">View</span>
							<span onClick={getRemoveFunction()} className="bLinkLike">Remove</span>
						</div>
					</div>
				);
			});
		}

		return (
		<div className="bDataList">
			<div className="eDataList_panel">
				<div className="eDataList_title">{self.props.title} <div onClick={self.props.onAddNew} className="bLinkLike">Add new...</div></div>

			</div>
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
