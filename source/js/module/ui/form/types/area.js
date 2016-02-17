const 	TypeAutocomplete 	= require('module/ui/form/types/autocomplete'),
		React 				= require('react');

/**
 * Looks like this element helps to locate some geo area
 */
const TypeArea = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		binding.addListener('defaultValue', function() {
			const postCodeId = binding.get('defaultValue');

			if (postCodeId) {
				self.valueRequest && self.valueRequest.cancel();
				binding.set('defaultLabel', postCodeId);
			}
		});
	},
	serviceFilter: function(value) {
		var self = this,
			postCodeFilter = {
                where: {
                    id: {
                        like: value,
                        options: 'i'
                    }
                },
                limit: 10
            };

		self.request && self.request.cancel();

		if (!value) {
			return undefined;
		}

		self.request = window.Server.postCode.get({ filter: postCodeFilter });
		return self.request;
	},
	render: function() {
		const 	self = this,
				autocompleteProps = Object.assign({}, self.props, {		// merging current props with new one
					serviceFilter: 	self.serviceFilter,
					serverField: 	'id'
				}),
				AutocompleteProped = React.createElement(TypeAutocomplete, autocompleteProps);	// and creating new object

		return (
			<div>{AutocompleteProped}</div>
		);
	}
});

module.exports = TypeArea;
