import {Service} from 'module/core/service';
import * as ImageService from "module/core/services/ImageService";

import {Sport} from "module/models/sport/sport";

/** Collection of services to reach REST API from server */
export class AdminServiceList {
	// authorization
	_login: Service;

	apps: Service;
	app: Service;

	// users
	users: Service;
	usersForceEmailVefication: Service;
	usersForcePhoneVefication: Service;
	user: Service;
	usersCount: Service;
	userBlock: Service;

	//Permission Requests
	permissionRequests: Service;
	permissionRequestsCount: Service;
	permissionRequest: Service;
	statusPermissionRequest: Service;

	//Permissions
	userPermissions: Service;
	userPermission: Service;

	// schools
	schools: Service;
	schoolsCount: Service;
	school: Service;
	publicSchool: Service;
	publicSchools: Service;

	schoolSports: Service<Sport[], Sport, any>;
	schoolSport: Service<Sport, Sport, any>;
	schoolAllowedSports: Service;

	// sports
	sports: Service<Sport[], Sport, any>;
	sport: Service<Sport, Sport, any>;

	// postcode
	postCodes: Service;
	postCode: Service;

	// forms
	schoolForms: Service;
	schoolForm: Service;

	// houses
	schoolHouses: Service;
	schoolHouse: Service;

	// students
	schoolStudents: Service;
	schoolStudentsCount: Service;
	schoolStudent: Service;
	schoolStudentMerge: Service;

	// activity logs
	useractivity: Service;
	useractivityCount: Service;

	//user sessions
	userSessions: Service;
	userSession: Service;

	// action descriptors
	actionDescriptors: Service;
	actionDescriptor: Service;

	//events
	events: Service;
	event: Service;
	eventRecover: Service;

	//Notifications
	userNotificationChannels: Service;
	userNotificationChannel: Service;
	userNotificationChannelMessage: Service;
	notifications: Service;
	schoolNotifications: Service;
	allNotifications: Service;

	//Invites
	invites: Service;
	invite: Service;

	//age group
	ageGroups: Service;

	//export students
	exportStudents: Service;

	//activate students
	activateStudents: Service;

	//consent request template
	consentRequestTemplate: Service;

	//payments
	paymentsStripeIntegration: Service;
	paymentsStripeIntegrations: Service;
	paymentsAccount: Service;
	paymentsAccounts: Service;

	//user statistic
	userStats: Service;

	images: object;
	
	// Services which require authorization
	constructor(binding) {
		// authorization
		this._login = new Service('/superadmin/login',binding);

		this.apps = new Service('/superadmin/apps', binding);
		this.app = new Service('/superadmin/apps/{appId}', binding);

		// users
		this.users = new Service('/superadmin/users', binding);
		this.usersForceEmailVefication = new Service('/superadmin/users/{userId}/verification/status/email', binding);
		this.usersForcePhoneVefication = new Service('/superadmin/users/{userId}/verification/status/sms', binding);
		this.user = new Service('/superadmin/users/{userId}', binding);
		this.usersCount = new Service('/superadmin/users/count', binding);
		this.userBlock = new Service('/superadmin/users/{userId}/block', binding);

		//Permission Requests
		this.permissionRequests = new Service('/superadmin/users/permissions/requests',binding);
		this.permissionRequestsCount = new Service('/superadmin/users/permissions/requests/count',binding);
		this.permissionRequest = new Service('/superadmin/users/permissions/requests/{prId}',binding);
		this.statusPermissionRequest = new Service('/superadmin/users/permissions/requests/{prId}/status',binding);

		//Permissions
		this.userPermissions = new Service('/superadmin/users/{userId}/permissions',binding);
		this.userPermission = new Service('/superadmin/users/{userId}/permissions/{permissionId}',binding);

		// schools
		this.schools = new Service('/superadmin/schools', binding);
		this.schoolsCount = new Service('/superadmin/schools/count', binding);
		this.school = new Service('/superadmin/schools/{schoolId}', binding);
		this.publicSchool = new Service('/public/schools/{schoolId}', binding);
		this.publicSchools = new Service('/public/schools', binding);

		this.schoolSports = new Service<Sport[], Sport, any>('/superadmin/schools/{schoolId}/sports', binding);
		this.schoolSport = new Service<Sport, Sport, any>('/superadmin/schools/{schoolId}/sports/{sportId}', binding);
		this.schoolAllowedSports = new Service('/superadmin/schools/{schoolId}/allowedSports', binding);

		// sports
		this.sports = new Service<Sport[], Sport, any>('/superadmin/sports', binding);
		this.sport =  new Service<Sport, Sport, any>('/superadmin/sports/{sportId}', binding);

		// postcode
		this.postCodes = new Service('/superadmin/postcodes', binding);
		this.postCode = new Service('/superadmin/postcodes/{postcodeId}', binding);

		// forms
		this.schoolForms = new Service('/superadmin/schools/{schoolId}/forms', binding);
		this.schoolForm = new Service('/superadmin/schools/{schoolId}/forms/{formId}', binding);

		// houses
		this.schoolHouses = new Service('/superadmin/schools/{schoolId}/houses', binding);
		this.schoolHouse = new Service('/superadmin/schools/{schoolId}/houses/{houseId}', binding);

		// students
		this.schoolStudents = new Service('/superadmin/schools/{schoolId}/students', binding);
		this.schoolStudentsCount = new Service('/superadmin/schools/{schoolId}/students/count', binding);
		this.schoolStudent = new Service('/superadmin/schools/{schoolId}/students/{studentId}', binding);
		this.schoolStudentMerge = new Service('/superadmin/schools/{schoolId}/students/{studentId}/merge', binding);

		// activity logs
		this.useractivity = new Service('/superadmin/useractivity', binding);
		this.useractivityCount = new Service('/superadmin/useractivity/count', binding);

		//user sessions
		this.userSessions = new Service('/superadmin/users/{userId}/sessions', binding);
		this.userSession = new Service('/superadmin/users/{userId}/sessions/{sessionKey}', binding);

		// action descriptors
		this.actionDescriptors = new Service('/superadmin/actiondescriptors', binding);
		this.actionDescriptor = new Service('/superadmin/actiondescriptors/{adId}', binding);

		//events
		this.events = new Service('/superadmin/schools/{schoolId}/events', binding);
		this.event = new Service('/superadmin/schools/{schoolId}/events/{eventId}', binding);
		this.eventRecover = new Service('/superadmin/schools/{schoolId}/events/{eventId}/recover', binding);

		//Notifications
		this.userNotificationChannels = new Service('/superadmin/users/{userId}/notifications/channels', binding);
		this.userNotificationChannel = new Service('/superadmin/users/{userId}/notifications/channels/{channelId}', binding);
		this.userNotificationChannelMessage = new Service('/superadmin/users/{userId}/notifications/channels/{channelId}/message', binding);
		this.notifications = new Service('/superadmin/users/{userId}/notifications', binding);
		this.schoolNotifications = new Service('/superadmin/schools/{schoolId}/notifications', binding);
		this.allNotifications = new Service('/superadmin/notifications', binding);

		//Invites
		this.invites = new Service('/superadmin/users/invites', binding);
		this.invite = new Service('/superadmin/users/invites/{inviteId}', binding);

		//age group
		this.ageGroups = new Service('/superadmin/schools/{schoolId}/ages', binding);

		//export students
		this.exportStudents = new Service('/superadmin/schools/{schoolId}/export/students', binding);

		//activate students
		this.activateStudents = new Service('/superadmin/schools/{schoolId}/students/activate', binding);

		//consent request template
		this.consentRequestTemplate = new Service('/superadmin/schools/{schoolId}/template', binding);

		//payments
		this.paymentsStripeIntegration = new Service('/superadmin/payments/stripe/integrations/{integrationId}', binding);
		this.paymentsStripeIntegrations = new Service('/superadmin/payments/stripe/integrations', binding);

		this.paymentsAccount = new Service('/superadmin/schools/{schoolId}/payments/accounts/{accountId}', binding);
		this.paymentsAccounts = new Service('/superadmin/schools/{schoolId}/payments/accounts', binding);

		//user statistic
		this.userStats = new Service('/superadmin/stats/userpresence', binding);

		/* I don't like idea of using window.apiImg here, but it was easiest solution withoug global refactoring */
		this.images = new ImageService((window as any).apiImg);
	}
}