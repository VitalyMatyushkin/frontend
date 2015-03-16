var ListField;

ListField = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		dataField: React.PropTypes.string.isRequired,
		onChange: React.PropTypes.func.isRequired
	},
	onChange: function(event) {
		var self = this,
			value = event.currentTarget.value;

		self.props.onChange(self.props.dataField, value);
	},
	render: function() {
		var self = this;

		return (
			<div className="eDataList_listItemCell">
				{self.props.children}
				<div className="eDataList_filter">
					<input className="eDataList_filterInput" onChange={self.onChange}  placeholder={'filter by ' + self.props.children.toLowerCase() + '...'} />
				</div>
			</div>
		)
	}
});

module.exports = ListField;
