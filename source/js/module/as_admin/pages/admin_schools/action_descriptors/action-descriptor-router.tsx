/**
 * Created by vitaly on 05.01.18.
 */

import * as React from 'react';
import * as Morearty from 'morearty';
import * as RouterView from 'module/core/router';
import * as Route from 'module/core/route';
import * as	Immutable from 'immutable';
import {SubMenu} from 'module/ui/menu/sub_menu';
import {ActionDescriptorItem} from './action-descriptor-item';
import {NotificationItem} from './notification-item';
import {NotificationTable} from './notification-table';


export const ActionDescriptorRouter = (React as any).createClass({
	mixins: [Morearty.Mixin],
	
	componentWillMount:function(){
		const 	globalBinding 		= this.getMoreartyContext().getBinding(),
				actionDescriptorId 	= globalBinding.get('routing.pathParameters.0');
		
		const menuItems = [
			{
				href:'/#users/action_descriptors',
				name: '← Action descriptors list',
				key:'back'
			},
			{
				href:`/#users/action_descriptor/${actionDescriptorId}/item`,
				name:'Action descriptor',
				key:'action_descriptor',
				routes:[`/users/action_descriptor/${actionDescriptorId}/item`]
			},
			{
				href:`/#users/action_descriptor/${actionDescriptorId}/notifications`,
				name:'Notifications',
				key:'action_descriptor_notifications',
				routes:[`/users/action_descriptor/${actionDescriptorId}/notifications`]
			}
		];
		this.getDefaultBinding().set('subMenuActionDescriptionItems',Immutable.fromJS(menuItems));
	},
	
	render: function() {
		const	binding 		= this.getDefaultBinding(),
				subBinding 		= binding.sub('actionDescriptorsSubRouting'),
				globalBinding	= this.getMoreartyContext().getBinding();
		
		return (
			<div>
				<SubMenu binding={{default: subBinding.sub('routing'), itemsBinding: binding.sub('subMenuActionDescriptionItems')}} />
				<div className="bSchoolMaster">
					<RouterView
						routes	= { subBinding.sub('routing') }
						binding	= { globalBinding }
					>
						<Route
							path		= "/users/action_descriptor/:adId/item"
							binding		= { subBinding }
							component	= { ActionDescriptorItem }
						/>
						<Route
							path		= "/users/action_descriptor/:adId/notifications"
							binding		= { subBinding }
							component	= { NotificationTable }
						/>
						<Route
							path		= "/users/action_descriptor/:adId/notifications/:notificationId"
							binding		= { subBinding }
							component	= { NotificationItem }
							mode 		= "ACTION_DESCRIPTOR"
						/>
					</RouterView>
				</div>
			</div>
		)
	}
});