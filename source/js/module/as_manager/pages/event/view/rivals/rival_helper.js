const RivalHelper = {
	isShowScoreButtons: function(event, mode, isOwner) {
		return (
				event.status === "NOT_FINISHED" ||
				event.status === "FINISHED" ||
				event.status === "DRAFT" ||
				event.status === "ACCEPTED" ||
				event.status === "INVITES_SENT"
			) &&
			mode === 'closing' &&
			isOwner;
	}
};

module.exports = RivalHelper;