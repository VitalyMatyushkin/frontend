/**
 * Created by Anatoly on 26.05.2016.
 */

const 	React 		= require('react'),
		Form		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		FormColumn 	= require('module/ui/form/form_column');

const NextOfKinFields = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<Form binding={binding} >
				<FormColumn type="column">
					<FormField type="text" field="relationship" validation="required" >Relationship</FormField>
					<FormField type="text" field="firstName" validation="required" >Name</FormField>
					<FormField type="text" field="lastName" validation="required" >Surname</FormField>
					<FormField type="phone" field="phone" validation="phone required" >Phone</FormField>
					<FormField type="text" field="email" validation="required email" >Email</FormField>
				</FormColumn>
			</Form>
		);
	}
});



module.exports = NextOfKinFields;