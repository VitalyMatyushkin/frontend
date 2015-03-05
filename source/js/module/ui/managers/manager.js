var Manager,
	FootballManager = require('./football/football'),
	Autocomplete = require('module/ui/autocomplete/autocomplete');

Manager = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('activeSchoolId'),
			binding = self.getDefaultBinding();

            return <FootballManager binding={binding} />;
	}
});

module.exports = Manager;
