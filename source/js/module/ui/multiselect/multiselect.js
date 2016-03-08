var MultiSelectItem = require('./multiselect_item'),
    Immutable = require('immutable'),
    React = require('react');

var MultiSelect = React.createClass({
    mixins: [Morearty.Mixin],
    displayName: 'MultiSelect',
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
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('selections',self.props.selections);
    },
    getDefaultState:function(){
        return Immutable.fromJS({
            selections: [],
            filter: '',
            count: 0
        })
    },
    handleItemClick: function(item) {
        var self = this,
            binding = self.getDefaultBinding(),
            selected = binding.get('selections');
        self.setSelected(item, !selected);
    },
    handleFilterChange: function(event) {
        // Keep track of every change to the filter input
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('filter',event.target.value);
    },
    escapeRegExp: function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },
    createItem: function(item) {
        var self = this,
            binding = self.getDefaultBinding();
        // Filter item visibility based on the filter input
        var regex = new RegExp('.*'+this.escapeRegExp(binding.get('filter'))+'.*', 'i'),
            text = 'text' in item ? item.text
            : 'name' in item ? item.name
            : item.id;

        return <MultiSelectItem
            binding={this.getDefaultBinding()}
            key={item.id}
            text={text}
            onClick={this.handleItemClick.bind(this, item)}
            visible={regex.test(text)}
            selected={this.getDefaultBinding().get('selections').indexOf(item.id) !== -1}
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

        var selections = this.getDefaultBinding().get('selections'),
            self = this,
            binding = self.getDefaultBinding();
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
        binding.set('selections',selections);
        self.props.onChange(selections);
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            count = self.props.selections.length;
        return (
            <div key={self.props.key} className="bMultiSelect">
                <input onChange={this.handleFilterChange} value={binding.get('filter')} placeholder={this.props.placeholder} />
                <ul>{this.props.items.map(this.createItem)}</ul>
                <button onClick={this.selectAll}>Select all</button>&nbsp;
                {count > 0 ?
                    <button key={self.props.key + '-unselect'} onClick={this.selectNone}>{'Unselect all(' + count + ')'}</button>
                : null}
            </div>
        )
    }
});

module.exports = MultiSelect;