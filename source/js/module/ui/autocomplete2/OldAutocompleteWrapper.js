const 	ComboBox2 	= require('./ComboBox2'),
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
        initialValue: 	    React.PropTypes.string
    },
    searchFunction: function(text) {
        const self = this;

        const result = {
            sync:  [],
            async: self.props.serviceFilter ? self.props.serviceFilter(text) : self.props.serviceFullData(text)
        };

        return result;
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
        const self = this;

        return elem[self.props.serverField];
    },
    render: function () {
        const self = this;

        return (
            <ComboBox2
                initialValue={self.props.initialValue}
                placeholder={self.props.placeholderText}
                searchFunction={self.searchFunction}
                onSelect={self.props.onSelect}
                getElementTitle={self.getInputText}
                onEscapeSelection={self.getEscapeSelectFunction()}
                clearAfterSelect={self.props.clearAfterSelect !== undefined ? self.props.clearAfterSelect : false}
            />
        );
    }
});

module.exports = OldAutocompleteWrapper;


