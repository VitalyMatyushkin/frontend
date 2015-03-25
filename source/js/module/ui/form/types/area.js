var TypeAutocomplete = require('module/ui/form/types/autocomplete'),
	AreaMixin,
	TypeArea;

TypeArea = React.createClass({
	mixins: [Morearty.Mixin],
	serviceFilter: function(value) {
		var self = this,
			postCodeFilter = {
                where: {
                    zipCode: {
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
			serverField: 'zipCode'
		});

		return (
			<div>{AutocompleteProped}</div>
		);
	}
});

module.exports = TypeArea;
