import {PostForm} from './post_form';
import * as Morearty from'morearty';
import * as React from'react';

export const PostAdd = (React as any).createClass({
	mixins: [Morearty.Mixin],
	submitAdd: function(data) {
		(window as any).Server.posts.post({blogId: this.props.blogId}, data).then(() =>  {
			document.location.hash = `blogs/${this.props.blogId}/posts`;
		});
	},
	render: function() {
		return (
			<PostForm
				title		    = "Add new post"
				onClickSubmit   = {this.submitAdd}
				binding		    = {this.getDefaultBinding()}
			/>
		)
	}
});