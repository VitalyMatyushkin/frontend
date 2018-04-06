import {BlogForm} from './blog_form';
import {ServiceList} from "module/core/service_list/service_list";
import * as Morearty from 'morearty';
import * as React from 'react';

export const BlogAdd = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.getDefaultBinding().clear();
	},
	submitAdd: function(data) {
		(window.Server as ServiceList).blogs.post(data).then(() =>  {
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