const   classNames  = require('classnames'),
        React 		= require('react');

const MultiSelectReact = React.createClass({
    displayName: 'MultiSelect react',
	propTypes:{
		items: 			React.PropTypes.array,
		selections: 	React.PropTypes.array,
		placeholder: 	React.PropTypes.string,
		onChange: 		React.PropTypes.func,
		onFilter: 		React.PropTypes.func
	},
    getDefaultProps: function() {
        return {
            items: 			[],
            placeholder: 	'Enter some filter text'
        }
    },
    componentWillMount:function(){
        const   self    =   this;
        let     binding =   self.getDefaultBinding(),
                immutableData = binding.toJS();
        immutableData.selections = self.props.selections;
        binding.set(Immutable.fromJS(immutableData));
    },
    getInitialState:function(){
        return {
            selections: [],
            filter: '',
            count: 0
        };
    },
    handleItemClick: function(item) {
        const   self     =   this;
        let     binding  =   self.getDefaultBinding(),
                selected =   binding.toJS('selections').indexOf(item.id)!==-1;
        self.setSelected(item, !selected);
    },
    handleFilterChange: function(event) {
        // Keep track of every change to the filter input
        const   self    = this;
        let     binding = self.getDefaultBinding(),
                immutableData = binding.toJS();
                immutableData.filter = event.target.value;
        binding.set(Immutable.fromJS(immutableData));
    },
    escapeRegExp: function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },
    createItem: function(item) {
		const 	selected = this.state.selections.indexOf(item.id) !== -1,
				classes = classNames({
					eMultiSelect_item: true,
					mSelected: selected
				});

		return (
			<li key={item.id} className={classes} onClick={this.handleItemClick(item)}>
				{this.props.text}
			</li>
		);
    },
    selectAll: function() {
        this.setSelected(this.props.items, true)
    },
    selectNone: function() {
        this.setSelected(this.props.items, false)
    },
    setSelected: function(items, selected) {
        // Accept an array or a single item
        if (!(items instanceof Array)) items = [items];

        const   self     = this;
        let     binding  = self.getDefaultBinding(),
                selections  = binding.toJS('selections'),
                immutableData = binding.toJS();
        for (var i in items) {
            if (selected && selections.indexOf(items[i].id) === -1) {
                selections.push(items[i].id);
                if (self.props.onItemSelected) {
                    self.props.onItemSelected(items[i]);
                }
            } else if (!selected && selections.indexOf(items[i].id) !== -1) {
                selections = selections.filter(function (itemId) {
                    return itemId !== items[i].id;
                });
                if (self.props.onItemDeselected) {
                    self.props.onItemDeselected(items[i]);
                }
            }
        }
        //self.setState({ selections: selections });
        immutableData.selections = selections;
        binding.set(Immutable.fromJS(immutableData));
        self.props.onChange(selections);
    },
    render: function() {
        const self = this;
        let   binding = self.getDefaultBinding(),
              count = self.props.selections.length;
        return (
            <div className="bMultiSelect">
                <input onChange={this.handleFilterChange} value={binding.toJS('filter')} placeholder={this.props.placeholder} />
                <ul>
					{this.props.items.map(this.createItem)}
				</ul>
                <button onClick={this.selectAll}>Select all</button>&nbsp;
                {count > 0 ?
                    <button onClick={this.selectNone}>{'Unselect all(' + count + ')'}</button>
                : null}
            </div>
        )
    }
});

module.exports = MultiSelectReact;