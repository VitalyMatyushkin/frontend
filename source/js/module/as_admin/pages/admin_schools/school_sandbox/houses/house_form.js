const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		React 		= require('react');

const ClassForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string.isRequired,
		onFormSubmit: React.PropTypes.func
	},
	render: function() {
		var self = this;

		return ( <div className ="eHouseForm">
			<Form name={self.props.title} onSubmit={self.props.onFormSubmit} binding={self.getDefaultBinding()} >
				<FormField type="text" field="name" validation="required" >House name</FormField>
				<FormField type="text" field="description">Description</FormField>
				<FormField type="colors" maxColors={2} field="colors">House colors</FormField>
			</Form></div>
		)
	}
});


module.exports = ClassForm;
