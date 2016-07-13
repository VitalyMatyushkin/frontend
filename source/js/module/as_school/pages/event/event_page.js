const 	SubMenu 	= require('module/ui/menu/sub_menu'),
		OneEvent 	= require('module/ui/fixtures/one_event'),
		If 			= require('module/ui/if/if'),
		Immutable 	= require('immutable'),
		Morearty    = require('morearty'),
		React 		= require('react');

const EventPage = React.createClass({
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

		window.Server.eventFindOne.get({
			filter: {
				where: {
					id: eventId
				},
				include: [
					{
						participants: [
							'players',
							{
								school: 'forms'
							},
							'house'
						]

					},
					{
						invites: ['guest', 'inviter']
					},
					{
						result: 'points'
					},
					{
						sport: ''
					},
					{
						albums: 'photos'
					}
				]
			}
		}).then(function(data) {
			binding.atomically().set('eventInfo', Immutable.fromJS(data)).set('eventInfo.album', Immutable.fromJS(data.albums[0])).commit();
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
					<OneEvent binding={binding.sub('eventInfo')}/>
				</div>
			</div>
		)
	}
});


module.exports = EventPage;
