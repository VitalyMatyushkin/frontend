import * as React from 'react'
import * as Morearty from 'morearty'
import * as RouterView from 'module/core/router'
import * as Route from 'module/core/route'
import * as LogoutRoute from 'module/core/routes/logout_route'
import * as SettingsRoute from 'module/core/routes/settings_route'
import * as VerifyRoute from 'module/core/routes/verify_route'

import { SupportedBrowsers } from 'module/shared_pages/supported_browsers/supported_browsers'
import { Blogs } from 'module/as_manager/pages/blogger_pages/blogs'

/**
 * It's a router for user with blogger role.
 */
export const BloggerRouter = (React as any).createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<RouterView
				routes	= {binding.sub('routing')}
               binding	= {binding}
			>
				<LogoutRoute	binding	= {binding.sub('userData')}/>
				<VerifyRoute	binding	= {binding.sub('userData')}/>
				<SettingsRoute	binding	= {binding.sub('userData')}/>

				<Route
					path		= '/blogs /blogs/:subPage /blogs/:blogId/posts /blogs/:blogId/posts/:subPage'
					binding		= {binding.sub('blogs')}
					component	= {Blogs}
				/>
				<Route
					path		= "/supported_browsers"
					binding		= {binding.sub('supported_browsers')}
					component	= {SupportedBrowsers}
				/>
			</RouterView>
		);
	}
});