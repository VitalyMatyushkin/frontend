import * as React from 'react';
import * as Immutable from 'immutable';
import * as Morearty from 'morearty';

import { ClubsChildrenBooking } from 'module/as_manager/pages/clubs/clubs_children_booking/clubs_children_booking';
import { ClubBookingChildModel } from "module/as_manager/pages/clubs/clubs_children_booking/club_booking_child/club_booking_child_model";
import { ClubsChildrenBookingHeader } from "module/as_manager/pages/clubs/clubs_children_booking/clubs_children_booking_header";


export const ClubsChildrenBookingWrapper = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount() {
		const children = this.convertServerDataToClientModels();

		this.getDefaultBinding().set('children', Immutable.fromJS(children));
	},

	convertServerDataToClientModels() {
		const children = [];
		for(let i = 0; i < 5; i++) {
			children.push(
				new ClubBookingChildModel(
					this.getChildModelData(
						`childName${i}`,
						`form${i}`,
						`parentName${i}`,
						'status'
					)
				)
			);
		}

		return children;
	},

	getChildModelData(childName, formName, parentName, status) {
		return {
			childName,
			formName,
			parentName,
			status
		};
	},

	render() {
		return (
			<div className='bClubsChildrenBookingWrapper'>
				<ClubsChildrenBookingHeader/>
				<ClubsChildrenBooking
					children    = { this.getDefaultBinding().toJS('children') }
				/>
			</div>
		);
	}
});
