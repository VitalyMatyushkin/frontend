import {BlogForm} from './blog_form';
import * as Immutable from 'immutable';
import * as Morearty from'morearty';
import * as React from'react';

export const BlogEdit = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				blogId 	        = routingData.id;

		binding.clear();

		if (blogId) {
			(window as any).Server.blog.get({blogId}).then( data => {
				binding.set(Immutable.fromJS(data));
			});

			this.blogId = blogId;
		}
	},
	submitEdit: function(data) {
		(window as any).Server.blog.put({blogId: this.blogId}, data).then(() =>  {
			document.location.hash = 'blogs';
		});
	},
	render: function() {
		return (
			<BlogForm
				title		    = "Edit blog"
				onClickSubmit   = {this.submitEdit}
				binding		    = {this.getDefaultBinding()}
			/>
		)
	}
});