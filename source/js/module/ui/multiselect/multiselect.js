var MultiSelectItem = require('./multiselect_item');

var MultiSelect = React.createClass({
    mixins: [Morearty.Mixin],
    getDefaultProps: function() {
        return {
            items: [],
            placeholder: 'Enter some filter text',
            onChange: function() {},
            onItemSelected: function() {},
            onItemDeselected: function() {}
        }
    },
    getInitialState: function() {
        var self = this;

        return {
            selections: self.props.selections || [],
            filter: ''
        }
    },
    handleItemClick: function(item) {
        var selected = this.state.selections.indexOf(item.id) !== -1;
        this.setSelected(item, !selected);
    },
    handleFilterChange: function(event) {
        // Keep track of every change to the filter input
        this.setState({ filter: event.target.value })
    },
    escapeRegExp: function(str) {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    },
    createItem: function(item) {
        // Filter item visibility based on the filter input
        var regex = new RegExp('.*'+this.escapeRegExp(this.state.filter)+'.*', 'i'),
            text = 'text' in item ? item.text
            : 'name' in item ? item.name
            : item.id;

        return <MultiSelectItem
            binding={this.getDefaultBinding()}
            key={item.id}
            text={text}
            onClick={this.handleItemClick.bind(this, item)}
            visible={regex.test(text)}
            selected={this.state.selections.indexOf(item.id) !== -1}
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

        var selections = this.state.selections,
            self = this;

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

        self.setState({ selections: selections });
        self.props.onChange(selections);
    },
    render: function() {
        return (
            <div className="bMultiSelect">
                <input onChange={this.handleFilterChange} value={this.state.filter} placeholder={this.props.placeholder} />
                <ul>{this.props.items.map(this.createItem)}</ul>
                <button onClick={this.selectAll}>Select all</button>&nbsp;
                <button onClick={this.selectNone}>Select none</button>
            </div>
        )
    }
});

module.exports = MultiSelect;