var EventPage,
	SubMenu = require('module/ui/menu/sub_menu'),
	If = require('module/ui/if/if');

EventPage = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function() {
		var self = this;

		return Immutable.fromJS({
			eventInfo: {}
		});
	},
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('activeSchoolId'),
			eventId = globalBinding.sub('routing.parameters').toJS().id;

		if (!activeSchoolId || !eventId) {
			document.location.hash = 'schools';
		}

		window.Server.event.get(eventId).then(function(data) {
			binding.set('opponentInfo', Immutable.fromJS(data));
		});

		self.menuItems = [{
			key: 'goback',
			name: '← Go back'
		}];
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<div>
				<SubMenu items={self.menuItems} binding={globalBinding.sub('routing')}/>

				<div className="bSchoolMaster">
					hello world
				</div>
			</div>
		)
	}
});


module.exports = EventPage;
