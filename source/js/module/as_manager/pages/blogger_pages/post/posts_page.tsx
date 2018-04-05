import * as  React from 'react'
import * as  Morearty from 'morearty'
import * as  Immutable from 'immutable'
import {RegionHelper} from 'module/helpers/region_helper'
import {SVG} from 'module/ui/svg'
import * as RouterView from 'module/core/router'
import * as Route from 'module/core/route'
import {SubMenu} from 'module/ui/menu/sub_menu';

import {PostsList} from './posts_list'
import {PostAdd} from './add_post'
import {PostEdit} from './edit_post'

export const PostsPage = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount:function(){
		const 	globalBinding 	= this.getMoreartyContext().getBinding(),
				blogId 	        = globalBinding.get('routing.pathParameters.0');

		const menuItems = [
			{
				href:'/#blogs',
				name: '← Blogs',
				key:'back'
			},
			{
				href:`/#blogs/${blogId}/posts`,
				name:'Posts',
				key:'action_descriptor',
				routes:[`/blogs/${blogId}/posts`]
			}
		];
		this.blogId = blogId;
		this.getDefaultBinding().set('subMenuActionDescriptionItems',Immutable.fromJS(menuItems));
	},
	//The function, which will call when user click on <Row> in Grid
	handleClick: function(postId) {
		document.location.hash += `${postId}`;
	},
	render: function() {
		const	binding 		= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding(),
				subBinding 		= binding.sub('actionDescriptorsSubRouting'),
				addButton 		= <div className="addButtonShort" onClick={() => document.location.hash += '/add'}><SVG icon="icon_add_news" /></div>,
				region          = RegionHelper.getRegion(globalBinding);


		return (
			<div>
				<SubMenu binding={{default: subBinding.sub('blogsRouting'), itemsBinding: binding.sub('subMenuActionDescriptionItems')}} />
				<div className="bSchoolMaster">
					<RouterView
						routes	= { binding.sub('blogsRouting') }
						binding	= { globalBinding }
					>
						<Route
							path		= "/blogs/:blogId/posts"
							binding		= { binding.sub('blogsList') }
							component	= { PostsList }
							handleClick	= { this.handleClick }
							addButton	= { addButton }
						/>
						<Route
							path		= "/blogs/:blogId/posts/add"
							binding		= { binding.sub('postForm') }
							component	= { PostAdd }
							blogId      = { this.blogId }
						/>
						<Route
							path		= "/blogs/:blogId/posts/edit"
							binding		= { binding.sub('postForm') }
							component	= { PostEdit }
							blogId      = { this.blogId }
						/>
					</RouterView>
				</div>
			</div>
		)
	}
});