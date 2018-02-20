import * as React from 'react'
import * as  Immutable from 'immutable'
import * as Morearty from 'morearty'

import 'styles/ui/b_cancel_event_manual_notification.scss';
import {ClubChildrenEditNotificationListPopup} from "module/as_manager/pages/clubs/club_children_edit/club_children_edit_notification_list_popup";
import {ClubsActions} from "module/as_manager/pages/clubs/clubs_actions";
import {ServiceList} from "module/core/service_list/service_list";

export const ClubChildrenEditNotificationListPopupWrapper = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		clubId:	(React as any).PropTypes.string.isRequired,
		schoolId: (React as any).PropTypes.string.isRequired,
		handleClickSubmitButton: (React as any).PropTypes.func.isRequired
	},
	componentWillMount() {
		const binding = this.getDefaultBinding();

		binding.set('isSync', false);
		ClubsActions.getAcceptableUsers(this.props.schoolId, this.props.clubId)
			.then(users => {
				const filteredUsers = users.filter(user => user.messageStatus === 'PENDING' || user.messageStatus === 'NOT_SENT')
					.map(user => {
						user.checked = true;
						user.userId = user.id;

						return user;
					});

				binding.set('clubAcceptableUsers', Immutable.fromJS(filteredUsers));
				binding.set('isSync', true);

				return true;
			});
	},
	componentWillUnmount() {
		this.getDefaultBinding().clear();
	},
	handleClickUserActivityCheckbox(userId: string, permissionId: string) {
		const binding = this.getDefaultBinding();

		const clubAcceptableUsers = binding.toJS('clubAcceptableUsers');
		const currentUserIndex = clubAcceptableUsers.findIndex(user =>
			user.userId === userId && user.permissionId === permissionId
		);
		clubAcceptableUsers[currentUserIndex].checked = !clubAcceptableUsers[currentUserIndex].checked;

		binding.set('clubAcceptableUsers', Immutable.fromJS(clubAcceptableUsers));
	},
	handleClickSubmitButton() {
		const binding = this.getDefaultBinding();

		const clubAcceptableUsers = binding.toJS('clubAcceptableUsers');
		const usersToSubmit = clubAcceptableUsers.filter(user => user.checked === true);

		this.props.handleClickSubmitButton(usersToSubmit);
	},
	render() {
		if(this.getDefaultBinding().toJS('isSync')) {
			return (
				<ClubChildrenEditNotificationListPopup
					users={this.getDefaultBinding().toJS('clubAcceptableUsers')}
					handleClickUserActivityCheckbox={(userId: string, permissionId: string) => this.handleClickUserActivityCheckbox(userId, permissionId)}
					handleClickSubmitButton={() => this.handleClickSubmitButton()}
					handleClickCancelButton={this.props.handleClickCancelButton}
				/>
			);
		} else {
			return null;
		}
	}
});