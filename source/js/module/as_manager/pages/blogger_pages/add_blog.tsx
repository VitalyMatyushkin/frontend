import {BlogForm} from './blog_form';
import * as Morearty from'morearty';
import * as React from'react';

export const BlogAdd = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.getDefaultBinding().clear();
	},
	submitAdd: function(data) {
		(window as any).Server.blogs.post(data).then(() =>  {
			document.location.hash = 'blogs';
		});
	},
	render: function() {
		return (
			<BlogForm
				title		    = "Add new blog"
				onClickSubmit   = {this.submitAdd}
				binding		    = {this.getDefaultBinding()}
			/>
		)
	}
});