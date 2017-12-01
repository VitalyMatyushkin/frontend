const 	SVG 		= require('module/ui/svg'),
		{Map} 		= require('module/ui/map/map2'),
		React 		= require('react'),
		{If} 		= require('module/ui/if/if'),
		Morearty 	= require('morearty'),
		Immutable 	= require('immutable');

const ContactsPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('activeSchoolId'),
			binding = self.getDefaultBinding();


		window.Server.schoolCoaches.get(activeSchoolId).then(function(data) {
			binding.set('coaches', Immutable.fromJS(data));
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			coachesList = binding.toJS('coaches'),
			coachesNodes;

		if (coachesList) {
			coachesNodes = coachesList.map(function(coach) {
				return (
					<div className="eSchoolContacts_contact">
						<div className="eSchoolContacts_sportName">{coach.realms}</div>
						<div className="eSchoolContacts_userName">{coach.firstName} {coach.lastName}</div>
						<div className="eSchoolContacts_userEmail">{coach.email}</div>
						<div className="eSchoolContacts_userPhone">{coach.phone}</div>
					</div>
				);
			});
		}

		return (
			<div>
				<div className="bSchoolContacts">
					<If condition={binding.get('schoolInfo.postcode.point')}>
						<Map point={binding.get('schoolInfo.postcode.point')} />
					</If>

					<div className="eSchoolContacts_title">Sport contacts</div>
					{coachesNodes}
				</div>
			</div>
		)
	}
});


module.exports = ContactsPage;
