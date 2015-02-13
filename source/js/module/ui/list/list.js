var List;

List = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string
	},
	componentWillMount: function() {
		var self = this;

		React.Children.map(self.props.children, function (child) {
			//TODO: Добавить поддержку сборки имени из нескольких полей
			self.useNameField = child.props.dataField;
		});

	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			dataList = binding.get(),
			itemsNodes;

		if (dataList) {
			itemsNodes = dataList.toJS().map(function (item) {
				return (
					<a href="#" className="eDataList_listItem">
						{item[self.useNameField]}
					</a>
				);
			});
		}

		return (
			<div className="bDataList">
				<div className="eDataList_panel">
					<div className="eDataList_title">{self.props.title} <div className="bLinkLike">Add new...</div></div>

				</div>
				<div className="eDataList_list mBlockView">
					{itemsNodes}
				</div>
			</div>
		)
	}
});

module.exports = List;
