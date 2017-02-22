const   MultiSelectItem = require('./multiselect_item'),
        Immutable       = require('immutable'),
        Morearty        = require('morearty'),
        React           = require('react');

const MultiSelect = React.createClass({
    mixins: [Morearty.Mixin],
    displayName: 'MultiSelect',
    componentWillReceiveProps: function(nextProps) {
        this.getDefaultBinding().set('selections', Immutable.fromJS(nextProps.selections));
    },
    getDefaultProps: function() {
        return {
            items: [],
            placeholder: 'Enter some filter text',
            onChange: function() {},
            onItemSelected: function() {},
            onItemDeselected: function() {}
        }
    },
    componentWillMount:function(){
        const   self    =   this;
        let     binding =   self.getDefaultBinding(),
                immutableData = binding.toJS();
        immutableData.selections = self.props.selections;
        binding.set(Immutable.fromJS(immutableData));
    },
    getDefaultState:function(){
        return Immutable.fromJS({
            selections: [],
            filter: '',
            count: 0
        })
    },
    handleItemClick: function(item) {
        const   self     =   this,
                binding  =   self.getDefaultBinding();

        const selected = binding.toJS('selections').indexOf(item.id)!==-1;

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
        const self    = this;
        let   binding = self.getDefaultBinding();
        // Filter item visibility based on the filter input
        var regex = new RegExp('.*'+this.escapeRegExp(binding.toJS('filter'))+'.*', 'i'),
            text = 'text' in item ? item.text
            : 'name' in item ? item.name
            : item.id;

        return <MultiSelectItem
            binding={binding}
            key={item.id}
            text={text}
            onClick={this.handleItemClick.bind(this, item)}
            visible={regex.test(text)}
            selected={binding.toJS('selections').indexOf(item.id) !== -1}
        />
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
              count = self.props.selections.size; // typeof self.props.selections === object

        return (
            <div className="bMultiSelect">
                <input onChange={this.handleFilterChange} value={binding.toJS('filter')} placeholder={this.props.placeholder} />
                <ul>{this.props.items.map(this.createItem)}</ul>
                <button onClick={this.selectAll}>Select all</button>&nbsp;
                {count > 0 ?
                    <button onClick={this.selectNone}>{'Deselect all(' + count + ')'}</button>
                : null}
            </div>
        )
    }
});

module.exports = MultiSelect;