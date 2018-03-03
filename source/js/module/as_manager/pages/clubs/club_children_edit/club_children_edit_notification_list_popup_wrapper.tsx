import * as React from 'react'
import * as Immutable from 'immutable'
import * as Morearty from 'morearty'

import {ClubChildrenEditNotificationListPopup} from "module/as_manager/pages/clubs/club_children_edit/club_children_edit_notification_list_popup";
import {ClubsActions} from "module/as_manager/pages/clubs/clubs_actions";

import 'styles/ui/b_cancel_event_manual_notification.scss';
import {Item} from "module/ui/checkbox_list/models/item";
import {ExtraItem} from "module/ui/checkbox_list/models/extra_item";

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

				binding.set('itemsArray', Immutable.fromJS(this.getItemsArrayByChildArray(filteredUsers)));
				binding.set('isSync', true);

				return true;
			});
	},
	componentWillUnmount() {
		this.getDefaultBinding().clear();
	},
	getItemsArrayByChildArray(childArray: any[]): Item[] {
		return childArray.map(child => this.getItemByChild(child));
	},
	getItemByChild(child): Item {
		return {
			id: child.id,
			text: `${child.firstName} ${child.lastName}`,
			additionalData: {
				userId: child.id,
				permissionId: child.permissionId
			},
			extraItems: this.getExtraItemsByParents(child.parents),
			checked: child.messageStatus !== 'PENDING'
		};
	},
	getExtraItemsByParents(parents): ExtraItem[] {
		return parents.map(parent => {
			return {
				id: parent.userId,
				text: `${parent.firstName} ${parent.lastName}`,
				additionalData: {
					userId: parent.userId,
					permissionId: parent.permissionId
				}
			}
		});
	},
	handleClickItemCheckbox(id: string) {
		const binding = this.getDefaultBinding();

		const itemsArray = binding.toJS('itemsArray');
		const currentItemIndex = itemsArray.findIndex(item => item.id === id);
		itemsArray[currentItemIndex].checked = !itemsArray[currentItemIndex].checked;

		binding.set('itemsArray', Immutable.fromJS(itemsArray));
	},
	handleClickSubmitButton() {
		const binding = this.getDefaultBinding();

		const itemsArray = binding.toJS('itemsArray');
		const itemsToSubmit = itemsArray.filter(item => item.checked === true);

		this.props.handleClickSubmitButton(itemsToSubmit);
	},
	render() {
		if(this.getDefaultBinding().toJS('isSync')) {
			return (
				<ClubChildrenEditNotificationListPopup
					listItems={this.getDefaultBinding().toJS('itemsArray')}
					handleClickItemCheckbox={(id: string) => this.handleClickItemCheckbox(id)}
					handleClickSubmitButton={() => this.handleClickSubmitButton()}
					handleClickCancelButton={this.props.handleClickCancelButton}
				/>
			);
		} else {
			return null;
		}
	}
});