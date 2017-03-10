const 	ComboBox2 	= require('./ComboBox2'),
		Morearty    = require('morearty'),
		React 		= require('react');

const OldAutocompleteWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		serverField:		React.PropTypes.string,
		serviceFullData:	React.PropTypes.func,
		serviceFilter:		React.PropTypes.func,
		onSelect:			React.PropTypes.func,
		onBlur:				React.PropTypes.func,
		onInput:			React.PropTypes.func,
		placeholder:		React.PropTypes.string,
		onEscapeSelection:	React.PropTypes.func,
		clearAfterSelect:	React.PropTypes.bool,
		isBlocked:			React.PropTypes.bool,
		defaultItem:		React.PropTypes.object,
		extraCssStyle:		React.PropTypes.string,
		getElementTitle:	React.PropTypes.func,
		customListItem:		React.PropTypes.func
	},
	searchFunction: function(text) {
		return {
			sync	:  [],
			async	: this.props.serviceFilter ? this.props.serviceFilter(text) : this.props.serviceFullData(text)
		};
	},
	getEscapeSelectFunction: function() {
		const self = this;

		if(self.props.onEscapeSelection === undefined) {
			return () => {};
		} else {
			return self.props.onEscapeSelection;
		}
	},
	getInputText: function(elem) {
		if(typeof this.props.getElementTitle !== 'undefined') {
			return this.props.getElementTitle(elem);
		} else {
			return elem[this.props.serverField];
		}
	},
	getElementTooltip: function(elem) {
		return  typeof elem.tooltip !== 'undefined' ? elem.tooltip : '';
	},
	render: function () {
		const self = this;

		return (
			<ComboBox2	defaultItem			= {self.props.defaultItem}
						initialValue		= {self.props.initialValue}
						placeholder			= {self.props.placeholder}
						searchFunction		= {self.searchFunction}
						onSelect			= {self.props.onSelect}
						getElementTitle		= {self.getInputText}
						getElementTooltip	= {self.getElementTooltip}
						onEscapeSelection	= {self.getEscapeSelectFunction()}
						clearAfterSelect	= {self.props.clearAfterSelect !== undefined ? self.props.clearAfterSelect : false}
						extraCssStyle		= {self.props.extraCssStyle}
						isBlocked			= {self.props.isBlocked}
						customListItem		= {self.props.customListItem}
			/>
		);
	}
});

module.exports = OldAutocompleteWrapper;