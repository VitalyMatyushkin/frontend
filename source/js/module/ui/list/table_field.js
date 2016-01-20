const   If          = require('module/ui/if/if'),
        React       = require('react'),
        ReactDOM    = require('reactDom'),
        $           = require('jquery'),
        SortColumn  = require('module/ui/list/sort_column');

const ListField = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		dataField: React.PropTypes.string.isRequired,
		parseFunction: React.PropTypes.func,
		inputParseFunction: React.PropTypes.func,
        onChange: React.PropTypes.func,
        onSort: React.PropTypes.func,
		width: React.PropTypes.string,
		filterType: React.PropTypes.string,
        dataFieldKey: React.PropTypes.string
	},
	onChange: function(event) {
		var self = this,
			value = event.currentTarget.value,
            dataField;
		if (self.props.inputParseFunction) {
			value = self.props.inputParseFunction(value);
		}
        if(self.props.children === 'Role'){
            dataField = 'preset';
        }else{
            dataField = self.props.dataField;
        }
		if (value && self.props.filterType !== 'number') {
            var tempValue = {};
            if(value.length > 1){
                if(self.props.dataField === self.props.dataFieldKey){
                    value;
                }else{
                    tempValue[self.props.dataFieldKey] = value;
                    value = tempValue;
                }
            }else{
                value={
                    regexp: "[\s\S]*",
                    options: 'i'
                }
            }
		}
		self.props.onChange(dataField, value);
	},
    onSort:function(event){
        const self = this,
            el  = event.currentTarget;
        let field = self.props.dataField,
            value;

        field += self.props.dataFieldKey ? '.' + self.props.dataFieldKey : '';
        $('.caret').removeClass('caret_active_up').removeClass('caret_active_dwn');
        if(el.classList.contains('caret_up')){
            el.classList.add('caret_active_up');
            value = ' ASC';

        }else{
            el.classList.add('caret_active_dwn');
            value = ' DESC';
        }
        self.props.onSort && self.props.onSort(field, value);
    },
	render: function() {
		var self = this,
			cellStyle = {},
			filterBlock;

		if (self.props.width) {
			cellStyle.width = self.props.width;
		}

		if (self.props.filterType !== 'colors' && self.props.filterType !== 'range' && self.props.filterType !== 'none') {
			filterBlock =  <div className="eDataList_filter">
				<input className="eDataList_filterInput" onChange={self.onChange}  placeholder={'filter by ' + (self.props.dataFieldKey !== undefined? self.props.dataFieldKey : self.props.children.toLowerCase()) + '...'} />
			</div>
		}

		return (
			<div className="eDataList_listItemCell" style={cellStyle}>
                {self.props.children}
                <If condition={self.props.filterType !== 'none'}>
                    <SortColumn orderSort={self.props.children} onSort={self.onSort}/>
                </If>
				{filterBlock}
			</div>
		)
	}
});

module.exports = ListField;
