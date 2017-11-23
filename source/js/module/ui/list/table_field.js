const  {If}         = require('module/ui/if/if'),
        React       = require('react'),
		Morearty    = require('morearty'),
        SortColumn  = require('module/ui/list/sort_column');

const TableField = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		dataField: React.PropTypes.string.isRequired,
		type: React.PropTypes.string,
		parseFunction: React.PropTypes.func,
		inputParseFunction: React.PropTypes.func,
        onChange: React.PropTypes.func,
        onSort: React.PropTypes.func,
		width: React.PropTypes.string,
		filterType: React.PropTypes.string,
        dataFieldKey: React.PropTypes.string
	},
	getFieldName:function(){
		var self = this,
			dataField = self.props.dataField;
		if(self.props.dataFieldKey){
			dataField += '.' + self.props.dataFieldKey;
		}
		return dataField;
	},
	onChange: function(event) {
		var self = this,
			value = event.currentTarget.value,
            dataField = self.getFieldName();

		if (self.props.inputParseFunction) {
			value = self.props.inputParseFunction(value);
		}
		self.props.onChange(dataField, value);
	},
    onSort:function(field, value){
        const self = this;

        self.props.onSort && self.props.onSort(field, value);
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			cellStyle = {},
			filterBlock;

		if (self.props.width) {
			cellStyle.width = self.props.width;
		}

		if (self.props.type !== 'colors' && self.props.filterType !== 'range' && self.props.filterType !== 'none' && self.props.filterType !== 'sorting') {
			filterBlock =  <div className="eDataList_filter">
				<input className="eDataList_filterInput" onChange={self.onChange}  placeholder={'filter by '
					+ (self.props.dataFieldKey !== undefined? self.props.dataFieldKey : self.props.children.toLowerCase())
				 	+ '...'} />
			</div>
		}

		return (
			<div className="eDataList_listItemCell" style={cellStyle}>
                {self.props.children}
                <If condition={self.props.filterType !== 'none'}>
                    <SortColumn binding={binding.sub('order')} fieldName={self.getFieldName()} onSort={self.onSort}/>
                </If>
				{filterBlock}
			</div>
		)
	}
});

module.exports = TableField;
