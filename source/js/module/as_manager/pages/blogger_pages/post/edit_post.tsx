import {PostForm} from './post_form';
import {ServiceList} from "module/core/service_list/service_list";
import * as Immutable from 'immutable';
import * as Morearty from'morearty';
import * as React from'react';

export const PostEdit = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				postId 	        = routingData.id;

		binding.clear();

		if (postId) {
			(window.Server as ServiceList).post.get({blogId: this.props.blogId, postId}).then( data => {
				binding.set(Immutable.fromJS(data));
			});

			this.postId = postId;
		}
	},
	submitEdit: function(data) {
		(window.Server as ServiceList).post.put({blogId: this.props.blogId, postId: this.postId}, data).then(() =>  {
			document.location.hash = `blogs/${this.props.blogId}/posts`;
		});
	},
	render: function() {
		return (
			<PostForm
				title		    = "Edit post"
				onClickSubmit   = {this.submitEdit}
				binding		    = {this.getDefaultBinding()}
			/>
		)
	}
});