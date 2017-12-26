import * as Immutable from 'immutable';
import { ClubBookingChildModel } from "module/as_manager/pages/clubs/clubs_children_booking/club_booking_child/club_booking_child_model";
import { ClubsChildrenBookingHelper } from "module/as_manager/pages/clubs/clubs_children_booking/clubs_children_booking_helper/clubs_children_booking_helper";

export class ClubsChildrenBookingActions {
	handleSendMessages(schoolId, clubId, binding) {
		binding.set('isSync', false);
		this.sendMessages(schoolId, clubId)
			.then(() => {
				return this.getClubBookingChildren(schoolId, clubId)
			})
			.then(children => {
				(window as any).simpleAlert('Messages to the parents have been sent successfully.');
				binding.set('isSync', true);
				binding.set('children', Immutable.fromJS(children));
			});
	}

	sendMessages(schoolId, clubId) {
		return (window as any).Server.schoolClubSendMessages.post(
			{
				schoolId:	schoolId,
				clubId:		clubId
			},
			{}
		);
	}

	getClubBookingChildren(schoolId, clubId) {
		return (window as any).Server.schoolClubAcceptableUsers.get(
			{ schoolId, clubId }
		).then(students => {
			return this.convertServerDataToClientModels(students);
		});
	}

	convertServerDataToClientModels(students) {
		return students.map(student =>
			new ClubBookingChildModel(
				this.getChildModelData(
					`${student.firstName} ${student.lastName}`,
					student.form.name,
					student.house.name,
					this.getStringParentsNameByStudent(student),
					ClubsChildrenBookingHelper.getClientMessageStatusValueByServerValue(student.messageStatus)
				)
			)
		);
	}

	getStringParentsNameByStudent(student) {
		return typeof student.parents !== 'undefined' ?
			student.parents.join(','):
			'';
	}

	getChildModelData(childName, formName, houseName, parentName, messageStatus) {
		return {
			childName,
			formName,
			houseName,
			parentName,
			messageStatus
		};
	}
}