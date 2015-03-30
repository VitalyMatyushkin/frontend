var ListField;

ListField = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		dataField: React.PropTypes.string.isRequired,
		parseFunction: React.PropTypes.func,
		inputParseFunction: React.PropTypes.func,
		onChange: React.PropTypes.func.isRequired,
		width: React.PropTypes.string,
		filterType: React.PropTypes.string
	},
	onChange: function(event) {
		var self = this,
			value = event.currentTarget.value;

		if (self.props.inputParseFunction) {
			value = self.props.inputParseFunction(value);
		}

		if (value && self.props.filterType !== 'number') {
			value = {
				like: value,
				options: 'i'
			}
		}

		self.props.onChange(self.props.dataField, value);
	},
	render: function() {
		var self = this,
			cellStyle = {},
			filterBlock;

		if (self.props.width) {
			cellStyle.width = self.props.width;
		}

		if (self.props.filterType !== 'colors' && self.props.filterType !== 'range') {
			filterBlock =  <div className="eDataList_filter">
				<input className="eDataList_filterInput" onChange={self.onChange}  placeholder={'filter by ' + self.props.children.toLowerCase() + '...'} />
			</div>
		}

		return (
			<div className="eDataList_listItemCell" style={cellStyle}>
				{self.props.children}
				{filterBlock}
			</div>
		)
	}
});

module.exports = ListField;
