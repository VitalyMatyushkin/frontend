const 	React 		= require('react'),
		Morearty    = require('morearty'),
		Form 		= require('module/ui/form/form'),
		FormColumn 	= require('module/ui/form/form_column'),
		FormField	= require('module/ui/form/form_field');

const AlbumEditForm = React.createClass({
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
			<Form
				formStyleClass="mNarrow"
				name={self.props.title}
				onSubmit={self.props.onFormSubmit}
				binding={binding}
				submitButtonId	= "album_submit"
				cancelButtonId	= "news_cancel"
			>
				<FormColumn>
					<FormField type="text" field="name" id="album_name" validation="required">Name: </FormField>
				</FormColumn>
			</Form>
		);
	}
});

module.exports = AlbumEditForm;
