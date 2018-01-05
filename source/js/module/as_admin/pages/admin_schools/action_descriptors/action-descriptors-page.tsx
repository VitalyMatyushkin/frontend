/**
 * Created by vitaly on 04.01.18.
 */

import * as React from 'react';
import * as Morearty from 'morearty';
import * as RouterView from 'module/core/router';
import * as Route from 'module/core/route';

import	{ActionDescriptors}	from './action-descriptors';

export const ActionDescriptorsComponent = (React as any).createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const	binding 		= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding();
		
		return (
			<RouterView
				routes	= { binding.sub('actionDescriptorsRouting') }
				binding	= { globalBinding }
			>
				<Route
					path		= "/users/action_descriptors"
					binding		= { binding.sub('actionDescriptorsList') }
					component	= { ActionDescriptors }
				/>
			</RouterView>
		)
	}
});