var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	AddNewHouse;

AddNewHouse = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		schoolId: React.PropTypes.string.isRequired,
		houseId: React.PropTypes.string,
		mode: React.PropTypes.string
	},
	onSuccess: function(data) {
		var self = this;

		// Переход к списку школ
		document.location.hash = 'schools/view?id=' + self.props.schoolId;
	},
	submitForm: function(data) {
		var self = this;

		if (self.props.mode === 'edit' && self.props.houseId) {
			window.Server.house.put({
				houseId: self.props.houseId,
				schoolId: self.props.schoolId
			}, data).then(self.onSuccess.bind(self));
		} else {
			data.schoolId = self.props.schoolId;
			window.Server.houses.post(self.props.schoolId, data).then(self.onSuccess.bind(self));
		}
	},
	render: function() {
		var self = this,
			formTitle = self.props.mode === 'edit' ? 'Edit house' : 'Add new house';

		return (
			<Form name={formTitle} onSubmit={self.submitForm} binding={self.getDefaultBinding()} >
				<FormField type="text" field="name" validation="required">House name</FormField>
				<FormField type="text" field="description" validation="">Description</FormField>
			</Form>
		)
	}
});


module.exports = AddNewHouse;
