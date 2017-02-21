const 	React 		= require('react'),
		Lazy		= require('lazy.js'),
		Form 		= require('module/ui/form/form'),
		Morearty	= require('morearty'),
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
		return (
			<Form formStyleClass="mNarrow" name={this.props.title} onSubmit={this.props.onFormSubmit} binding={this.getDefaultBinding()} >
				<FormField type="text" field="name" validation="required">Form name</FormField>
				<FormField type="select" sourceArray={this.getAllAges()} field="age" validation="required">Age group</FormField>
			</Form>
		)
	}
});


module.exports = ClassForm;
