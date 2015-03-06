var Manager,
	FootballManager = require('./football/football'),
	Autocomplete = require('module/ui/autocomplete/autocomplete');

Manager = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
			binding = self.getDefaultBinding(),
			rivalsType = binding.get('newEvent.model.rivalsType');

            return <div className="eManagerContainer">
				<h4 className="eManagerContainer_title">{'Rivals - ' + rivalsType.toUpperCase()}</h4>
				<h4 className="eManagerContainer_title">{'Rivals - ' + rivalsType.toUpperCase()}</h4>
				<FootballManager binding={binding} />;
			</div>
	}
});

module.exports = Manager;
