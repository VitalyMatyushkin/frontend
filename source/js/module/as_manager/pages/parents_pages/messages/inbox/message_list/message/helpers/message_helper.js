const MessageHelper = {
	getSchool: function(message) {
		let school;

		//TODO get school from child
		if(message.child.schoolId === message.event.inviterSchoolId) {
			school = message.inviterSchool;
		} else {
			//TODO search from array - invitedSchools
			school = message.invitedSchool;
		}

		return school;
	}
};

module.exports = MessageHelper;


