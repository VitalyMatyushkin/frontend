import * as React from 'react';
import * as Morearty from 'morearty';
import * as Form from 'module/ui/form/form';
import * as FormColumn from 'module/ui/form/form_column';
import * as FormField from 'module/ui/form/form_field';

interface AlbumEditFormProps {
	title: 			string
	onFormSubmit: 	() => void
	albumId:		string
}

export const AlbumEditForm = (React as any).createClass({
	mixins: [Morearty.Mixin],

	changeAccessMode: function(event): void {
		const 	binding = this.getDefaultBinding(),
				mode = event.target.value;

		binding.set('accessMode', mode);
	},

	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<Form
				formStyleClass	= "mNarrow"
				name			= {this.props.title}
				onSubmit		= {this.props.onFormSubmit}
				binding			= {binding}
				submitButtonId	= "album_submit"
				cancelButtonId	= "album_cancel"
			>
				<FormColumn>
					<FormField type="text" field="name" id="album_name" validation="required">Name: </FormField>
				</FormColumn>
			</Form>
		);
	}
});
