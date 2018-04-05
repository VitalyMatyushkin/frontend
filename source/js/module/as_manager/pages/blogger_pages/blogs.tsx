import * as  React from 'react'
import * as  Morearty from 'morearty'
import * as  Immutable from 'immutable'
import {RegionHelper} from 'module/helpers/region_helper'
import {SVG} from 'module/ui/svg'
import * as RouterView from 'module/core/router'
import * as Route from 'module/core/route'

import {BlogsList} from './blogs_list'
import {BlogAdd} from './add_blog'
import {BlogEdit} from './edit_blog'
import {PostsPage} from './post/posts_page'

export const Blogs = (React as any).createClass({
	mixins: [Morearty.Mixin],
	//The function, which will call when user click on <Row> in Grid
	handleClick: function(blogId) {
		document.location.hash = `blogs/${blogId}/posts`;
	},
	render: function() {
		const	binding 		= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding(),
				addButton 		= <div className="addButtonShort" onClick={() => document.location.hash = 'blogs/add'}><SVG icon="icon_add_news" /></div>,
				region          = RegionHelper.getRegion(globalBinding);


		return (
			<RouterView
				routes	= { binding.sub('blogsRouting') }
                binding	= { globalBinding }
			>
				<Route
					path		= "/blogs"
					binding		= { binding.sub('blogsList') }
					component	= { BlogsList }
					handleClick	= { this.handleClick }
					addButton	= { addButton }
				/>
				<Route
					path		= "/blogs/add"
					binding		= { binding.sub('blogForm') }
					component	= { BlogAdd }
				/>
				<Route
					path		= "/blogs/edit"
					binding		= { binding.sub('blogForm') }
					component	= { BlogEdit }
				/>
				<Route
					path 		= "/blogs/:blogId/posts"
					binding 	= { binding.sub('posts') }
					component 	= { PostsPage }
				/>
			</RouterView>
		)
	}
});