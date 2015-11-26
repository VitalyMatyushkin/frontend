var Form = require('module/ui/form/form'),
	FormColumn = require('module/ui/form/form_column'),
	FormField = require('module/ui/form/form_field');

var AlbumEditForm = React.createClass({
	mixins: [Morearty.Mixin],

	changeAccessMode: function(event) {
		var self = this,
			binding = self.getDefaultBinding(),
			mode = event.target.value;

		binding.set('accessMode', mode);
	},

	render: function() {
		var self = this,
		binding = self.getDefaultBinding();

		return (
			<Form name={self.props.title} onSubmit={self.props.onFormSubmit} binding={binding} >
				<FormColumn type="column">
					<FormField type="text" field="name" validation="required">Name: </FormField>
					<span>Access mode:</span>
					<select
						style={{margin: '5px 0px'}}
						defaultValue='everyone'
						value={binding.get('accessMode')}
						onChange={self.changeAccessMode}>
						<Morearty.DOM.option key="everyone-type" value='everyone'>everyone</Morearty.DOM.option>
						<Morearty.DOM.option key="private-type" value='private'>private</Morearty.DOM.option>
					</select>
				</FormColumn>
			</Form>
		);
	}
});

module.exports = AlbumEditForm;
