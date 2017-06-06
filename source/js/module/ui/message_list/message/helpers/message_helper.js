const MessageHelper = {
	getSchool: function(message) {
		let school;

		//TODO get school from child
		if(message.schoolId === message.eventData.inviterSchoolId) {
			school = message.eventData.inviterSchool;
		} else {
			//TODO search from array - invitedSchools
			school = message.eventData.invitedSchool;
		}

		return school;
	}
};

module.exports = MessageHelper;


