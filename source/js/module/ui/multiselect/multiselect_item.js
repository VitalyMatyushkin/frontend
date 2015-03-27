var MultiSelectItem = React.createClass({
    mixins: [Morearty.Mixin],
    getDefaultProps: function() {
        return {
            visible: true,
            selected: false,
            text: '',
            onClick: function() {}
        }
    },
    render: function() {
        return this.props.visible && <li
                key={this.props.id + 'multiselectItem'}
                className={this.props.selected ? 'eMultiSelect_item mSelected' : 'mDeselected'}
                onClick={this.props.onClick}
            >{this.props.text}</li>
    }
})

module.exports = MultiSelectItem;