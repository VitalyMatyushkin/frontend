const React = require('react');


module.exports = {
	propTypes: {
		title: React.PropTypes.string.isRequired,
		onFormSubmit: React.PropTypes.func,
		onChangePermissionType: React.PropTypes.func
	},
	schoolListService: function (schoolName) {
		var self = this,
			binding = self.getDefaultBinding();

		return window.Server.schools.get({
			filter: {
				where: {
					name: {
						like: schoolName,
						options: 'i'
					}
				},
				limit: 10
			}
		});
	}
};
