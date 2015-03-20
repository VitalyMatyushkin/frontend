var Service = require('module/core/service'),
	serviceList,
	binding;


serviceList = {
	initialize: function(binding) {
        serviceList.me = new Service('/users/{ownerId}', binding);
		serviceList.logout = new Service('/users/logout', binding);

		// users
		serviceList.users = new Service('/users', binding);
		serviceList.user = new Service('/users/{id}', binding);

		// schools
		serviceList.schools = new Service('/schools', binding);
		serviceList.school = new Service('/schools/{id}', binding);
		serviceList.ownerSchools = new Service('/schools?filter[where][ownerId]={ownerId}', binding);

		// leaners
        serviceList.students = new Service('/students', binding);
		serviceList.schoolStudents = new Service('/students?filter[where][schoolId]={schoolId}', binding);
		serviceList.studentsFilter = new Service('/students', binding);
		serviceList.student = new Service('/students/{studentId}', binding);

		// houses
        serviceList.houses = new Service('/houses', binding);
		serviceList.housesFilter = new Service('/houses', binding);
		serviceList.schoolHouses = new Service('/houses?filter[where][schoolId]={schoolId}', binding);
		serviceList.house = new Service('/houses/{houseId}', binding);

		// forms
		serviceList.forms = new Service('/forms', binding);
		serviceList.formsFilter = new Service('/forms', binding);
		serviceList.schoolForms = new Service('/forms?filter[where][schoolId]={schoolId}', binding);
		serviceList.form = new Service('/forms/{formId}', binding);

		//events
		serviceList.events = new Service('/events', binding);
		serviceList.eventFindOne = new Service('/events/findOne', binding);
        serviceList.event = new Service('/events/{eventId}', binding);
        serviceList.participants = new Service('/events/{eventId}/participants', binding);

        // sports
        serviceList.sports = new Service('/sports', binding);

        // invites
        serviceList.invites = new Service('/invites', binding);
		serviceList.invite = new Service('/invites/{inviteId}', binding);
        serviceList.invitesByEvent = new Service('/events/{eventId}/invites', binding);
        serviceList.inviteRepay = new Service('/invites/{inviteId}/repay', binding);

        // teams
        serviceList.teamsBySchoolId = new Service('/teams?filter[where][schoolId]={schoolId}&filter[include]=events', binding);
        serviceList.playersRelation = new Service('/teams/{teamId}/players/rel/{studentId}', binding);
        serviceList.playersByTeam = new Service('/teams/{teamId}/players', binding);

        // result
        serviceList.results = new Service('/results', binding);
		serviceList.result = new Service('/results/{id}', binding);

        // points
        serviceList.pointsInResult = new Service('/results/{resultId}/points', binding);
		serviceList.studentPoints = new Service('/points?filter[where][studentId]={studentId}', binding);
		serviceList.points = new Service('/points', binding);
    }
};




module.exports = serviceList;