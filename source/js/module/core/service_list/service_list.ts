import {Service} from 'module/core/service';

import * as ImageService from "module/core/services/ImageService";

import {Role} from "module/models/role/role";
import {Sport} from "module/models/sport/sport";
import {Permission} from "module/models/permission/permission";
import {Club} from "module/models/club/club";
import {Place} from "module/models/place/place";
import {Profile} from "module/models/profile/profile";
import {Message} from "module/models/messages/message";

/** Collection of services to reach REST API from server */
export class ServiceList {
	// authorization
	_login: Service;
	roles: Service<Role[], Role, any>;
	_become: Service;

	//sessions
	sessions: Service;
	sessionKey: Service;

	// password
	passwordsResetRequest: Service;
	passwordsReset: Service;

	// profile
	profile: Service<Profile, Profile, any>;
	profileEmail: Service;
	profileEmailResend: Service;
	profilePhone: Service;
	profilePhoneResend: Service;
	profilePermissions: Service;
	profilePermission: Service;
	profileRequests: Service;
	profileRequest: Service;
	changePassword: Service;

	// users
	confirmUser: Service;
	confirmUserPhone: Service;
	users: Service;
	usersCount: Service;
	user: Service;

	// schools
	schools: Service;
	schoolUnionSchools: Service;
	schoolUnionSchool: Service;
	school: Service;
	schoolSettings: Service;
	publicSchool: Service;
	publicSchools: Service;
	publicSchoolSports: Service<Sport[], Sport, any>;
	publicSchoolCheckPassword: Service;
	publicBigscreenCheckPassword: Service;

	schoolSports: Service<Sport[], Sport, any>;
	schoolSport: Service<Sport, Sport, any>;

	// clubs
	schoolClubs: Service<Club[], Club, any>;
	schoolClub: Service<Club, Club, any>;
	schoolClubAcceptableUsers: Service;
	schoolClubParticipants: Service;
	schoolClubParticipant: Service;
	schoolClubActivate: Service;
	schoolClubSendMessages: Service;

	// places
	schoolPlaces: Service<Place[], Place, any>;
	schoolPlace: Service<Place, Place, any>;
	schoolPlacesAndPostcodes: Service;

	// students
	schoolStudents: Service;
	schoolStudentsCount: Service;
	schoolStudent: Service;
	schoolStudentParents: Service;
	schoolStudentSports: Service<Sport[], Sport, any>;
	schoolStudentAchievements: Service;
	schoolStudentTeamEvents: Service
	schoolStudentEvents: Service;
	schoolStudentMerge: Service;

	// forms
	schoolForms: Service;
	schoolForm: Service;
	publicSchoolForms: Service;
	publicSchoolForm: Service;

	// houses
	schoolHouses: Service;
	schoolHouse: Service;
	publicSchoolHouses: Service;
	publicSchoolHouse: Service;

	// teams
	teams: Service;
	team: Service;
	cloneTeam: Service;
	cloneAsPrototypeTeam: Service;
	schoolTeamStudents: Service;
	teamsBySchoolId: Service;
	teamPlayers: Service;
	teamPlayer: Service;
	schoolTeamPlayersBatch: Service;

	// news
	schoolNews: Service;
	schoolNewsCount: Service;
	publicSchoolNews: Service;
	publicSchoolNewsItem: Service;
	schoolNewsItem: Service;

	//Permission Requests
	permissionRequests: Service;
	permissionRequestsCount: Service;
	permissionRequest: Service;
	statusPermissionRequest: Service;

	//Permissions
	schoolUserPermissions: Service<Permission[], Permission, any>;
	schoolUserPermission: Service<Permission, Permission, any>;

	// sports
	sport: Service<Sport, Sport, any>;
	sports: Service<Sport[], Sport, any>;

	//events
	events: Service;
	publicSchoolUnionStats: Service;
	publicSchoolUnionSchools: Service;
	eventCancel: Service;
	schoolEventChangeOpponent: Service;
	schoolEvent: Service;
	schoolEventSettings: Service;
	schoolEventGroup: Service;
	schoolEventInvites: Service;
	schoolEventDetails: Service;
	schoolEventGroupDetails: Service;
	schoolEventDates: Service;
	schoolEventActivate: Service;
	schoolEventTeams: Service;
	schoolEventTeamPlayersBatch: Service;
	schoolEventIndividuasPlayersBatch: Service;
	schoolEventTeam: Service;
	schoolEventPhoto: Service;
	schoolEventPhotos: Service;
	schoolEventOpponents: Service;

	// event individuals
	schoolEventIndividual: Service;
	schoolEventIndividuals: Service;
	schoolEventIndividualsBatch: Service;
	schoolEventIndividualsGroupBatch: Service;

	// event individual performance
	schoolEventIndividualPerformance: Service;
	schoolEventIndividualPerformancePoint: Service;
	schoolEventIndividualDiscipline: Service;
	schoolEventIndividualDisciplinePoint: Service;

	schoolEventResultSchoolScores: Service;
	schoolEventResultSchoolScore: Service;
	schoolEventResultTeamScores: Service;
	schoolEventResultTeamScore: Service;
	schoolEventResultHousesScores: Service;
	schoolEventResultHousesScore: Service;
	schoolEventResultIndividualsScores: Service;
	schoolEventResultIndividualsScore: Service;
	schoolEventResultCricket: Service;

	schoolEventTeamPlayers: Service;
	schoolEventTeamPlayer: Service;
	schoolEventResult: Service;
	schoolEventReport: Service;
	schoolEventTasks: Service;
	schoolEventTask: Service;

	addPointToSchoolEventResult: Service;
	finishSchoolEvent: Service;
	schoolEventInvite: Service;
	addTeamToschoolEvent: Service;

	publicSchoolEvent: Service;
	publicSchoolEvents: Service;
	publicSchoolEventReport: Service;
	publicSchoolEventTeams: Service;
	publicSchoolEventTeam: Service;
	publicSchoolEventDates: Service;
	publicSchoolEventPhotos: Service;

	// invites
	schoolInvites				: Service;
	schoolInvite 				: Service;
	schoolInboxInvites 			: Service;
	schoolOutboxInvites 		: Service;
	schoolArchiveInvites		: Service;
	acceptSchoolInvite			: Service;
	declineSchoolInvite			: Service;
	cancelSchoolInvite			: Service;
	schoolInviteComments		: Service;
	schoolInviteCommentsCount	: Service;
	inviteInboxCount			: Service;
	inviteOutboxCount			: Service;
	inviteArchiveCount			: Service;

	// messages
	// it's some invitation message
	schoolEventsInvitationMessages	: Service;
	// it's school worker inbox
	schoolEventsMessages			: Service<Message[], Message, any>;
	schoolEventsMessagesCount		: Service;
	schoolEventsMessagesInbox		: Service<Message[], Message, any>;
	schoolEventsMessagesInboxCount  : Service;
	schoolEventsMessagesOutbox		: Service<Message[], Message, any>;
	schoolEventsMessagesArchive		: Service<Message[], Message, any>;

	sendInvitationMessagesForEvent	: Service;
	doGotItActionForEventMessage	: Service;

	//event message comments
	schoolEventMessageComments: Service;
	schoolEventMessageCommentsCount: Service;

	// event comments
	schoolEventComment: Service;
	schoolEventComments: Service;
	schoolEventCommentsCount: Service;

	// albums
	schoolAlbum: Service;
	schoolEventAlbums: Service;
	schoolEventAlbum: Service;

	// photos
	schoolAlbumPhotos: Service;
	schoolAlbumPhoto: Service;
	schoolEventAlbumPhotos: Service;
	schoolEventAlbumPhoto: Service;
	publicSchoolAlbumPhotos: Service;

	// children
	children: Service;
	childrenEvents: Service;
	childrenEventParticipationRefuse: Service;
	childrenEventsDates: Service;
	childrenEventsCount: Service;
	child: Service;
	childEvents: Service;
	childEventPhotos: Service;
	childEventPhoto: Service;
	childParents: Service;

	childMessage: Service;
	childEventMessages: Service;
	childMessageInbox: Service;
	childMessageInboxCount: Service;
	childMessageOutbox: Service;
	childMessageArchive: Service;
	childMessageAccept: Service;
	childMessageReject: Service;

	childClubMessageAccept: Service;
	childClubMessageReject: Service;

	//children event message comments
	childrenEventMessageComments: Service;
	childrenEventMessageCommentsCount: Service;

	parentEventReportAvailability: Service;

	// Student
	studentSchoolEventsCount: Service;
	studentSchoolEventsDates: Service;
	studentSports: Service<Sport[], Sport, any>;
	studentAchievements: Service;
	studentTeamEvents: Service;
	studentSchoolEvents: Service;
	studentSchoolEvent: Service;
	studentEventReportAvailability: Service;

	// Students -> Messages
	studentMessages			: Service;
	studentInboxMessages	: Service;
	studentOutboxMessages	: Service;
	studentArchiveMessages	: Service;

	// Integrations
	integrationGoogleCalendar: Service;
	integrationTwitter: Service;
	integrationTwitterTweet: Service;
	integrations: Service;
	integration: Service;

	// postcode
	postCodes: Service;
	postCodeById: Service;

	// invite
	invite: Service;

	//check
	phoneCheck: Service;

	//age group
	ageGroups: Service;

	//school notifications
	schoolNotifications: Service;

	//user setting notifications
	userNotificationChannels: Service;
	userNotificationChannel: Service;

	//consent request template
	consentRequestTemplate: Service;

	//Tournaments
	schoolTournaments: Service;
	publicTournaments: Service;
	schoolTournament: Service;

	actionDescriptor : Service;

	//Achievements
	childrenSports: Service;
	childSports: Service;
	childrenAchievements: Service;
	childAchievements: Service;
	childTeamEvents: Service;

	images: object;

	// Services which require authorization
	constructor(binding) {
		// authorization
		this._login = new Service('/i/login', binding);
		this.roles = new Service<Role[], Role, any>('/i/roles', binding);
		this._become = new Service('/i/roles/{roleName}/become', binding);

		//sessions
		this.sessions = new Service('/i/sessions', binding);
		this.sessionKey = new Service('/i/sessions/{key}', binding);

		// password
		this.passwordsResetRequest = new Service('/public/passwords/resetRequest', binding);
		this.passwordsReset = new Service('/public/passwords/reset', binding);

		// profile
		this.profile = new Service<Profile, Profile, any>('/i/profile', binding);
		this.profileEmail = new Service('/i/profile/email', binding);
		this.profileEmailResend = new Service('/i/profile/email/resend', binding);
		this.profilePhone = new Service('/i/profile/phone', binding);
		this.profilePhoneResend = new Service('/i/profile/phone/resend', binding);
		this.profilePermissions = new Service('/i/permissions', binding);
		this.profilePermission = new Service('/i/permissions/{permissionId}', binding);
		this.profileRequests = new Service('/i/permissions/requests', binding);
		this.profileRequest = new Service('/i/permissions/requests/{prId}', binding);
		this.changePassword = new Service('/i/profile/password', binding);

		// users
		this.confirmUser = new Service('/i/confirm/email',binding);
		this.confirmUserPhone = new Service('/i/confirm/phone',binding);
		this.users = new Service('/i/schools/{schoolId}/users', binding);
		this.usersCount = new Service('/i/schools/{schoolId}/users/count', binding);
		this.user = new Service('/i/schools/{schoolId}/users/{userId}', binding);

		// schools
		this.schools = new Service('/i/schools', binding);
		this.schoolUnionSchools = new Service('/i/schools/{schoolUnionId}/schools', binding);
		this.schoolUnionSchool = new Service('/i/schools/{schoolUnionId}/schools/{schoolId}', binding);
		this.school = new Service('/i/schools/{schoolId}', binding);
		this.schoolSettings = new Service('/i/schools/{schoolId}/settings', binding);
		this.publicSchool = new Service('/public/schools/{schoolId}', binding);
		this.publicSchools = new Service('/public/schools', binding);
		this.publicSchoolSports = new Service<Sport[], Sport, any>('/public/schools/{schoolId}/sports', binding);
		this.publicSchoolCheckPassword = new Service('/public/schools/{schoolId}/publicSite/password/check', binding);
		this.publicBigscreenCheckPassword = new Service('/public/schools/{schoolId}/publicBigscreenSite/password/check', binding);

		this.schoolSports = new Service<Sport[], Sport, any>('/i/schools/{schoolId}/sports', binding);
		this.schoolSport = new Service<Sport, Sport, any>('/i/schools/{schoolId}/sports/{sportId}', binding);

		// clubs
		this.schoolClubs = new Service<Club[], Club, any>('/i/schools/{schoolId}/clubs', binding);
		this.schoolClub = new Service<Club, Club, any>('/i/schools/{schoolId}/clubs/{clubId}', binding);
		this.schoolClubAcceptableUsers = new Service('/i/schools/{schoolId}/clubs/{clubId}/acceptableUsers', binding);
		this.schoolClubParticipants = new Service('/i/schools/{schoolId}/clubs/{clubId}/participants', binding);
		this.schoolClubParticipant = new Service('/i/schools/{schoolId}/clubs/{clubId}/participants/{participantId}', binding);
		this.schoolClubActivate = new Service('/i/schools/{schoolId}/clubs/{clubId}/activate', binding);
		this.schoolClubSendMessages = new Service('/i/schools/{schoolId}/clubs/{clubId}/messages/invite', binding);

		// places
		this.schoolPlaces = new Service<Place[], Place, any>('/i/schools/{schoolId}/places', binding);
		this.schoolPlace = new Service<Place, Place, any>('/i/schools/{schoolId}/places/{placeId}', binding);
		this.schoolPlacesAndPostcodes = new Service('/i/schools/{schoolId}/placesAndPostcodes', binding);

		// students
		this.schoolStudents = new Service('/i/schools/{schoolId}/students', binding);
		this.schoolStudentsCount = new Service('/i/schools/{schoolId}/students/count', binding);
		this.schoolStudent = new Service('/i/schools/{schoolId}/students/{studentId}', binding);
		this.schoolStudentParents = new Service('/i/schools/{schoolId}/students/{studentId}/parents', binding);
		this.schoolStudentEvents = new Service('/i/schools/{schoolId}/students/{studentId}/events', binding);
		this.schoolStudentSports = new Service<Sport[], Sport, any>('/i/schools/{schoolId}/student/{studentId}/sports', binding);
		this.schoolStudentAchievements = new Service('/i/schools/{schoolId}/student/{studentId}/achievements', binding);
		this.schoolStudentTeamEvents = new Service('/i/schools/{schoolId}/student/{studentId}/teamSports/{sportId}/teamEvents', binding);
		this.schoolStudentMerge = new Service('/i/schools/{schoolId}/students/{studentId}/merge', binding);

		// forms
		this.schoolForms = new Service('/i/schools/{schoolId}/forms', binding);
		this.schoolForm 	= new Service('/i/schools/{schoolId}/forms/{formId}', binding);
		this.publicSchoolForms 	= new Service('/public/schools/{schoolId}/forms', undefined);
		this.publicSchoolForm 	= new Service('/public/schools/{schoolId}/forms/{formId}', undefined);

		// houses
		this.schoolHouses 	= new Service('/i/schools/{schoolId}/houses', binding);
		this.schoolHouse 	= new Service('/i/schools/{schoolId}/houses/{houseId}', binding);
		this.publicSchoolHouses 	= new Service('/public/schools/{schoolId}/houses', binding);
		this.publicSchoolHouse 	= new Service('/public/schools/{schoolId}/houses/{houseId}', binding);

		// teams
		this.teams = new Service('/i/schools/{schoolId}/teams', binding);
		this.team = new Service('/i/schools/{schoolId}/teams/{teamId}', binding);
		this.cloneTeam = new Service('/i/schools/{schoolId}/teams/{teamId}/clone', binding);
		this.cloneAsPrototypeTeam = new Service('/i/schools/{schoolId}/teams/{teamId}/copyAsPrototype', binding);
		this.schoolTeamStudents = new Service('/i/schools/{schoolId}/teams/{teamId}/students', binding);
		this.teamsBySchoolId = new Service('/i/schools/{schoolId}/teams', binding);
		this.teamPlayers = new Service('/i/schools/{schoolId}/teams/{teamId}/players', binding);
		this.teamPlayer = new Service('/i/schools/{schoolId}/teams/{teamId}/players/{playerId}', binding);
		this.schoolTeamPlayersBatch = new Service('/i/schools/{schoolId}/teams/{teamId}/players/batch', binding);

		// news
		this.schoolNews = new Service('/i/schools/{schoolId}/news', binding);
		this.schoolNewsCount = new Service('/i/schools/{schoolId}/news/count', binding);
		this.publicSchoolNews = new Service('/public/schools/{schoolId}/news',binding);
		this.publicSchoolNewsItem = new Service('/public/schools/{schoolId}/news/{newsId}',binding);
		this.schoolNewsItem = new Service('/i/schools/{schoolId}/news/{newsId}',binding);

		//Permission Requests
		this.permissionRequests = new Service('/i/schools/{schoolId}/permissions/requests',binding);
		this.permissionRequestsCount = new Service('/i/schools/{schoolId}/permissions/requests/count',binding);
		this.permissionRequest = new Service('/i/schools/{schoolId}/permissions/requests/{prId}',binding);
		this.statusPermissionRequest = new Service('/i/schools/{schoolId}/permissions/requests/{prId}/status', binding);

		//Permissions
		this.schoolUserPermissions = new Service<Permission[], Permission, any>('/i/schools/{schoolId}/users/{userId}/permissions',binding);
		this.schoolUserPermission = new Service<Permission, Permission, any>('/i/schools/{schoolId}/users/{userId}/permissions/{permissionId}',binding);

		// sports
		this.sport = new Service<Sport, Sport, any>('/public/sports/{sportId}', binding);
		this.sports = new Service<Sport[], Sport, any>('/public/sports', binding);

		//events
		this.events = new Service('/i/schools/{schoolId}/events', binding);
		this.publicSchoolUnionStats = new Service('/public/schools/{schoolUnionId}/events/stats', binding);
		this.publicSchoolUnionSchools = new Service('/public/schools/{schoolUnionId}/schools', binding);
		this.eventCancel = new Service('/i/schools/{schoolId}/events/{eventId}/cancel', binding);
		this.schoolEventChangeOpponent = new Service('/i/schools/{schoolId}/events/{eventId}/changeOpponent', binding);
		this.schoolEvent = new Service('/i/schools/{schoolId}/events/{eventId}', binding);
		this.schoolEventSettings = new Service('/i/schools/{schoolId}/events/{eventId}/settings', binding);
		this.schoolEventGroup = new Service('/i/schools/{schoolId}/events/{eventId}/rgroup', binding);
		this.schoolEventInvites = new Service('/i/schools/{schoolId}/events/{eventId}/invites', binding);
		this.schoolEventDetails = new Service('/i/schools/{schoolId}/events/{eventId}/details', binding);
		this.schoolEventGroupDetails = new Service('/i/schools/{schoolId}/events/{eventId}/groupDetails', binding);
		this.schoolEventDates = new Service('/i/schools/{schoolId}/events/dates/distinct', binding);
		this.schoolEventActivate = new Service('/i/schools/{schoolId}/events/{eventId}/activate', binding);
		this.schoolEventTeams = new Service('/i/schools/{schoolId}/events/{eventId}/teams', binding);
		this.schoolEventTeamPlayersBatch = new Service('/i/schools/{schoolId}/events/{eventId}/teams/{teamId}/players/batch', binding);
		this.schoolEventTeam = new Service('/i/schools/{schoolId}/events/{eventId}/teams/{teamId}', binding);
		this.schoolEventPhoto = new Service('/i/schools/{schoolId}/events/{eventId}/photos/{photoId}', binding);
		this.schoolEventPhotos = new Service('/i/schools/{schoolId}/events/{eventId}/photos', binding);
		this.schoolEventOpponents = new Service('/i/schools/{schoolId}/events/{eventId}/opponents', binding);
		// this.schoolEventPdf = new Service('/i/schools/{schoolId}/events/{eventId}/pdf', binding);

		// event individuals
		this.schoolEventIndividual = new Service('/i/schools/{schoolId}/events/{eventId}/individuals/{individualId}', binding);
		this.schoolEventIndividuals = new Service('/i/schools/{schoolId}/events/{eventId}/individuals/', binding);
		this.schoolEventIndividuals = new Service('/i/schools/{schoolId}/events/{eventId}/individuals/', binding);
		this.schoolEventIndividualsBatch = new Service('/i/schools/{schoolId}/events/{eventId}/individuals/batch', binding);
		this.schoolEventIndividualsGroupBatch = new Service('/i/schools/{schoolId}/events/{eventId}/individuals/groupBatch', binding);

		// event individual performance
		this.schoolEventIndividualPerformance = new Service('/i/schools/{schoolId}/events/{eventId}/results/individuals/performance', binding);
		this.schoolEventIndividualPerformancePoint = new Service('/i/schools/{schoolId}/events/{eventId}/results/individuals/performance/{performancePointId}', binding);
		this.schoolEventIndividualDiscipline = new Service('/i/schools/{schoolId}/events/{eventId}/results/individuals/discipline', binding);
		this.schoolEventIndividualDisciplinePoint = new Service('/i/schools/{schoolId}/events/{eventId}/results/individuals/discipline/{disciplinePointId}', binding);

		this.schoolEventResultSchoolScores = new Service('/i/schools/{schoolId}/events/{eventId}/results/schools/score', binding);
		this.schoolEventResultSchoolScore = new Service('/i/schools/{schoolId}/events/{eventId}/results/schools/score/{scoreId}', binding);
		this.schoolEventResultTeamScores = new Service('/i/schools/{schoolId}/events/{eventId}/results/teams/score', binding);
		this.schoolEventResultTeamScore = new Service('/i/schools/{schoolId}/events/{eventId}/results/teams/score/{scoreId}', binding);
		this.schoolEventResultHousesScores = new Service('/i/schools/{schoolId}/events/{eventId}/results/houses/score', binding);
		this.schoolEventResultHousesScore = new Service('/i/schools/{schoolId}/events/{eventId}/results/houses/score/{scoreId}', binding);
		this.schoolEventResultIndividualsScores = new Service('/i/schools/{schoolId}/events/{eventId}/results/individuals/score', binding);
		this.schoolEventResultIndividualsScore = new Service('/i/schools/{schoolId}/events/{eventId}/results/individuals/score/{scoreId}', binding);
		this.schoolEventResultCricket = new Service('/i/schools/{schoolId}/events/{eventId}/results/cricket', binding);

		this.schoolEventTeamPlayers = new Service('/i/schools/{schoolId}/events/{eventId}/teams/{teamId}/players', binding);
		this.schoolEventTeamPlayer = new Service('/i/schools/{schoolId}/events/{eventId}/teams/{teamId}/players/{playerId}', binding);
		this.schoolEventResult = new Service('/i/schools/{schoolId}/events/{eventId}/result', binding);
		this.schoolEventReport = new Service('/i/schools/{schoolId}/events/{eventId}/report', binding);
		this.schoolEventTasks = new Service('/i/schools/{schoolId}/events/{eventId}/tasks', binding);
		this.schoolEventTask = new Service('/i/schools/{schoolId}/events/{eventId}/tasks/{taskId}', binding);

		this.addPointToSchoolEventResult = new Service('/i/schools/{schoolId}/events/{eventId}/result/points', binding);
		this.finishSchoolEvent = new Service('/i/schools/{schoolId}/events/{eventId}/finish', binding);
		this.schoolEventInvite = new Service('/i/schools/{schoolId}/events/{eventId}/invite', binding);
		this.addTeamToschoolEvent = new Service('/i/schools/{schoolId}/events/{eventId}/addTeam', binding);

		this.publicSchoolEvent = new Service('/public/schools/{schoolId}/events/{eventId}', binding);
		this.publicSchoolEvents = new Service('/public/schools/{schoolId}/events', binding);
		this.publicSchoolEventReport = new Service('/public/schools/{schoolId}/events/{eventId}/report', binding);
		this.publicSchoolEventTeams = new Service('/public/schools/{schoolId}/events/{eventId}/teams', binding);
		this.publicSchoolEventTeam = new Service('/public/schools/{schoolId}/events/{eventId}/teams/{teamId}', binding);
		this.publicSchoolEventDates = new Service('/public/schools/{schoolId}/events/dates/distinct', binding);
		this.publicSchoolEventPhotos = new Service('/public/schools/{schoolId}/events/{eventId}/photos', binding);

		// invites
		this.schoolInvites				= new Service('/i/schools/{schoolId}/invites', binding);
		this.schoolInvite 				= new Service('/i/schools/{schoolId}/invites/{inviteId}', binding);
		this.schoolInboxInvites 		= new Service('/i/schools/{schoolId}/invites/inbox', binding);
		this.schoolOutboxInvites 		= new Service('/i/schools/{schoolId}/invites/outbox', binding);
		this.schoolArchiveInvites		= new Service('/i/schools/{schoolId}/invites/archive', binding);
		this.acceptSchoolInvite			= new Service('/i/schools/{schoolId}/invites/{inviteId}/accept', binding);
		this.declineSchoolInvite		= new Service('/i/schools/{schoolId}/invites/{inviteId}/reject', binding);
		this.cancelSchoolInvite			= new Service('/i/schools/{schoolId}/invites/{inviteId}/cancel', binding);
		this.schoolInviteComments		= new Service('/i/schools/{schoolId}/invites/{inviteId}/comments', binding);
		this.schoolInviteCommentsCount	= new Service('/i/schools/{schoolId}/invites/{inviteId}/comments/count', binding);
		this.inviteInboxCount			= new Service('/i/schools/{schoolId}/invites/inbox/count', binding);
		this.inviteOutboxCount			= new Service('/i/schools/{schoolId}/invites/outbox/count', binding);
		this.inviteArchiveCount			= new Service('/i/schools/{schoolId}/invites/archive/count', binding);

		// messages
		// it's some invitation message
		this.schoolEventsInvitationMessages	= new Service('/i/schools/{schoolId}/events/messages/invite', binding);
		// it's school worker inbox
		this.schoolEventsMessages			= new Service<Message[], Message, any>('/i/schools/{schoolId}/events/messages', binding);
		this.schoolEventsMessagesCount		= new Service('/i/schools/{schoolId}/events/messages/count', binding);
		this.schoolEventsMessagesInbox		= new Service<Message[], Message, any>('/i/schools/{schoolId}/events/messages/inbox', binding);
		this.schoolEventsMessagesInboxCount = new Service('/i/schools/{schoolId}/events/messages/inbox/count', binding);
		this.schoolEventsMessagesOutbox		= new Service<Message[], Message, any>('/i/schools/{schoolId}/events/messages/outbox', binding);
		this.schoolEventsMessagesArchive	= new Service<Message[], Message, any>('/i/schools/{schoolId}/events/messages/archive', binding);

		this.sendInvitationMessagesForEvent	= new Service('/i/schools/{schoolId}/events/{eventId}/players/messages/invite', binding);
		this.doGotItActionForEventMessage	= new Service('/i/schools/{schoolId}/events/messages/{messageId}/gotit', binding);

		//event message comments
		this.schoolEventMessageComments = new Service('/i/schools/{schoolId}/events/messages/{messageId}/comments', binding);
		this.schoolEventMessageCommentsCount = new Service('/i/schools/{schoolId}/events/messages/{messageId}/comments/count', binding);

		// event comments
		this.schoolEventComment = new Service('/i/schools/{schoolId}/events/{eventId}/comments/{commentId}', binding);
		this.schoolEventComments = new Service('/i/schools/{schoolId}/events/{eventId}/comments', binding);
		this.schoolEventCommentsCount = new Service('/i/schools/{schoolId}/events/{eventId}/comments/count', binding);

		// albums
		this.schoolAlbum = new Service('/i/schools/{schoolId}/albums/{albumId}', binding);
		this.schoolEventAlbums = new Service('/i/schools/{schoolId}/events/{eventId}/albums', binding);
		this.schoolEventAlbum = new Service('/i/schools/{schoolId}/events/{eventId}/albums/{albumId}', binding);

		// photos
		this.schoolAlbumPhotos = new Service('/i/schools/{schoolId}/albums/{albumId}/photos', binding);
		this.schoolAlbumPhoto = new Service('/i/schools/{schoolId}/albums/{albumId}/photos/{photoId}', binding);
		this.schoolEventAlbumPhotos = new Service('/i/schools/{schoolId}/events/{eventId}/albums/{albumId}/photos', binding);
		this.schoolEventAlbumPhoto = new Service('/i/schools/{schoolId}/events/{eventId}/albums/{albumId}/photos/{photoId}', binding);
		this.publicSchoolAlbumPhotos = new Service('/public/schools/{schoolId}/albums/{albumId}/photos', binding);

		// children
		this.children = new Service('/i/children', binding);
		this.childrenEvents = new Service('/i/children/events', binding);
		this.childrenEventParticipationRefuse = new Service('/i/children/events/messages/refuse', binding);
		this.childrenEventsDates = new Service('/i/children/events/dates/distinct', binding);
		this.childrenEventsCount = new Service('/i/children/events/count', binding);
		this.child = new Service('/i/children/{childId}', binding);
		this.childEvents = new Service('/i/children/{childId}/events', binding);
		this.childEventPhotos = new Service('/i/children/events/{eventId}/photos', binding);
		this.childEventPhoto = new Service('/i/children/events/{eventId}/photos/{photoId}', binding);
		this.childParents = new Service('/i/children/{childId}/parents', binding);

		this.childMessage = new Service('/i/children/events/messages/{messageId}', binding);
		this.childEventMessages = new Service('/i/children/events/{eventId}/messages', binding);
		this.childMessageInbox = new Service('/i/children/events/messages/inbox', binding);
		this.childMessageInboxCount = new Service('/i/children/events/messages/inbox/count', binding);
		this.childMessageOutbox = new Service('/i/children/events/messages/outbox', binding);
		this.childMessageArchive = new Service('/i/children/events/messages/archive', binding);
		this.childMessageAccept = new Service('/i/children/events/messages/{messageId}/accept', binding);
		this.childMessageReject = new Service('/i/children/events/messages/{messageId}/reject', binding);

		this.childClubMessageAccept = new Service('/i/children/clubs/messages/{messageId}/accept', binding);
		this.childClubMessageReject = new Service('/i/children/clubs/messages/{messageId}/reject', binding);

		//children event message comments
		this.childrenEventMessageComments = new Service('/i/children/events/messages/{messageId}/comments', binding);
		this.childrenEventMessageCommentsCount = new Service('/i/children/events/messages/{messageId}/comments/count', binding);

		this.parentEventReportAvailability = new Service('/i/children/events/{eventId}/messages/report', binding);

		// Student
		this.studentSchoolEventsCount = new Service('/i/events/stats', binding);
		this.studentSchoolEventsDates = new Service('/i/events/dates/distinct', binding);
		this.studentSchoolEvents = new Service('/i/events', binding);
		this.studentSchoolEvent = new Service('/i/events/{eventId}', binding);
		this.studentEventReportAvailability = new Service('/i/events/{eventId}/messages/report', binding);

		this.studentAchievements = new Service('/i/student/achievements', binding);
		this.studentSports = new Service<Sport[], Sport, any>('/i/student/sports', binding);
		this.studentTeamEvents = new Service('/i/student/teamSports/{sportId}/teamEvents', binding);

		// Students -> Messages
		this.studentMessages			= new Service('/i/events/messages', binding);
		this.studentInboxMessages	= new Service('/i/events/messages/inbox', binding);
		this.studentOutboxMessages	= new Service('/i/events/messages/outbox', binding);
		this.studentArchiveMessages	= new Service('/i/events/messages/archive', binding);

		// Integrations
		this.integrationGoogleCalendar = new Service('/i/schools/{schoolId}/integrations/googlecalendar', binding);
		this.integrationTwitter = new Service('/i/schools/{schoolId}/integrations/twitter', binding);
		this.integrationTwitterTweet = new Service('/i/schools/{schoolId}/integrations/twitter/{twitterId}/tweet', binding);
		this.integrations = new Service('/i/schools/{schoolId}/integrations', binding);
		this.integration = new Service('/i/schools/{schoolId}/integrations/{integrationId}', binding);

		// postcode
		this.postCodes = new Service('/public/postcodes', binding);
		this.postCodeById = new Service('/public/postcodes/{postcodeId}', binding);

		// invite
		this.invite = new Service('/public/users/invites/{inviteKey}', binding);

		//check
		this.phoneCheck = new Service('/i/register/check', binding);

		//age group
		this.ageGroups = new Service('/i/schools/{schoolId}/ages', binding);

		//school notifications
		this.schoolNotifications = new Service('/i/schools/{schoolId}/notifications', binding);

		//user setting notifications
		this.userNotificationChannels = new Service('/i/notifications/channels', binding);
		this.userNotificationChannel = new Service('/i/notifications/channels/{channelId}', binding);

		//consent request template
		this.consentRequestTemplate = new Service('/i/schools/{schoolId}/template', binding);

		//Tournaments
		this.schoolTournaments = new Service('/i/schools/{schoolUnionId}/schools/tournaments', binding);
		this.publicTournaments = new Service('/public/schools/{schoolUnionId}/schools/tournaments', binding);
		this.schoolTournament  = new Service('/i/schools/{schoolUnionId}/schools/tournaments/{tournamentId}', binding);

		this.actionDescriptor  = new Service('/i/actiondescriptors/{actionDescriptorId}', binding);

		//Achievements
		this.childrenSports = new Service('/i/children/sports', binding);
		this.childSports = new Service('/i/children/{childId}/sports', binding);
		this.childrenAchievements = new Service('/i/children/achievements', binding);
		this.childAchievements = new Service('/i/children/{childId}/achievements', binding);
		this.childTeamEvents = new Service('/i/children/{childId}/teamSports/{sportId}/teamEvents', binding);

		/* I don't like idea of using window.apiImg here, but it was easiest solution withoug global refactoring */
		this.images = new ImageService((window as any).apiImg);
	}
};