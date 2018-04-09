import * as React from 'react';
import * as Morearty from 'morearty';
import * as Form from 'module/ui/form/form';
import * as FormField from 'module/ui/form/form_field';
import {STATUS} from '../status_helper';

import 'styles/pages/blog/b_blog.scss';

export const PostForm = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: (React as any).PropTypes.string.isRequired,
		onClickSubmit: (React as any).PropTypes.func.isRequired
	},

	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<Form
				name		    = {this.props.title}
				binding         = { binding }
				submitOnEnter 	= { false }
				onSubmit        = { this.props.onClickSubmit }
				formStyleClass  = "bPostForm"
			>
				<FormField
					type 		= "text"
					field 		= "title"
					validation  = "required"
				>
					Title
				</FormField>
				<FormField
					type    = "dropdown"
					field   = "status"
					options = { STATUS }
				>
					Status
				</FormField>
				<FormField
					type 		    = "textarea"
					field 		    = "content"
					fieldClassName  = "ePostContent"
				>
					Content
				</FormField>
			</Form>
		);
	}
});