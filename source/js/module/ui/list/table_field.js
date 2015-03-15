var ListField;

ListField = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		dataField: React.PropTypes.string.isRequired
	},
	render: function() {
		var self = this;

		return (
			<div className="eDataList_listItemCell">
				{self.props.children}
				<div className="eDataList_filter">
					<input className="eDataList_filterInput"  placeholder={'filter by ' + self.props.children.toLowerCase() + '...'} />
				</div>
			</div>
		)
	}
});

module.exports = ListField;
