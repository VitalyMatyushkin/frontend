export class ClubsChildrenBookingHelper {
	getClientMessageStatusValueByServerValue(serverValue) {
		const map = {
			"NOT_SENT": 'Not sent',
			"PENDING":  'Pending',
			"ACCEPTED": 'Accepted',
			"REJECTED": 'Rejected'
		};

		return map[serverValue];
	}
}