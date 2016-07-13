const 	ComboBox2 	= require('./ComboBox2'),
        Morearty    = require('morearty'),
        React 		= require('react');

const OldAutocompleteWrapper = React.createClass({
    mixins: [Morearty.Mixin],
    propTypes: {
        serverField: 		React.PropTypes.string,
        serviceFullData: 	React.PropTypes.func,
        serviceFilter: 		React.PropTypes.func,
        onSelect: 			React.PropTypes.func,
        onBlur: 			React.PropTypes.func,
        onInput: 			React.PropTypes.func,
        placeholderText: 	React.PropTypes.string,
        onEscapeSelection:  React.PropTypes.func,
        clearAfterSelect: 	React.PropTypes.bool,
        defaultItem: 	    React.PropTypes.object
    },
    searchFunction: function(text) {
        return {
            sync:  [],
            async: this.props.serviceFilter ? this.props.serviceFilter(text) : this.props.serviceFullData(text)
        };
    },
    getEscapeSelectFunction: function() {
        const self = this;

        if(self.props.onEscapeSelection === undefined) {
            return function () {
              console.log("escape selection");
            };
        } else {
            return self.props.onEscapeSelection;
        }
    },
    getInputText: function(elem) {
        return  elem[this.props.serverField];
    },
    render: function () {
        const self = this;

        return (
            <ComboBox2
                defaultItem         = {self.props.defaultItem}
                initialValue        = {self.props.initialValue}
                placeholder         = {self.props.placeholderText}
                searchFunction      = {self.searchFunction}
                onSelect            = {self.props.onSelect}
                getElementTitle     = {self.getInputText}
                onEscapeSelection   = {self.getEscapeSelectFunction()}
                clearAfterSelect    = {self.props.clearAfterSelect !== undefined ? self.props.clearAfterSelect : false}
            />
        );
    }
});

module.exports = OldAutocompleteWrapper;


