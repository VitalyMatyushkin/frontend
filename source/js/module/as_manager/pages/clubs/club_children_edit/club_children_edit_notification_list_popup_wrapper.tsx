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
				const filteredUsers = users.filter(user =>
						(user.messageStatus === 'PENDING' || user.messageStatus === 'NOT_SENT') &&
						typeof user.parents !== 'undefined' &&
						user.parents.length > 0
					);

				const parents = [];
				filteredUsers.forEach(user => user.parents.forEach(_parent => {
					const parent = Object.assign({}, _parent);
					parent.extra = {
						type: 'PARENT',
						parentOf: {
							userId: user.id,
							permissionId: user.permissionId,
							firstName: user.firstName,
							lastName: user.lastName
						}
					};

					parents.push(parent)
				}));
				let preparedParentArray = parents.map(parent => {
						parent.checked = true;

						return parent;
					});

				binding.set('parents', Immutable.fromJS(preparedParentArray));
				binding.set('isSync', true);

				return true;
			});
	},
	componentWillUnmount() {
		this.getDefaultBinding().clear();
	},
	handleClickUserActivityCheckbox(userId: string, permissionId: string) {
		const binding = this.getDefaultBinding();

		const parents = binding.toJS('parents');
		const currentUserIndex = parents.findIndex(parent =>
			parent.userId === userId && parent.permissionId === permissionId
		);
		parents[currentUserIndex].checked = !parents[currentUserIndex].checked;

		binding.set('parents', Immutable.fromJS(parents));
	},
	handleClickSubmitButton() {
		const binding = this.getDefaultBinding();

		const parents = binding.toJS('parents');
		const usersToSubmit = parents.filter(parent => parent.checked === true);

		this.props.handleClickSubmitButton(usersToSubmit);
	},
	render() {
		if(this.getDefaultBinding().toJS('isSync')) {
			return (
				<ClubChildrenEditNotificationListPopup
					users={this.getDefaultBinding().toJS('parents')}
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