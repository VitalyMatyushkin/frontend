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
                    if(window.location.hash === '#school_admin/students'){
                        if(self.props.children === 'First name'){
                            value = {
                                firstName: value
                            }
                        }
                        if(self.props.children === 'Last name'){
                            value = {
                                lastName: value
                            }
                        }
                    }else if(window.location.hash === '#school_admin/forms'){
                        if(self.props.children === 'Name'){

                        }
                        if(self.props.children === 'Age group'){

                        }
                    }else if(window.location.hash === '#school_admin/houses'){
                        value;
                    }
                    else{
                        value = {
                            like: value
                        }
                    }

                }else{
                    value={
                        regexp: "[\s\S]*",
                        options: 'i'
                    }
                }

            }
		}
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
            if(window.location.hash === '#school_admin/students'){
                if(self.props.children === 'First name'){
                    value = {
                        order:'firstName ASC'
                    }
                }if(self.props.children === 'Last name'){
                    value = {
                        order:'lastName ASC'
                    }
                }
            }
            else if(window.location.hash === '#school_admin/students'){
                value = {
                    order : 'name ASC'
                }
            }
            else{
                value ={
                    order:fieldToSort+' ASC'
                }
            }
        }else{
            $('.caret').removeClass('caret_active_dwn').removeClass('caret_active_up');
            el.classList.add('caret_active_dwn');
            if(self.props.children === 'First name'){
                value = {
                    order:'firstName DESC'
                }
            }else if(self.props.children === 'Last name'){
                value = {
                    lastName:'lastName DESC'
                }
            }else{
                value ={
                    order:fieldToSort+' DESC'
                }
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
