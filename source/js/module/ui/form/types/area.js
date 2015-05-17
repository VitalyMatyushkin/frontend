var TypeAutocomplete = require('module/ui/form/types/autocomplete'),
	AreaMixin,
	TypeArea;

TypeArea = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding();

		binding.addListener('defaultValue', function() {
			var postCodeId = binding.get('defaultValue');

			if (postCodeId) {
				self.valueRequest && self.valueRequest.abort();
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

		self.request && self.request.abort();

		if (!value) {
			return undefined;
		}

		self.request = window.Server.postCode.get({ filter: postCodeFilter });
		return self.request;
	},
	render: function() {
		var self = this,
			AutocompleteElement = React.createElement(TypeAutocomplete, self.props),
			AutocompleteProped;

		AutocompleteProped = React.addons.cloneWithProps(AutocompleteElement, {
			serviceFilter: self.serviceFilter,
			serverField: 'id'
		});

		return (
			<div>{AutocompleteProped}</div>
		);
	}
});

module.exports = TypeArea;
