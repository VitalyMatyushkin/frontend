var ContactsPage,
	SVG = require('module/ui/svg');

ContactsPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div>
				<div className="bSchoolContacts">
					<div className="eSchoolContacts_title">Sport contacts</div>

					<div className="eSchoolContacts_contact">
						<div className="eSchoolContacts_sportName">Hockey</div>
						<div className="eSchoolContacts_userName">James Patrick</div>
						<div className="eSchoolContacts_userPosition">senior school hockey</div>
						<div className="eSchoolContacts_userEmail">james@school.com</div>
						<div className="eSchoolContacts_userPhone">+7918921685</div>
					</div>

					<div className="eSchoolContacts_contact">
						<div className="eSchoolContacts_sportName">Football</div>
						<div className="eSchoolContacts_userName">Bob Strelons</div>
						<div className="eSchoolContacts_userPosition">school fooball</div>
						<div className="eSchoolContacts_userEmail">bob@school.com</div>
						<div className="eSchoolContacts_userPhone">+20228921685</div>
					</div>

					<div className="eSchoolContacts_contact">
						<div className="eSchoolContacts_sportName">Football</div>
						<div className="eSchoolContacts_userName">Dan Lonhorn</div>
						<div className="eSchoolContacts_userPosition">head of boys team</div>
						<div className="eSchoolContacts_userEmail">dan@school.com</div>
						<div className="eSchoolContacts_userPhone">+22223421685</div>
					</div>
				</div>
			</div>
		)
	}
});


module.exports = ContactsPage;
