/**
 * Created by Anatoly on 26.05.2016.
 */

const 	React 		= require('react'),
		FormField 	= require('module/ui/form/form_field'),
		FormColumn 	= require('module/ui/form/form_column');

const NextOfKinFields = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<div>
				<FormColumn type="column">
					<FormField type="text" field="relationship" validation="required" binding={binding}>Relationship</FormField>
					<FormField type="text" field="firstName" validation="required" binding={binding}>Name</FormField>
					<FormField type="text" field="lastName" validation="required" binding={binding}>Surname</FormField>
					<FormField type="phone" field="phone" validation="phone required" binding={binding}>Phone</FormField>
					<FormField type="text" field="email" validation="required email" binding={binding}>Email</FormField>
				</FormColumn>
				<span className="button" >Delete</span>
			</div>
		);
	}
});



module.exports = NextOfKinFields;