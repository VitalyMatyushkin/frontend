var ListField,
    If = require('module/ui/if/if'),
    SortColumn = require('module/ui/list/sort_column');
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
            if(self.props.children.toLowerCase()==='limit'){
                value = {
                    limit: value
                }
            }
            else{
                if(value.length >1){
                    value = {
                        like: value
                    }
                }else{
                    value={
                        regexp: "[\s\S]*",
                        options: 'i'
                    }
                }

            }
		}
        console.log(value);
		self.props.onChange(dataField, value);
	},
    onSort:function(event,order){
        var self = this,
            value,
            el  = event.currentTarget,
            fieldToSort = (order === 'School' || order === 'Preset')?order.toLowerCase() : self.props.dataField;
        if(el.classList.contains('caret_up')){
            $('.caret').removeClass('caret_active_up').removeClass('caret_active_dwn');
            el.classList.add('caret_active_up');
            value ={
                order:fieldToSort+' ASC'
            }
        }else{
            $('.caret').removeClass('caret_active_dwn').removeClass('caret_active_up');
            el.classList.add('caret_active_dwn');
            value ={
                order:fieldToSort+' DESC'
            }
        }
        self.props.onChange(fieldToSort, value);
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
				<input className="eDataList_filterInput" onChange={self.onChange}  placeholder={'filter by ' + self.props.children.toLowerCase() + '...'} />
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
