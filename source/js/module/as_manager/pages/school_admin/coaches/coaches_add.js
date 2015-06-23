var CoachesForm = require('module/as_manager/pages/school_admin/coaches/coaches_form'),
	CoachesAddPage;

CoachesAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		self.activeSchoolId = activeSchoolId;
	},
	submitAdd: function(data) {
		var self = this;

		data.password =
        window.Server.users.post(data) //First add data to users and then create a relation to the school with the result
            .then(function (user) {
                //This creates a relation between the user entity and the school using {id} and/rel/  {fk}
                self.activeSchoolId && window.Server.addCoach.put({id:self.activeSchoolId,fk:user.id}, user).then(function() {
                    document.location.hash = 'school_admin/coaches';
                });
            })
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<CoachesForm title="Add coach..." onFormSubmit={self.submitAdd} binding={binding} />
		)
	}
});


module.exports = CoachesAddPage;
