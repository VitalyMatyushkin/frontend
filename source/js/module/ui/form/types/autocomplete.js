const 	TypeMixin 		= require('module/ui/form/types/type_mixin'),
		Autocomplete2	= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		React 			= require('react');

const TypeAutocomplete = React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	propTypes: {
		serviceFullData: 	React.PropTypes.func,
		serviceFilter: 		React.PropTypes.func,
		serverField: 		React.PropTypes.string,
		field:				React.PropTypes.string,
		defaultItem:		React.PropTypes.object
	},

	/** Setting component's value when it choosen */
	onSelect: function(data, fullValue){
        const 	self 	= this,
                binding = self.getDefaultBinding();

        binding.set('fullValue', fullValue);
        self.setValue(data);
	},

	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		return (
			<Autocomplete2
				serviceFilter	= {self.props.serviceFilter}
				serviceFullData	= {self.props.serviceFullData}
				serverField		= {self.props.serverField || 'name'}
				onSelect		= {self.onSelect}
				defaultItem		= {self.props.defaultItem}
			/>
		);
	}
});

module.exports = TypeAutocomplete;
