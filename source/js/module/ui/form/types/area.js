const 	TypeAutocomplete 	= require('module/ui/form/types/autocomplete'),
		Morearty			= require('morearty'),
		React 				= require('react');

// TODO BURN IT IN HELL!!
/**
 * Looks like this element helps to locate some geo area
 */
const TypeArea = React.createClass({
	mixins: [Morearty.Mixin],
    propTypes: {
        id: React.PropTypes.string
    },
	componentWillMount: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		binding.addListener('defaultValue', function() {
			const postCodeId = binding.get('defaultValue');

            // TODO: implement defaultValue initialisation
            // это полная и нерабочая лажа
			//if (postCodeId) {
			//	self.valueRequest && self.valueRequest.cancel();
			//	binding.set('defaultLabel', postCodeId);
			//}
		});
	},
	serviceFilter: function(value) {
		const	postCodeFilter = {
					where: {
						postcode: {
							like: value,
							options: 'i'
						}
					},
					limit: 10
            	};

		return window.Server.postCodes.get({ filter: postCodeFilter });
	},
	render: function() {
		const 	self = this,
				autocompleteProps = Object.assign({}, self.props, {		// merging current props with new one
					serviceFilter: 	self.serviceFilter,
					serverField: 	'postcode'
				}),
				AutocompleteProped = React.createElement(TypeAutocomplete, autocompleteProps);	// and creating new object

		return (
			<div>{AutocompleteProped}</div>
		);
	}
});

module.exports = TypeArea;
