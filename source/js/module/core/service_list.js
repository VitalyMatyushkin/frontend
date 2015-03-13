var Service = require('module/core/service'),
	serviceList,
	binding;


serviceList = {
	initialize: function(binding) {
        serviceList.me = new Service('/users/{ownerId}', binding);
		serviceList.logout = new Service('/users/logout', binding);

		// schools
		serviceList.schools = new Service('/schools', binding);
		serviceList.school = new Service('/schools/{id}', binding);
		serviceList.ownerSchools = new Service('/schools?filter[where][ownerId]={ownerId}', binding);

		// leaners
        serviceList.learners = new Service('/schools/{schoolId}/learners', binding);
		serviceList.learnersFilter = new Service('/learners', binding);
		serviceList.learner = new Service('/schools/{schoolId}/learners/{learnerId}', binding);

		// houses
        serviceList.houses = new Service('/houses', binding);
		serviceList.housesFilter = new Service('/houses', binding);
		serviceList.schoolHouses = new Service('/houses?filter[where][schoolId]={schoolId}', binding);
		serviceList.house = new Service('/houses/{houseId}', binding);

		// classes
		serviceList.classes = new Service('/classes', binding);
		serviceList.classesFilter = new Service('/classes', binding);
		serviceList.schoolClasses = new Service('/classes?filter[where][schoolId]={schoolId}', binding);
		serviceList.class = new Service('/classes/{classId}', binding);

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
        serviceList.playersRelation = new Service('/teams/{teamId}/players/rel/{learnerId}', binding);
        serviceList.playersByTeam = new Service('/teams/{teamId}/players', binding);
    }
};




module.exports = serviceList;