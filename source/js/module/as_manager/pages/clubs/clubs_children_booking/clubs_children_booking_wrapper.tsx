import * as React from 'react';
import * as Immutable from 'immutable';
import * as Morearty from 'morearty';

import { ClubsChildrenBooking } from 'module/as_manager/pages/clubs/clubs_children_booking/clubs_children_booking';
import { ClubsChildrenBookingHeader } from "module/as_manager/pages/clubs/clubs_children_booking/clubs_children_booking_header";
import { ClubsChildrenBookingActions } from "module/as_manager/pages/clubs/clubs_children_booking/clubs_children_booking_actions/clubs_children_booking_actions";

import * as Loader from 'module/ui/loader';

const ClubsChildrenBookingWrapperStyle = require('styles/ui/b_clubs_children_booking_wrapper/b_clubs_children_booking_wrapper.scss');

export const ClubsChildrenBookingWrapper = (React as any).createClass({
	mixins: [Morearty.Mixin],

	ClubsChildrenBookingActions: new ClubsChildrenBookingActions(),

	componentWillMount() {

		this.getDefaultBinding().set('isSync', false);

		this.ClubsChildrenBookingActions.getClubBookingChildren(
			this.props.activeSchoolId,
			this.props.clubId
		).then(children => {
			this.getDefaultBinding().set('isSync', true);
			this.getDefaultBinding().set('children', Immutable.fromJS(children));
		});
	},

	render() {
		let content = null;

		if(this.getDefaultBinding().toJS('isSync')) {
			content = (
				<div className='bClubsChildrenBookingWrapper'>
					<ClubsChildrenBookingHeader/>
					<ClubsChildrenBooking
						children            = { this.getDefaultBinding().toJS('children') }
						handleSendMessages  = {
							() => this.ClubsChildrenBookingActions.handleSendMessages(
								this.props.activeSchoolId,
								this.props.clubId,
								this.getDefaultBinding()
							)
						}
					/>
				</div>
			);
		} else {
			content = (
				<div className='bClubsChildrenBookingWrapper'>
					<Loader condition={true}/>
				</div>
			);
		}

		return content;
	}
});
