var ContactsPage,
	SVG = require('module/ui/svg'),
	Map = require('module/ui/map/map'),
	If = require('module/ui/if/if');

ContactsPage = React.createClass({
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
					<If condition={binding.get('schoolInfo.zipCode.geoPoint.lat')}>
						<Map point={{lat: binding.get('schoolInfo.zipCode.geoPoint.lat'), lng: binding.get('schoolInfo.zipCode.geoPoint.lng')}} />
					</If>

					<div className="eSchoolContacts_title">Sport contacts</div>
					{coachesNodes}
				</div>
			</div>
		)
	}
});


module.exports = ContactsPage;
