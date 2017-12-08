const 	TypeMixin 		= require('module/ui/form/types/type_mixin'),
		{Autocomplete}	= require('../../autocomplete2/OldAutocompleteWrapper'),
		Morearty		= require('morearty'),
		React 			= require('react');

const TypeAutocomplete = React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	propTypes: {
		serviceFullData: 	React.PropTypes.func,
		serviceFilter: 		React.PropTypes.func,
		serverField: 		React.PropTypes.string,
		field:				React.PropTypes.string,
		defaultItem:		React.PropTypes.object,
		placeholder: 		React.PropTypes.string,
		onSelect:			React.PropTypes.func,
		customListItem:		React.PropTypes.object,
        id:					React.PropTypes.string,
		isDisabled: 		React.PropTypes.bool
	},
	/** Setting component's value when it choosen */
	onSelect: function(data, fullValue){
        const 	self 	= this,
                binding = self.getDefaultBinding();

        binding.set('fullValue', fullValue);
        self.setValue(data);

		if(typeof this.props.onSelect !== "undefined") {
			this.props.onSelect(data, fullValue);
		}
	},

	render: function() {
		const self = this;

		return (
			<Autocomplete
				serviceFilter	= {self.props.serviceFilter}
				serviceFullData	= {self.props.serviceFullData}
				serverField		= {self.props.serverField || 'name'}
				onSelect		= {self.onSelect}
				defaultItem		= {self.props.defaultItem}
				placeholder 	= {self.props.placeholder}
				customListItem	= {self.props.customListItem}
				isBlocked		= {self.props.isDisabled}
				id				= {self.props.id}
			/>
		);
	}
});

module.exports = TypeAutocomplete;
