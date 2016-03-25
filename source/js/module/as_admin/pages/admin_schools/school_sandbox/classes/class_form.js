const 	Promise 	= require('bluebird'),
		React 		= require('react'),
		Lazy 		= require('lazyjs'),
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
		const ages = Lazy.range(3, 14).map(i => {
			return {
				value: 'Y' + i,
				age: i,
				id: i
			}
		}).toArray();
		return ages;
	},
	serviceFilter:function(){
		return window.Server.getAllSchools.get();
	},
	render: function() {
		var self = this;

		return (
			<Form name={self.props.title} onSubmit={self.props.onFormSubmit} binding={self.getDefaultBinding()} >
				<FormField type="text" promptOnBlank={true} field="name" validation="required">Form name</FormField>
				<FormField type="select" sourceArray={self.getAllAges()} field="age" validation="required">Age group</FormField>
				<FormField type="autocomplete" field="schoolId" serviceFullData={self.serviceFilter} >School</FormField>
			</Form>
		)
	}
});


module.exports = ClassForm;
