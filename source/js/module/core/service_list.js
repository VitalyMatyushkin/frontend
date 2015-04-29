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
        serviceList.schoolsFindOne = new Service('/schools/findOne', binding);
		serviceList.school = new Service('/schools/{id}', binding);
		serviceList.schoolInfo = new Service('/schools/findOne?filter[where][id]={id}&filter[include]=zipCode', binding);

        serviceList.eventsBySchoolId = new Service('/schools/{schoolId}/events', binding);
        serviceList.ownerSchools = new Service('/schools?filter[where][ownerId]={ownerId}', binding);
		serviceList.schoolCoaches = new Service('/schools/{id}/coaches', binding);


		// students
        serviceList.students = new Service('/schools/{schoolId}/students', binding);
		serviceList.student = new Service('/students/{studentId}', binding);

		// houses
        serviceList.houses = new Service('/schools/{schoolId}/houses', binding);
		serviceList.house = new Service('/houses/{houseId}', binding);

		// forms
		serviceList.forms = new Service('/schools/{schoolId}/forms', binding);
		serviceList.form = new Service('/forms/{formId}', binding);

		// news
		serviceList.news = new Service('/schools/{schoolId}/news', binding);
		serviceList.oneNews = new Service('/news/{formId}', binding);

		//events
		serviceList.events = new Service('/events', binding);
		serviceList.eventFindOne = new Service('/events/findOne', binding);
        serviceList.event = new Service('/events/{eventId}', binding);
        serviceList.participants = new Service('/events/{eventId}/participants', binding);

        // sports
        serviceList.sports = new Service('/sports', binding);

        // invites
        serviceList.invites = new Service('/invites', binding);
        serviceList.invitesFindOne = new Service('/invites/findOne', binding);
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

		// postcode
		serviceList.postCode = new Service('/zipcodes', binding);
		serviceList.findPostCode = new Service('/zipcodes/findOne?filter[where][zipCode]={postCode}', binding);
		serviceList.findPostCodeById = new Service('/zipcodes/findOne?filter[where][id]={postCode}', binding);
    }
};




module.exports = serviceList;