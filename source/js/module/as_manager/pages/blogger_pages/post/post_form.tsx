import * as React from 'react';
import * as Morearty from 'morearty';
import * as Form from 'module/ui/form/form';
import * as FormField from 'module/ui/form/form_field';
import * as FormColumn from 'module/ui/form/form_column';
import * as FormTitle from 'module/ui/form/form_title';
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
			<div className='container' style={{margin: '30px 0 0 0'}}>
				<Form
					binding={ binding }
					submitOnEnter={ false }
					onSubmit={ this.props.onClickSubmit }
					formStyleClass="bPostForm"
				>
					<FormColumn customStyle='col-md-7'>
						<FormField
							type="text"
							field="title"
							validation="required"
						>
							Title
						</FormField>
						<FormField
							type="dropdown"
							field="status"
							options={ STATUS }
						>
							Status
						</FormField>
						<FormField
							type="postTextArea"
							field="content"
							fieldClassName="ePostContent"
						>
							Content
						</FormField>
					</FormColumn>
					<FormColumn customStyle='col-md-5'>
						<FormTitle text={'Markdown syntax'}/>
						<div>
							<p>
								<b>Paragraphs</b> - A sequence of non-blank lines that cannot be interpreted as other kinds of blocks forms a paragraph. The contents of the paragraph are the result of parsing the paragraph’s raw content as inlines. The paragraph’s raw content is formed by concatenating the lines and removing initial and final whitespace.<br/><br/>
								<b>Bold text</b> - Mark text in double asterisks, like <b>**this**</b>, to make it bold.<br/><br/>
								<b>Italic text</b> - Mark text in single asterisks, like <b>*this*</b>, to make it italic. You can also use underscores to achieve the same, for example: _this_<br/><br/>
								<b>Strikethrough text</b> - Cross out text by wrapping it in two tildes on each side, like <b>~~this~~</b>.<br/><br/>
								<b>Inline code</b> - Include inline formatted code by wrapping it in a single backtick <b>(`)</b> at the beginning and end of the code.<br/><br/>
								<b>Links</b> - Create a link by putting the link text in brackets and the URL in parentheses, like <b>[foo](/url)</b>.<br/><br/>
								<b>Images</b> - Syntax for images is like the syntax for links, with one difference. Instead of link text, we have an image description, like <b>![foo](/url "title")</b>.<br/><br/>
							</p>
						</div>
					</FormColumn>
				</Form>
			</div>
		);
	}
});