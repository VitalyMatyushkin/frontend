const 	React 		= require('react'),
		Lazy 		= require('lazy.js'),
		Morearty	= require('morearty'),
		Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field');

const ClassForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: 			React.PropTypes.string.isRequired,
		onFormSubmit: 	React.PropTypes.func
	},
	getAllAges: function() {
		/** it should really be a server call */
		const ages = Lazy.range(1, 14).map(i => {
			return {
				value: 'Y' + i,
				age: i,
				id: i
			}
		}).toArray();
		return ages;
	},
	render: function() {
		var self = this;

		return (
			<Form name={self.props.title} onSubmit={self.props.onFormSubmit} binding={self.getDefaultBinding()} >
				<FormField type="text" field="name" validation="required">Form name</FormField>
				<FormField type="select" sourceArray={self.getAllAges()} field="age" validation="required">Age group</FormField>
			</Form>
		)
	}
});


module.exports = ClassForm;
