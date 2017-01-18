const	React						= require('react'),
		Morearty					= require('morearty'),
		Immutable					= require('immutable'),
		Lazy						= require('lazy.js'),

		If							= require('module/ui/if/if'),
		Tabs						= require('./../../../ui/tabs/tabs'),
		EventHeaderWrapper			= require('./view/event_header/event_header_wrapper'),
		EventRivals					= require('./view/event_rivals'),
		IndividualScoreAvailable	= require('./view/individual_score_available'),
		EditingTeamsButtons 		= require('./view/editing_teams_buttons'),
		EventTeams					= require('./view/teams/event_teams'),
		Performance					= require('./view/performance/performance'),
		DisciplineWrapper			= require('./view/discipline/discipline_wrapper'),
		TasksWrapper				= require('./view/tasks/tasks_wrapper'),
		EventGallery				= require('./new_gallery/event_gallery'),
		ManagerWrapper				= require('./view/manager_wrapper'),
		Comments					= require('./view/event_blog'),
		TeamHelper					= require('module/ui/managers/helpers/team_helper'),
		EventResultHelper			= require('./../../../helpers/event_result_helper'),
		DetailsWrapper				= require('./view/details/details_wrapper'),
		MatchReport					= require('./view/match-report/report'),
		Map							= require('../../../ui/map/map-event-venue'),

		GalleryActions				= require('./new_gallery/event_gallery_actions'),
		AddPhotoButton				= require('../../../ui/new_gallery/add_photo_button'),
		Button						= require('../../../ui/button/button'),

		RoleHelper					= require('./../../../helpers/role_helper');

const Event = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			model: {},
			gallery: {
				photos: [],
				isUploading: false,
				isSync: false
			},
			sync: false,
			mode: 'general',
			showingComment: false,
			activeTab: 'teams',
			eventTeams: {},
			performanceTab: {
				isEditMode: false
			},
			disciplineTab: {
				isEditMode: false
			},
			tasksTab: {
				viewMode		: "VIEW",
				tasks			: [],
				editingTask		: undefined
			},
			autocompleteChangeOpponentSchool: {
				school: undefined
			},
			individualScoreAvailable: [
				{
					value: true
				},
				{
					value: true
				}
			]
		});
	},
	componentWillMount: function () {
		const	self		= this,
				rootBinding	= self.getMoreartyContext().getBinding(),
				isStudent	= RoleHelper.isStudent(this),
				binding		= self.getDefaultBinding();

		self.eventId = rootBinding.get('routing.pathParameters.0');

		let eventData, report, photos, settings;
		/**
		 * If role not equal student, do everything as usual
		 */
		if (!isStudent) {
			window.Server.schoolEvent.get({
				schoolId: this.props.activeSchoolId,
				eventId: self.eventId
			}).then(event => {
				event.schoolsData = TeamHelper.getSchoolsData(event);
				event.teamsData = event.teamsData.sort((t1, t2) => {
					if (!t1 || !t2 || t1.name === t2.name) {
						return 0;
					}
					if (t1.name < t2.name) {
						return -1;
					}
					if (t1.name > t2.name) {
						return 1;
					}
				});
				event.housesData = event.housesData.sort((h1, h2) => {
					if (!h1 || !h2 || h1.name === h2.name) {
						return 0;
					}
					if (h1.name < h2.name) {
						return -1;
					}
					if (h1.name > h2.name) {
						return 1;
					}
				});
				// FUNCTION MODIFY EVENT OBJECT!!
				EventResultHelper.initializeEventResults(event);

				eventData = event;

				// loading match report
				return window.Server.schoolEventReport.get({
					schoolId: this.props.activeSchoolId,
					eventId: self.eventId
				});
			}).then(_report => {
				report = _report;

				return this.loadPhotos(RoleHelper.getLoggedInUserRole(this));
			}).then(_photos => {
				photos = _photos;

				return window.Server.schoolSettings.get({schoolId: this.props.activeSchoolId});
			}).then(_settings => {
				settings = _settings;

				return window.Server.schoolEventTasks.get({schoolId: this.props.activeSchoolId, eventId: self.eventId});
			}).then(tasks => {
				eventData.matchReport = report.content;

				this.setPlayersFromEventToBinding(eventData);
				binding.atomically()
					.set('model',							Immutable.fromJS(eventData))
					.set('gallery.photos',					Immutable.fromJS(photos))
					.set('gallery.isUserCanUploadPhotos',	Immutable.fromJS(settings.photosEnabled))
					.set('gallery.isSync',					true)
					.set('tasksTab.tasks',					Immutable.fromJS(tasks.filter(t => t.schoolId === this.props.activeSchoolId)))
					.set('isUserCanWriteComments',			Immutable.fromJS(settings.commentsEnabled))
					.set('mode',							Immutable.fromJS('general'))
					.commit();

				self.initTabs();

				binding.set('sync', Immutable.fromJS(true));

				this.addListeners();

				return eventData;
			});
		} else {
			/**
			 * Fake data
			 */
			let event;
			photos = [];

			const tasks = [];
			settings = {"commentsEnabled":false,"photosEnabled":false};
			if (self.eventId === '587c72823fc0db2866eccccb') {
				report = {"id":"587c72830359cdc99607f657","eventId":"587c72823fc0db2866eccccb","updatedAt":"2017-01-17T15:45:59.180Z","createdAt":"2017-01-16T07:13:07.925Z"};
				event = {"id":"587c72823fc0db2866eccccb","updatedAt":"2017-01-16T07:13:08.228Z","createdAt":"2017-01-16T07:13:06.144Z","gender":"MIXED","eventType":"INTERNAL_TEAMS","sportId":"57b6cc06a4e23b56709e5de1","startTime":"2017-01-22T19:00:00.000Z","inviterSchoolId":"57b6c9a6dd69264b6c5ba82f","albumId":"587c72843fc0db2866ecccd7","results":{"schoolScore":[],"houseScore":[],"teamScore":[],"individualPerformance":[],"individualDiscipline":[],"individualScore":[]},"threadId":"587c72823fc0db2866ecccca","ages":[3,5,7,10,13,8,4,6],"venue":{"postcodeId":"57b6c9a5dd69264b6c5ba82a","venueType":"HOME"},"individuals":[],"teams":["587c728118b196282a47a5a4","587c72813fc0db2866ecccc1"],"houses":[],"finishSchoolIds":[],"invitedSchoolIds":["57b6c9a6dd69264b6c5ba82f"],"status":"ACCEPTED","sport":{"updatedAt":"2016-11-04T12:09:43.650Z","createdAt":"2016-08-19T09:06:14.943Z","name":"Football","scoring":"MORE_SCORES","players":"TEAM","__v":0,"individualResultsAvailable":true,"performance":[{"maxValue":5,"minValue":0,"name":"Speed","_id":"581c7a8707b96fee31c4b79a"},{"maxValue":5,"minValue":0,"name":"Strength","_id":"581c7a8707b96fee31c4b799"},{"maxValue":6,"minValue":0,"name":"Endurance","_id":"581c7a8707b96fee31c4b798"}],"discipline":[{"name":"yellow card","namePlural":"yellow cards","description":"","_id":"581c7a8707b96fee31c4b797"},{"name":"red card","namePlural":"red cards","description":"","_id":"581c7a8707b96fee31c4b796"}],"points":{"namePlural":"goals","name":"goal","display":"PLAIN","pointsStep":1},"field":{"pic":"//img.stage1.squadintouch.com/images/u6rkhehn31t66q1nscqaqf443ryj6a08wf4x_1473590230190.jpg","positions":[{"description":"","name":"Position1","_id":"581c7a8707b96fee31c4b79d","coords":[]},{"description":"","name":"Position2","_id":"581c7a8707b96fee31c4b79c","coords":[]},{"description":"","name":"Position3","_id":"581c7a8707b96fee31c4b79b","coords":[]}]},"genders":{"mixed":true,"femaleOnly":true,"maleOnly":true},"id":"57b6cc06a4e23b56709e5de1"},"inviterSchool":{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","description":"The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. ","domain":"handcrosspark","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg","forms":[{"id":"57b6c9a6dd69264b6c5ba84e","name":"4A","age":4},{"id":"57b6c9a6dd69264b6c5ba84f","name":"4B","age":4},{"id":"57b6c9a6dd69264b6c5ba850","name":"4C","age":4},{"id":"57b6c9a6dd69264b6c5ba851","name":"4D","age":4},{"id":"57b6c9a6dd69264b6c5ba852","name":"4F","age":4},{"id":"57b6c9a6dd69264b6c5ba853","name":"5A","age":5},{"id":"57b6c9a6dd69264b6c5ba854","name":"5B","age":5},{"id":"57b6c9a6dd69264b6c5ba855","name":"5C","age":5},{"id":"57b6c9a6dd69264b6c5ba856","name":"5D","age":5},{"id":"57b6c9a6dd69264b6c5ba857","name":"5F","age":5},{"id":"57b6c9a6dd69264b6c5ba858","name":"6A","age":6},{"id":"57b6c9a6dd69264b6c5ba859","name":"6B","age":6},{"id":"57b6c9a6dd69264b6c5ba85a","name":"6C","age":6},{"id":"57b6c9a6dd69264b6c5ba85b","name":"6D","age":6},{"id":"57b6c9a6dd69264b6c5ba85c","name":"6F","age":6},{"id":"57b6c9a6dd69264b6c5ba85d","name":"7A","age":7},{"id":"57b6c9a6dd69264b6c5ba85e","name":"7B","age":7},{"id":"57b6c9a6dd69264b6c5ba85f","name":"7C","age":7},{"id":"57b6c9a6dd69264b6c5ba860","name":"7D","age":7},{"id":"57b6c9a6dd69264b6c5ba861","name":"7F","age":7},{"id":"57b6c9a6dd69264b6c5ba862","name":"8A","age":8},{"id":"57b6c9a6dd69264b6c5ba863","name":"8B","age":8},{"id":"57b6c9a6dd69264b6c5ba864","name":"8C","age":8},{"id":"57b6c9a6dd69264b6c5ba865","name":"8D","age":8},{"id":"57b6c9a6dd69264b6c5ba866","name":"8F","age":8},{"id":"57d54d426783fc943a6acc30","name":"assss","age":3},{"id":"581add5a07b96fee31c4a50d","name":"1 MPP","age":13},{"id":"5820f7eef936eae3317a75b1","name":"2XXY","age":10},{"id":"5820f7fbf936eae3317a75b6","name":"2XXZ","age":10}]},"invitedSchools":[{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","description":"The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. ","domain":"handcrosspark","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg","forms":[{"id":"57b6c9a6dd69264b6c5ba84e","name":"4A","age":4},{"id":"57b6c9a6dd69264b6c5ba84f","name":"4B","age":4},{"id":"57b6c9a6dd69264b6c5ba850","name":"4C","age":4},{"id":"57b6c9a6dd69264b6c5ba851","name":"4D","age":4},{"id":"57b6c9a6dd69264b6c5ba852","name":"4F","age":4},{"id":"57b6c9a6dd69264b6c5ba853","name":"5A","age":5},{"id":"57b6c9a6dd69264b6c5ba854","name":"5B","age":5},{"id":"57b6c9a6dd69264b6c5ba855","name":"5C","age":5},{"id":"57b6c9a6dd69264b6c5ba856","name":"5D","age":5},{"id":"57b6c9a6dd69264b6c5ba857","name":"5F","age":5},{"id":"57b6c9a6dd69264b6c5ba858","name":"6A","age":6},{"id":"57b6c9a6dd69264b6c5ba859","name":"6B","age":6},{"id":"57b6c9a6dd69264b6c5ba85a","name":"6C","age":6},{"id":"57b6c9a6dd69264b6c5ba85b","name":"6D","age":6},{"id":"57b6c9a6dd69264b6c5ba85c","name":"6F","age":6},{"id":"57b6c9a6dd69264b6c5ba85d","name":"7A","age":7},{"id":"57b6c9a6dd69264b6c5ba85e","name":"7B","age":7},{"id":"57b6c9a6dd69264b6c5ba85f","name":"7C","age":7},{"id":"57b6c9a6dd69264b6c5ba860","name":"7D","age":7},{"id":"57b6c9a6dd69264b6c5ba861","name":"7F","age":7},{"id":"57b6c9a6dd69264b6c5ba862","name":"8A","age":8},{"id":"57b6c9a6dd69264b6c5ba863","name":"8B","age":8},{"id":"57b6c9a6dd69264b6c5ba864","name":"8C","age":8},{"id":"57b6c9a6dd69264b6c5ba865","name":"8D","age":8},{"id":"57b6c9a6dd69264b6c5ba866","name":"8F","age":8},{"id":"57d54d426783fc943a6acc30","name":"assss","age":3},{"id":"581add5a07b96fee31c4a50d","name":"1 MPP","age":13},{"id":"5820f7eef936eae3317a75b1","name":"2XXY","age":10},{"id":"5820f7fbf936eae3317a75b6","name":"2XXZ","age":10}]}],"housesData":[],"individualsData":[],"teamsData":[{"updatedAt":"2017-01-16T07:13:06.579Z","createdAt":"2017-01-16T07:13:05.792Z","name":"11111","sportId":"57b6cc06a4e23b56709e5de1","schoolId":"57b6c9a6dd69264b6c5ba82f","__v":0,"eventId":"587c72823fc0db2866eccccb","removed":false,"teamType":"ADHOC","players":[{"userId":"57b6c9a8dd69264b6c5bac52","permissionId":"57b6c9a8dd69264b6c5bac53","_id":"587c728118b196282a47a5cc","firstName":"Johnson","lastName":"Brown","gender":"MALE","id":"587c728118b196282a47a5cc","form":{"age":13,"name":"1 MPP","id":"581add5a07b96fee31c4a50d"}},{"userId":"57b6c9a8dd69264b6c5bac54","permissionId":"57b6c9a8dd69264b6c5bac55","_id":"587c728118b196282a47a5cb","firstName":"Heloise","lastName":"Hudson","gender":"MALE","id":"587c728118b196282a47a5cb","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac56","permissionId":"57b6c9a8dd69264b6c5bac57","_id":"587c728118b196282a47a5ca","firstName":"Bernhard","lastName":"Kuvalis","gender":"FEMALE","id":"587c728118b196282a47a5ca","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac58","permissionId":"57b6c9a8dd69264b6c5bac59","_id":"587c728118b196282a47a5c9","firstName":"Westley","lastName":"Will","gender":"FEMALE","id":"587c728118b196282a47a5c9","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac5a","permissionId":"57b6c9a8dd69264b6c5bac5b","_id":"587c728118b196282a47a5c8","firstName":"Cary","lastName":"Dietrich","gender":"MALE","id":"587c728118b196282a47a5c8","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac5c","permissionId":"57b6c9a8dd69264b6c5bac5d","_id":"587c728118b196282a47a5c7","firstName":"Kaylin","lastName":"Gutkowski","gender":"FEMALE","id":"587c728118b196282a47a5c7","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac5e","permissionId":"57b6c9a8dd69264b6c5bac5f","_id":"587c728118b196282a47a5c6","firstName":"Lonzo","lastName":"Predovic","gender":"MALE","id":"587c728118b196282a47a5c6","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac60","permissionId":"57b6c9a8dd69264b6c5bac61","_id":"587c728118b196282a47a5c5","firstName":"Jewel","lastName":"Howe","gender":"MALE","id":"587c728118b196282a47a5c5","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac62","permissionId":"57b6c9a8dd69264b6c5bac63","_id":"587c728118b196282a47a5c4","firstName":"Briana","lastName":"Rodriguez","gender":"FEMALE","id":"587c728118b196282a47a5c4","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac64","permissionId":"57b6c9a8dd69264b6c5bac65","_id":"587c728118b196282a47a5c3","firstName":"Murl","lastName":"Rodriguez","gender":"FEMALE","id":"587c728118b196282a47a5c3","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac66","permissionId":"57b6c9a8dd69264b6c5bac67","_id":"587c728118b196282a47a5c2","firstName":"Dan","lastName":"Rippin","gender":"MALE","id":"587c728118b196282a47a5c2","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac68","permissionId":"57b6c9a8dd69264b6c5bac69","_id":"587c728118b196282a47a5c1","firstName":"Mossie","lastName":"Wiegand","gender":"FEMALE","id":"587c728118b196282a47a5c1","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac6c","permissionId":"57b6c9a8dd69264b6c5bac6d","_id":"587c728118b196282a47a5c0","firstName":"Sigrid","lastName":"Jenkins","gender":"FEMALE","id":"587c728118b196282a47a5c0","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac6a","permissionId":"57b6c9a8dd69264b6c5bac6b","_id":"587c728118b196282a47a5bf","firstName":"Filomena","lastName":"Hudson","gender":"FEMALE","id":"587c728118b196282a47a5bf","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac74","permissionId":"57b6c9a8dd69264b6c5bac75","_id":"587c728118b196282a47a5be","firstName":"Garfield","lastName":"Waters","gender":"MALE","id":"587c728118b196282a47a5be","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac70","permissionId":"57b6c9a8dd69264b6c5bac71","_id":"587c728118b196282a47a5bd","firstName":"Russ","lastName":"Lubowitz","gender":"MALE","id":"587c728118b196282a47a5bd","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac72","permissionId":"57b6c9a8dd69264b6c5bac73","_id":"587c728118b196282a47a5bc","firstName":"Ryleigh","lastName":"Tremblay","gender":"MALE","id":"587c728118b196282a47a5bc","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac6e","permissionId":"57b6c9a8dd69264b6c5bac6f","_id":"587c728118b196282a47a5bb","firstName":"Ressie","lastName":"Zulauf","gender":"FEMALE","id":"587c728118b196282a47a5bb","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac76","permissionId":"57b6c9a8dd69264b6c5bac77","_id":"587c728118b196282a47a5ba","firstName":"Connie","lastName":"Ritchie","gender":"MALE","id":"587c728118b196282a47a5ba","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac78","permissionId":"57b6c9a8dd69264b6c5bac79","_id":"587c728118b196282a47a5b9","firstName":"Buford","lastName":"Wisozk","gender":"MALE","id":"587c728118b196282a47a5b9","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac7c","permissionId":"57b6c9a8dd69264b6c5bac7d","_id":"587c728118b196282a47a5b8","firstName":"Bernhard","lastName":"Spencer","gender":"MALE","id":"587c728118b196282a47a5b8","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac7a","permissionId":"57b6c9a8dd69264b6c5bac7b","_id":"587c728118b196282a47a5b7","firstName":"Burdette","lastName":"Morar","gender":"FEMALE","id":"587c728118b196282a47a5b7","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac7e","permissionId":"57b6c9a8dd69264b6c5bac7f","_id":"587c728118b196282a47a5b6","firstName":"Wallace","lastName":"Dickinson","gender":"MALE","id":"587c728118b196282a47a5b6","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac82","permissionId":"57b6c9a8dd69264b6c5bac83","_id":"587c728118b196282a47a5b5","firstName":"Alena","lastName":"Schinner","gender":"FEMALE","id":"587c728118b196282a47a5b5","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac84","permissionId":"57b6c9a8dd69264b6c5bac85","_id":"587c728118b196282a47a5b4","firstName":"Albin","lastName":"Flatley","gender":"MALE","id":"587c728118b196282a47a5b4","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac86","permissionId":"57b6c9a8dd69264b6c5bac87","_id":"587c728118b196282a47a5b3","firstName":"Kris","lastName":"Kub","gender":"FEMALE","id":"587c728118b196282a47a5b3","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac80","permissionId":"57b6c9a8dd69264b6c5bac81","_id":"587c728118b196282a47a5b2","firstName":"Ola","lastName":"Grady","gender":"MALE","id":"587c728118b196282a47a5b2","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac8a","permissionId":"57b6c9a8dd69264b6c5bac8b","_id":"587c728118b196282a47a5b1","firstName":"Alberta","lastName":"Rogahn","gender":"FEMALE","id":"587c728118b196282a47a5b1","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac88","permissionId":"57b6c9a8dd69264b6c5bac89","_id":"587c728118b196282a47a5b0","firstName":"Madie","lastName":"MacGyver","gender":"FEMALE","id":"587c728118b196282a47a5b0","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac8c","permissionId":"57b6c9a8dd69264b6c5bac8d","_id":"587c728118b196282a47a5af","firstName":"Nyasia","lastName":"Cormier","gender":"MALE","id":"587c728118b196282a47a5af","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac8e","permissionId":"57b6c9a8dd69264b6c5bac8f","_id":"587c728118b196282a47a5ae","firstName":"Shaniya","lastName":"Farrell","gender":"FEMALE","id":"587c728118b196282a47a5ae","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac92","permissionId":"57b6c9a8dd69264b6c5bac93","_id":"587c728118b196282a47a5ad","firstName":"Manuel","lastName":"Hirthe","gender":"MALE","id":"587c728118b196282a47a5ad","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac94","permissionId":"57b6c9a8dd69264b6c5bac95","_id":"587c728118b196282a47a5ac","firstName":"Jovan","lastName":"Emard","gender":"MALE","id":"587c728118b196282a47a5ac","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac90","permissionId":"57b6c9a8dd69264b6c5bac91","_id":"587c728118b196282a47a5ab","firstName":"Titus","lastName":"Dach","gender":"FEMALE","id":"587c728118b196282a47a5ab","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac96","permissionId":"57b6c9a8dd69264b6c5bac97","_id":"587c728118b196282a47a5aa","firstName":"Lambert","lastName":"Harber","gender":"MALE","id":"587c728118b196282a47a5aa","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac98","permissionId":"57b6c9a8dd69264b6c5bac99","_id":"587c728118b196282a47a5a9","firstName":"Milo","lastName":"Rogahn","gender":"FEMALE","id":"587c728118b196282a47a5a9","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a9dd69264b6c5bad44","permissionId":"57b6c9a9dd69264b6c5bad45","_id":"587c728118b196282a47a5a8","firstName":"Laurie","lastName":"Walker","gender":"FEMALE","id":"587c728118b196282a47a5a8","form":{"age":5,"name":"5B","id":"57b6c9a6dd69264b6c5ba854"}},{"userId":"57b6c9a9dd69264b6c5bad46","permissionId":"57b6c9a9dd69264b6c5bad47","_id":"587c728118b196282a47a5a7","firstName":"Citlalli","lastName":"Breitenberg","gender":"MALE","id":"587c728118b196282a47a5a7","form":{"age":5,"name":"5B","id":"57b6c9a6dd69264b6c5ba854"}},{"userId":"57b6c9a9dd69264b6c5bad48","permissionId":"57b6c9a9dd69264b6c5bad49","_id":"587c728118b196282a47a5a6","firstName":"Kaleb","lastName":"Mueller","gender":"MALE","id":"587c728118b196282a47a5a6","form":{"age":5,"name":"5B","id":"57b6c9a6dd69264b6c5ba854"}},{"userId":"57b6c9a9dd69264b6c5bad4a","permissionId":"57b6c9a9dd69264b6c5bad4b","_id":"587c728118b196282a47a5a5","firstName":"Kayli","lastName":"Predovic","gender":"MALE","id":"587c728118b196282a47a5a5","form":{"age":5,"name":"5B","id":"57b6c9a6dd69264b6c5ba854"}}],"ages":[3,5,7,10,13,8,4,6],"gender":"MIXED","id":"587c728118b196282a47a5a4"},{"updatedAt":"2017-01-16T07:13:06.615Z","createdAt":"2017-01-16T07:13:05.820Z","name":"22","sportId":"57b6cc06a4e23b56709e5de1","schoolId":"57b6c9a6dd69264b6c5ba82f","__v":0,"eventId":"587c72823fc0db2866eccccb","removed":false,"teamType":"ADHOC","players":[{"userId":"57b6c9a8dd69264b6c5bac9a","permissionId":"57b6c9a8dd69264b6c5bac9b","_id":"587c72813fc0db2866ecccc8","firstName":"Tara","lastName":"Cassin","gender":"MALE","id":"587c72813fc0db2866ecccc8","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac9c","permissionId":"57b6c9a8dd69264b6c5bac9d","_id":"587c72813fc0db2866ecccc7","firstName":"Daija","lastName":"Lynch","gender":"FEMALE","id":"587c72813fc0db2866ecccc7","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac9e","permissionId":"57b6c9a8dd69264b6c5bac9f","_id":"587c72813fc0db2866ecccc6","firstName":"Kayden","lastName":"Carroll","gender":"FEMALE","id":"587c72813fc0db2866ecccc6","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5baca0","permissionId":"57b6c9a8dd69264b6c5baca1","_id":"587c72813fc0db2866ecccc5","firstName":"Lawson","lastName":"Labadie","gender":"FEMALE","id":"587c72813fc0db2866ecccc5","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5baca2","permissionId":"57b6c9a8dd69264b6c5baca3","_id":"587c72813fc0db2866ecccc4","firstName":"Rico","lastName":"Romaguera","gender":"MALE","id":"587c72813fc0db2866ecccc4","form":{"age":4,"name":"4C","id":"57b6c9a6dd69264b6c5ba850"}},{"userId":"57b6c9a9dd69264b6c5baca4","permissionId":"57b6c9a9dd69264b6c5baca5","_id":"587c72813fc0db2866ecccc3","firstName":"Donald","lastName":"Kassulke","gender":"MALE","id":"587c72813fc0db2866ecccc3","form":{"age":4,"name":"4C","id":"57b6c9a6dd69264b6c5ba850"}},{"userId":"57b6c9a9dd69264b6c5baca6","permissionId":"57b6c9a9dd69264b6c5baca7","_id":"587c72813fc0db2866ecccc2","firstName":"Paxton","lastName":"Oberbrunner","gender":"FEMALE","id":"587c72813fc0db2866ecccc2","form":{"age":4,"name":"4C","id":"57b6c9a6dd69264b6c5ba850"}}],"ages":[3,5,7,10,13,8,4,6],"gender":"MIXED","id":"587c72813fc0db2866ecccc1"}],"generatedNames":{"57b6c9a6dd69264b6c5ba82f":"11111 vs 22 Football","official":"Handcross Park School 11111 vs 22 Football"}};
			} else if (self.eventId === '587dfd1b18b196282a47ec69') {
				report = {"id":"587dfd240359cdc99607f6e9","eventId":"587dfd1b18b196282a47ec69","updatedAt":"2017-01-17T15:46:52.936Z","createdAt":"2017-01-17T11:16:52.772Z"};
				event = {"id":"587dfd1b18b196282a47ec69","updatedAt":"2017-01-17T11:16:53.806Z","createdAt":"2017-01-17T11:16:43.505Z","gender":"FEMALE_ONLY","eventType":"INTERNAL_TEAMS","sportId":"57b6caa5dd69264b6c5bb06b","startTime":"2017-01-25T04:00:00.000Z","inviterSchoolId":"57b6c9a6dd69264b6c5ba82f","albumId":"587dfd253fc0db2866ed0b23","results":{"schoolScore":[],"houseScore":[],"teamScore":[],"individualPerformance":[],"individualDiscipline":[],"individualScore":[]},"threadId":"587dfd1b18b196282a47ec68","ages":[4],"venue":{"postcodeId":"57b6c9a5dd69264b6c5ba82a","venueType":"HOME"},"individuals":[{"permissionId":"57b6c9a8dd69264b6c5bac7b","userId":"57b6c9a8dd69264b6c5bac7a","id":"587dfd1c18b196282a47ec6c"},{"permissionId":"57b6c9a8dd69264b6c5bac63","userId":"57b6c9a8dd69264b6c5bac62","id":"587dfd1c18b196282a47ec6b"}],"teams":[],"houses":[],"finishSchoolIds":[],"invitedSchoolIds":["57b6c9a6dd69264b6c5ba82f"],"status":"ACCEPTED","sport":{"updatedAt":"2016-08-23T08:19:44.906Z","createdAt":"2016-08-19T09:00:21.647Z","name":"1x1","description":"1x1desc","scoring":"MORE_SCORES","players":"1X1","__v":0,"individualResultsAvailable":true,"defaultLimits":{"maxPlayers":1,"minPlayers":1},"performance":[],"discipline":[],"points":{"namePlural":"points","name":"point","display":"DISTANCE","pointsStep":1},"field":{"positions":[]},"genders":{"mixed":true,"femaleOnly":true,"maleOnly":true},"id":"57b6caa5dd69264b6c5bb06b"},"inviterSchool":{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","description":"The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. ","domain":"handcrosspark","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg","forms":[{"id":"57b6c9a6dd69264b6c5ba84e","name":"4A","age":4},{"id":"57b6c9a6dd69264b6c5ba84f","name":"4B","age":4},{"id":"57b6c9a6dd69264b6c5ba850","name":"4C","age":4},{"id":"57b6c9a6dd69264b6c5ba851","name":"4D","age":4},{"id":"57b6c9a6dd69264b6c5ba852","name":"4F","age":4},{"id":"57b6c9a6dd69264b6c5ba853","name":"5A","age":5},{"id":"57b6c9a6dd69264b6c5ba854","name":"5B","age":5},{"id":"57b6c9a6dd69264b6c5ba855","name":"5C","age":5},{"id":"57b6c9a6dd69264b6c5ba856","name":"5D","age":5},{"id":"57b6c9a6dd69264b6c5ba857","name":"5F","age":5},{"id":"57b6c9a6dd69264b6c5ba858","name":"6A","age":6},{"id":"57b6c9a6dd69264b6c5ba859","name":"6B","age":6},{"id":"57b6c9a6dd69264b6c5ba85a","name":"6C","age":6},{"id":"57b6c9a6dd69264b6c5ba85b","name":"6D","age":6},{"id":"57b6c9a6dd69264b6c5ba85c","name":"6F","age":6},{"id":"57b6c9a6dd69264b6c5ba85d","name":"7A","age":7},{"id":"57b6c9a6dd69264b6c5ba85e","name":"7B","age":7},{"id":"57b6c9a6dd69264b6c5ba85f","name":"7C","age":7},{"id":"57b6c9a6dd69264b6c5ba860","name":"7D","age":7},{"id":"57b6c9a6dd69264b6c5ba861","name":"7F","age":7},{"id":"57b6c9a6dd69264b6c5ba862","name":"8A","age":8},{"id":"57b6c9a6dd69264b6c5ba863","name":"8B","age":8},{"id":"57b6c9a6dd69264b6c5ba864","name":"8C","age":8},{"id":"57b6c9a6dd69264b6c5ba865","name":"8D","age":8},{"id":"57b6c9a6dd69264b6c5ba866","name":"8F","age":8},{"id":"57d54d426783fc943a6acc30","name":"assss","age":3},{"id":"581add5a07b96fee31c4a50d","name":"1 MPP","age":13},{"id":"5820f7eef936eae3317a75b1","name":"2XXY","age":10},{"id":"5820f7fbf936eae3317a75b6","name":"2XXZ","age":10}]},"invitedSchools":[{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","description":"The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. ","domain":"handcrosspark","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg","forms":[{"id":"57b6c9a6dd69264b6c5ba84e","name":"4A","age":4},{"id":"57b6c9a6dd69264b6c5ba84f","name":"4B","age":4},{"id":"57b6c9a6dd69264b6c5ba850","name":"4C","age":4},{"id":"57b6c9a6dd69264b6c5ba851","name":"4D","age":4},{"id":"57b6c9a6dd69264b6c5ba852","name":"4F","age":4},{"id":"57b6c9a6dd69264b6c5ba853","name":"5A","age":5},{"id":"57b6c9a6dd69264b6c5ba854","name":"5B","age":5},{"id":"57b6c9a6dd69264b6c5ba855","name":"5C","age":5},{"id":"57b6c9a6dd69264b6c5ba856","name":"5D","age":5},{"id":"57b6c9a6dd69264b6c5ba857","name":"5F","age":5},{"id":"57b6c9a6dd69264b6c5ba858","name":"6A","age":6},{"id":"57b6c9a6dd69264b6c5ba859","name":"6B","age":6},{"id":"57b6c9a6dd69264b6c5ba85a","name":"6C","age":6},{"id":"57b6c9a6dd69264b6c5ba85b","name":"6D","age":6},{"id":"57b6c9a6dd69264b6c5ba85c","name":"6F","age":6},{"id":"57b6c9a6dd69264b6c5ba85d","name":"7A","age":7},{"id":"57b6c9a6dd69264b6c5ba85e","name":"7B","age":7},{"id":"57b6c9a6dd69264b6c5ba85f","name":"7C","age":7},{"id":"57b6c9a6dd69264b6c5ba860","name":"7D","age":7},{"id":"57b6c9a6dd69264b6c5ba861","name":"7F","age":7},{"id":"57b6c9a6dd69264b6c5ba862","name":"8A","age":8},{"id":"57b6c9a6dd69264b6c5ba863","name":"8B","age":8},{"id":"57b6c9a6dd69264b6c5ba864","name":"8C","age":8},{"id":"57b6c9a6dd69264b6c5ba865","name":"8D","age":8},{"id":"57b6c9a6dd69264b6c5ba866","name":"8F","age":8},{"id":"57d54d426783fc943a6acc30","name":"assss","age":3},{"id":"581add5a07b96fee31c4a50d","name":"1 MPP","age":13},{"id":"5820f7eef936eae3317a75b1","name":"2XXY","age":10},{"id":"5820f7fbf936eae3317a75b6","name":"2XXZ","age":10}]}],"housesData":[],"individualsData":[{"permissionId":"57b6c9a8dd69264b6c5bac7b","userId":"57b6c9a8dd69264b6c5bac7a","id":"587dfd1c18b196282a47ec6c","firstName":"Burdette","lastName":"Morar","gender":"FEMALE","schoolId":"57b6c9a6dd69264b6c5ba82f","isStudent":true,"houseId":"57b6c9a6dd69264b6c5ba84c","formId":"57b6c9a6dd69264b6c5ba84f","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"permissionId":"57b6c9a8dd69264b6c5bac63","userId":"57b6c9a8dd69264b6c5bac62","id":"587dfd1c18b196282a47ec6b","firstName":"Briana","lastName":"Rodriguez","gender":"FEMALE","schoolId":"57b6c9a6dd69264b6c5ba82f","isStudent":true,"houseId":"57b6c9a6dd69264b6c5ba84c","formId":"57b6c9a6dd69264b6c5ba84e","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}}],"teamsData":[],"generatedNames":{"57b6c9a6dd69264b6c5ba82f":"Girls 1x1 ","official":"Handcross Park School Girls 1x1 "}};
			} else if (self.eventId === '587e00918a2cab5db170e62c') {
				report = {"id":"587e00930359cdc99607f70b","eventId":"587e00918a2cab5db170e62c","updatedAt":"2017-01-17T15:47:20.786Z","createdAt":"2017-01-17T11:31:31.012Z"};
				event = {"id":"587e00918a2cab5db170e62c","updatedAt":"2017-01-17T11:31:31.398Z","createdAt":"2017-01-17T11:31:29.202Z","gender":"FEMALE_ONLY","eventType":"INTERNAL_TEAMS","sportId":"57b6caa5dd69264b6c5bb06b","startTime":"2017-01-26T08:00:00.000Z","inviterSchoolId":"57b6c9a6dd69264b6c5ba82f","albumId":"587e00938a2cab5db170e639","results":{"schoolScore":[],"houseScore":[],"teamScore":[],"individualPerformance":[],"individualDiscipline":[],"individualScore":[]},"threadId":"587e00918a2cab5db170e62b","ages":[4],"venue":{"postcodeId":"57b6c9a5dd69264b6c5ba82a","venueType":"HOME"},"individuals":[{"permissionId":"57b6c9a8dd69264b6c5bac7b","userId":"57b6c9a8dd69264b6c5bac7a","id":"587e00918a2cab5db170e62f"},{"permissionId":"57b6c9a8dd69264b6c5bac5d","userId":"57b6c9a8dd69264b6c5bac5c","id":"587e00918a2cab5db170e62e"}],"teams":[],"houses":[],"finishSchoolIds":[],"invitedSchoolIds":["57b6c9a6dd69264b6c5ba82f"],"status":"ACCEPTED","sport":{"updatedAt":"2016-08-23T08:19:44.906Z","createdAt":"2016-08-19T09:00:21.647Z","name":"1x1","description":"1x1desc","scoring":"MORE_SCORES","players":"1X1","__v":0,"individualResultsAvailable":true,"defaultLimits":{"maxPlayers":1,"minPlayers":1},"performance":[],"discipline":[],"points":{"namePlural":"points","name":"point","display":"DISTANCE","pointsStep":1},"field":{"positions":[]},"genders":{"mixed":true,"femaleOnly":true,"maleOnly":true},"id":"57b6caa5dd69264b6c5bb06b"},"inviterSchool":{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","description":"The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. ","domain":"handcrosspark","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg","forms":[{"id":"57b6c9a6dd69264b6c5ba84e","name":"4A","age":4},{"id":"57b6c9a6dd69264b6c5ba84f","name":"4B","age":4},{"id":"57b6c9a6dd69264b6c5ba850","name":"4C","age":4},{"id":"57b6c9a6dd69264b6c5ba851","name":"4D","age":4},{"id":"57b6c9a6dd69264b6c5ba852","name":"4F","age":4},{"id":"57b6c9a6dd69264b6c5ba853","name":"5A","age":5},{"id":"57b6c9a6dd69264b6c5ba854","name":"5B","age":5},{"id":"57b6c9a6dd69264b6c5ba855","name":"5C","age":5},{"id":"57b6c9a6dd69264b6c5ba856","name":"5D","age":5},{"id":"57b6c9a6dd69264b6c5ba857","name":"5F","age":5},{"id":"57b6c9a6dd69264b6c5ba858","name":"6A","age":6},{"id":"57b6c9a6dd69264b6c5ba859","name":"6B","age":6},{"id":"57b6c9a6dd69264b6c5ba85a","name":"6C","age":6},{"id":"57b6c9a6dd69264b6c5ba85b","name":"6D","age":6},{"id":"57b6c9a6dd69264b6c5ba85c","name":"6F","age":6},{"id":"57b6c9a6dd69264b6c5ba85d","name":"7A","age":7},{"id":"57b6c9a6dd69264b6c5ba85e","name":"7B","age":7},{"id":"57b6c9a6dd69264b6c5ba85f","name":"7C","age":7},{"id":"57b6c9a6dd69264b6c5ba860","name":"7D","age":7},{"id":"57b6c9a6dd69264b6c5ba861","name":"7F","age":7},{"id":"57b6c9a6dd69264b6c5ba862","name":"8A","age":8},{"id":"57b6c9a6dd69264b6c5ba863","name":"8B","age":8},{"id":"57b6c9a6dd69264b6c5ba864","name":"8C","age":8},{"id":"57b6c9a6dd69264b6c5ba865","name":"8D","age":8},{"id":"57b6c9a6dd69264b6c5ba866","name":"8F","age":8},{"id":"57d54d426783fc943a6acc30","name":"assss","age":3},{"id":"581add5a07b96fee31c4a50d","name":"1 MPP","age":13},{"id":"5820f7eef936eae3317a75b1","name":"2XXY","age":10},{"id":"5820f7fbf936eae3317a75b6","name":"2XXZ","age":10}]},"invitedSchools":[{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","description":"The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. ","domain":"handcrosspark","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg","forms":[{"id":"57b6c9a6dd69264b6c5ba84e","name":"4A","age":4},{"id":"57b6c9a6dd69264b6c5ba84f","name":"4B","age":4},{"id":"57b6c9a6dd69264b6c5ba850","name":"4C","age":4},{"id":"57b6c9a6dd69264b6c5ba851","name":"4D","age":4},{"id":"57b6c9a6dd69264b6c5ba852","name":"4F","age":4},{"id":"57b6c9a6dd69264b6c5ba853","name":"5A","age":5},{"id":"57b6c9a6dd69264b6c5ba854","name":"5B","age":5},{"id":"57b6c9a6dd69264b6c5ba855","name":"5C","age":5},{"id":"57b6c9a6dd69264b6c5ba856","name":"5D","age":5},{"id":"57b6c9a6dd69264b6c5ba857","name":"5F","age":5},{"id":"57b6c9a6dd69264b6c5ba858","name":"6A","age":6},{"id":"57b6c9a6dd69264b6c5ba859","name":"6B","age":6},{"id":"57b6c9a6dd69264b6c5ba85a","name":"6C","age":6},{"id":"57b6c9a6dd69264b6c5ba85b","name":"6D","age":6},{"id":"57b6c9a6dd69264b6c5ba85c","name":"6F","age":6},{"id":"57b6c9a6dd69264b6c5ba85d","name":"7A","age":7},{"id":"57b6c9a6dd69264b6c5ba85e","name":"7B","age":7},{"id":"57b6c9a6dd69264b6c5ba85f","name":"7C","age":7},{"id":"57b6c9a6dd69264b6c5ba860","name":"7D","age":7},{"id":"57b6c9a6dd69264b6c5ba861","name":"7F","age":7},{"id":"57b6c9a6dd69264b6c5ba862","name":"8A","age":8},{"id":"57b6c9a6dd69264b6c5ba863","name":"8B","age":8},{"id":"57b6c9a6dd69264b6c5ba864","name":"8C","age":8},{"id":"57b6c9a6dd69264b6c5ba865","name":"8D","age":8},{"id":"57b6c9a6dd69264b6c5ba866","name":"8F","age":8},{"id":"57d54d426783fc943a6acc30","name":"assss","age":3},{"id":"581add5a07b96fee31c4a50d","name":"1 MPP","age":13},{"id":"5820f7eef936eae3317a75b1","name":"2XXY","age":10},{"id":"5820f7fbf936eae3317a75b6","name":"2XXZ","age":10}]}],"housesData":[],"individualsData":[{"permissionId":"57b6c9a8dd69264b6c5bac7b","userId":"57b6c9a8dd69264b6c5bac7a","id":"587e00918a2cab5db170e62f","firstName":"Burdette","lastName":"Morar","gender":"FEMALE","schoolId":"57b6c9a6dd69264b6c5ba82f","isStudent":true,"houseId":"57b6c9a6dd69264b6c5ba84c","formId":"57b6c9a6dd69264b6c5ba84f","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"permissionId":"57b6c9a8dd69264b6c5bac5d","userId":"57b6c9a8dd69264b6c5bac5c","id":"587e00918a2cab5db170e62e","firstName":"Kaylin","lastName":"Gutkowski","gender":"FEMALE","schoolId":"57b6c9a6dd69264b6c5ba82f","isStudent":true,"houseId":"57b6c9a6dd69264b6c5ba84c","formId":"57b6c9a6dd69264b6c5ba84e","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}}],"teamsData":[],"generatedNames":{"57b6c9a6dd69264b6c5ba82f":"Girls 1x1 ","official":"Handcross Park School Girls 1x1 "}};
			} else if (self.eventId === '587e00b38a2cab5db170e651') {
				event = {"id":"587e00b38a2cab5db170e651","updatedAt":"2017-01-17T11:32:06.266Z","createdAt":"2017-01-17T11:32:03.473Z","gender":"FEMALE_ONLY","eventType":"INTERNAL_TEAMS","sportId":"57b6caa5dd69264b6c5bb06b","startTime":"2017-01-26T16:00:00.000Z","inviterSchoolId":"57b6c9a6dd69264b6c5ba82f","albumId":"587e00b6a7002d5db749cb06","results":{"schoolScore":[],"houseScore":[],"teamScore":[],"individualPerformance":[],"individualDiscipline":[],"individualScore":[]},"threadId":"587e00b38a2cab5db170e650","ages":[4],"venue":{"postcodeId":"57b6c9a5dd69264b6c5ba82a","venueType":"HOME"},"individuals":[{"permissionId":"57b6c9a8dd69264b6c5bac7b","userId":"57b6c9a8dd69264b6c5bac7a","id":"587e00b48a2cab5db170e654"},{"permissionId":"57b6c9a8dd69264b6c5bac59","userId":"57b6c9a8dd69264b6c5bac58","id":"587e00b48a2cab5db170e653"}],"teams":[],"houses":[],"finishSchoolIds":[],"invitedSchoolIds":["57b6c9a6dd69264b6c5ba82f"],"status":"ACCEPTED","sport":{"updatedAt":"2016-08-23T08:19:44.906Z","createdAt":"2016-08-19T09:00:21.647Z","name":"1x1","description":"1x1desc","scoring":"MORE_SCORES","players":"1X1","__v":0,"individualResultsAvailable":true,"defaultLimits":{"maxPlayers":1,"minPlayers":1},"performance":[],"discipline":[],"points":{"namePlural":"points","name":"point","display":"DISTANCE","pointsStep":1},"field":{"positions":[]},"genders":{"mixed":true,"femaleOnly":true,"maleOnly":true},"id":"57b6caa5dd69264b6c5bb06b"},"inviterSchool":{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","description":"The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. ","domain":"handcrosspark","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg","forms":[{"id":"57b6c9a6dd69264b6c5ba84e","name":"4A","age":4},{"id":"57b6c9a6dd69264b6c5ba84f","name":"4B","age":4},{"id":"57b6c9a6dd69264b6c5ba850","name":"4C","age":4},{"id":"57b6c9a6dd69264b6c5ba851","name":"4D","age":4},{"id":"57b6c9a6dd69264b6c5ba852","name":"4F","age":4},{"id":"57b6c9a6dd69264b6c5ba853","name":"5A","age":5},{"id":"57b6c9a6dd69264b6c5ba854","name":"5B","age":5},{"id":"57b6c9a6dd69264b6c5ba855","name":"5C","age":5},{"id":"57b6c9a6dd69264b6c5ba856","name":"5D","age":5},{"id":"57b6c9a6dd69264b6c5ba857","name":"5F","age":5},{"id":"57b6c9a6dd69264b6c5ba858","name":"6A","age":6},{"id":"57b6c9a6dd69264b6c5ba859","name":"6B","age":6},{"id":"57b6c9a6dd69264b6c5ba85a","name":"6C","age":6},{"id":"57b6c9a6dd69264b6c5ba85b","name":"6D","age":6},{"id":"57b6c9a6dd69264b6c5ba85c","name":"6F","age":6},{"id":"57b6c9a6dd69264b6c5ba85d","name":"7A","age":7},{"id":"57b6c9a6dd69264b6c5ba85e","name":"7B","age":7},{"id":"57b6c9a6dd69264b6c5ba85f","name":"7C","age":7},{"id":"57b6c9a6dd69264b6c5ba860","name":"7D","age":7},{"id":"57b6c9a6dd69264b6c5ba861","name":"7F","age":7},{"id":"57b6c9a6dd69264b6c5ba862","name":"8A","age":8},{"id":"57b6c9a6dd69264b6c5ba863","name":"8B","age":8},{"id":"57b6c9a6dd69264b6c5ba864","name":"8C","age":8},{"id":"57b6c9a6dd69264b6c5ba865","name":"8D","age":8},{"id":"57b6c9a6dd69264b6c5ba866","name":"8F","age":8},{"id":"57d54d426783fc943a6acc30","name":"assss","age":3},{"id":"581add5a07b96fee31c4a50d","name":"1 MPP","age":13},{"id":"5820f7eef936eae3317a75b1","name":"2XXY","age":10},{"id":"5820f7fbf936eae3317a75b6","name":"2XXZ","age":10}]},"invitedSchools":[{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","description":"The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. ","domain":"handcrosspark","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg","forms":[{"id":"57b6c9a6dd69264b6c5ba84e","name":"4A","age":4},{"id":"57b6c9a6dd69264b6c5ba84f","name":"4B","age":4},{"id":"57b6c9a6dd69264b6c5ba850","name":"4C","age":4},{"id":"57b6c9a6dd69264b6c5ba851","name":"4D","age":4},{"id":"57b6c9a6dd69264b6c5ba852","name":"4F","age":4},{"id":"57b6c9a6dd69264b6c5ba853","name":"5A","age":5},{"id":"57b6c9a6dd69264b6c5ba854","name":"5B","age":5},{"id":"57b6c9a6dd69264b6c5ba855","name":"5C","age":5},{"id":"57b6c9a6dd69264b6c5ba856","name":"5D","age":5},{"id":"57b6c9a6dd69264b6c5ba857","name":"5F","age":5},{"id":"57b6c9a6dd69264b6c5ba858","name":"6A","age":6},{"id":"57b6c9a6dd69264b6c5ba859","name":"6B","age":6},{"id":"57b6c9a6dd69264b6c5ba85a","name":"6C","age":6},{"id":"57b6c9a6dd69264b6c5ba85b","name":"6D","age":6},{"id":"57b6c9a6dd69264b6c5ba85c","name":"6F","age":6},{"id":"57b6c9a6dd69264b6c5ba85d","name":"7A","age":7},{"id":"57b6c9a6dd69264b6c5ba85e","name":"7B","age":7},{"id":"57b6c9a6dd69264b6c5ba85f","name":"7C","age":7},{"id":"57b6c9a6dd69264b6c5ba860","name":"7D","age":7},{"id":"57b6c9a6dd69264b6c5ba861","name":"7F","age":7},{"id":"57b6c9a6dd69264b6c5ba862","name":"8A","age":8},{"id":"57b6c9a6dd69264b6c5ba863","name":"8B","age":8},{"id":"57b6c9a6dd69264b6c5ba864","name":"8C","age":8},{"id":"57b6c9a6dd69264b6c5ba865","name":"8D","age":8},{"id":"57b6c9a6dd69264b6c5ba866","name":"8F","age":8},{"id":"57d54d426783fc943a6acc30","name":"assss","age":3},{"id":"581add5a07b96fee31c4a50d","name":"1 MPP","age":13},{"id":"5820f7eef936eae3317a75b1","name":"2XXY","age":10},{"id":"5820f7fbf936eae3317a75b6","name":"2XXZ","age":10}]}],"housesData":[],"individualsData":[{"permissionId":"57b6c9a8dd69264b6c5bac7b","userId":"57b6c9a8dd69264b6c5bac7a","id":"587e00b48a2cab5db170e654","firstName":"Burdette","lastName":"Morar","gender":"FEMALE","schoolId":"57b6c9a6dd69264b6c5ba82f","isStudent":true,"houseId":"57b6c9a6dd69264b6c5ba84c","formId":"57b6c9a6dd69264b6c5ba84f","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"permissionId":"57b6c9a8dd69264b6c5bac59","userId":"57b6c9a8dd69264b6c5bac58","id":"587e00b48a2cab5db170e653","firstName":"Westley","lastName":"Will","gender":"FEMALE","schoolId":"57b6c9a6dd69264b6c5ba82f","isStudent":true,"houseId":"57b6c9a6dd69264b6c5ba84d","formId":"57b6c9a6dd69264b6c5ba84e","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}}],"teamsData":[],"generatedNames":{"57b6c9a6dd69264b6c5ba82f":"Girls 1x1 ","official":"Handcross Park School Girls 1x1 "}};
				report = {"id":"587e00b50359cdc99607f70c","eventId":"587e00b38a2cab5db170e651","updatedAt":"2017-01-17T15:42:48.712Z","createdAt":"2017-01-17T11:32:05.730Z"};
			}
			event.schoolsData = TeamHelper.getSchoolsData(event);
			event.teamsData = event.teamsData.sort((t1, t2) => {
				if (!t1 || !t2 || t1.name === t2.name) {
					return 0;
				}
				if (t1.name < t2.name) {
					return -1;
				}
				if (t1.name > t2.name) {
					return 1;
				}
			});
			event.housesData = event.housesData.sort((h1, h2) => {
				if (!h1 || !h2 || h1.name === h2.name) {
					return 0;
				}
				if (h1.name < h2.name) {
					return -1;
				}
				if (h1.name > h2.name) {
					return 1;
				}
			});
			// FUNCTION MODIFY EVENT OBJECT!!
			EventResultHelper.initializeEventResults(event);

			eventData = event;
			eventData.matchReport = report.content;

			this.setPlayersFromEventToBinding(eventData);
			binding.atomically()
				.set('model',							Immutable.fromJS(eventData))
				.set('gallery.photos',					Immutable.fromJS(photos))
				.set('gallery.isUserCanUploadPhotos',	Immutable.fromJS(settings.photosEnabled))
				.set('gallery.isSync',					true)
				.set('tasksTab.tasks',					Immutable.fromJS(tasks.filter(t => t.schoolId === this.props.activeSchoolId)))
				.set('isUserCanWriteComments',			Immutable.fromJS(settings.commentsEnabled))
				.set('mode',							Immutable.fromJS('general'))
				.commit();

			self.initTabs();

			binding.set('sync', Immutable.fromJS(true));

			this.addListeners();

			return eventData;
		}
	},
	addListeners: function() {
		this.addListenerToEventTeams();
	},
	addListenerToEventTeams: function() {
		const binding = this.getDefaultBinding();

		// reload players from server if isSync is false.
		binding.sub('eventTeams.isSync').addListener(descriptor => !descriptor.getCurrentValue() && this.loadPlayers());
	},
	/**
	 * Load team players from server
	 * @private
	 */
	loadPlayers: function() {
		window.Server.schoolEvent.get(
			{
				schoolId:	this.props.activeSchoolId,
				eventId:	this.eventId
			}
		).then(event => {
			this.setPlayersFromEventToBinding(event);
		});
	},
	setPlayersFromEventToBinding: function(event) {
		if(event && TeamHelper.isNonTeamSport(event)) {
			this.setNonTeamPlayersToBinding(event);
		} else {
			this.setTeamPlayersFromEventToBinding(event);
		}
	},
	setNonTeamPlayersToBinding: function(event) {
		const binding = this.getDefaultBinding();

		// TODO many player bundles, oh it's soo bad
		binding
			.atomically()
			.set('model.individualsData',			Immutable.fromJS(event.individualsData))
			.set('eventTeams.viewPlayers.players',	Immutable.fromJS(event.individualsData))
			.set('eventTeams.isSync',				Immutable.fromJS(true))
			.commit();

		const playersForTaskTab = event.individualsData.filter(player => player.schoolId === this.props.activeSchoolId);
		this.setPlayersToTaskTabBinding(playersForTaskTab);
	},
	setTeamPlayersFromEventToBinding: function(event) {
		const binding = this.getDefaultBinding();

		const players = event.teamsData.map(tp => tp.players);	// players is Array[Array[Object]]
		// TODO many player bundles, oh it's soo bad
		binding
			.atomically()
			.set('model.teamsData',					Immutable.fromJS(event.teamsData))
			.set('eventTeams.viewPlayers.players',	Immutable.fromJS(players))
			.set('eventTeams.isSync',				Immutable.fromJS(true))
			.commit();

		// playersForTaskTab is Array[Array[Object]]
		const playersForTaskTab = event.teamsData
			.filter(td => td.schoolId === this.props.activeSchoolId)
			.map(tp => tp.players);

		this.setPlayersToTaskTabBinding(playersForTaskTab);
	},
	loadPhotos: function(role) {
		let service;

		switch (role) {
			case RoleHelper.USER_ROLES.PARENT:
				service = window.Server.childEventPhotos;
				break;
			default:
				service = window.Server.schoolEventPhotos;
				break;
		}

		return service.get({
			schoolId:	this.props.activeSchoolId,
			eventId:	this.eventId
		});
	},
	/**Init model for Tabs component*/
	initTabs: function() {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				rootBinding	= self.getMoreartyContext().getBinding(),
				tab 		= rootBinding.get('routing.parameters.tab');

		self.tabListModel = [
			{
				value		:'gallery',
				text		:'Gallery',
				isActive	:false
			}, {
				value		: 'details',
				text		: 'Details',
				isActive	: false
			}, {
				value		: 'tasks',
				text		: 'Jobs',
				isActive	: false
			}
		];

		if(self.hasSportPerformanceItems()) {
			self.tabListModel.push({
				value		: 'performance',
				text		: 'Performance',
				isActive	: false
			});
		}

		if(self.hasSportDisciplineItems()) {
			self.tabListModel.push({
				value		: 'discipline',
				text		: 'Discipline',
				isActive	: false
			});
		}

		self.tabListModel.push(
			{
				value		: 'report',
				text		: 'Match Report',
				isActive	: false
			}
		);

		if(tab) {
			let item = self.tabListModel.find(t => t.value === tab);
			item.isActive = true;
			binding.set('activeTab', tab);
		} else {
			self.tabListModel[0].isActive = true;
			binding.set('activeTab', 'gallery');
		}
	},
	hasSportPerformanceItems: function() {
		const binding = this.getDefaultBinding();

		return binding.toJS('model.sport.performance').length > 0;
	},
	hasSportDisciplineItems: function() {
		const binding = this.getDefaultBinding();

		return binding.toJS('model.sport.discipline').length > 0;
	},
	changeActiveTab:function(value){
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	urlHash	= document.location.hash,
				hash 	= urlHash.indexOf('?') > 0 ? urlHash.substr(0,urlHash.indexOf('?')): urlHash;

		// reload team players when open team tab
		if(value === 'teams') {
			binding.set('eventTeams.isSync', Immutable.fromJS(false));
		}

		binding.set('activeTab', value);

		window.location.hash = hash + '?tab=' + value;
	},
	getPerformanceTabBinding: function() {
		const binding	= this.getDefaultBinding();

		return {
			default:					binding.sub('performanceTab'),
			eventTeams:					binding.sub('eventTeams'),
			event:						binding.sub('model')
		};
	},
	getDisciplineTabBinding: function() {
		const binding = this.getDefaultBinding();

		return {
			default:					binding.sub('disciplineTab'),
			eventTeams:					binding.sub('eventTeams'),
			event:						binding.sub('model')
		};
	},
	// TODO many player bundles, oh it's soo bad
	/**
	 *
	 * @param {Array.<Array.<Object>>|Array.<Object>} players array of arrays of team players or array of individuals
	 */
	setPlayersToTaskTabBinding: function(players) {
		const binding = this.getDefaultBinding();

		const _players = Lazy(players).flatten().map(p => {
			p.id = p.userId + p.permissionId;
			return p;
		}).toArray();

		binding.set('tasksTab.players', Immutable.fromJS(_players));
	},
	getTasksTabBinding: function() {
		const binding = this.getDefaultBinding();

		return {
			default:	binding.sub('tasksTab'),
			event:		binding.sub('model')
		};
	},
	getEventTeamsBinding: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return {
			default:					binding.sub('eventTeams'),
			activeTab:					binding.sub('activeTab'),
			event:						binding.sub('model'),
			mode:						binding.sub('mode'),
			individualScoreAvailable:	binding.sub('individualScoreAvailable')
		};
	},
	isShowTrobber: function() {
		const self = this;

		return !self.isSync();
	},
	isSync: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return binding.toJS('sync');
	},
 	isShowMainMode: function() {
		return this.isSync() && !this.isShowChangeTeamMode();
	},
	isShowChangeTeamMode: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return self.isSync() && binding.toJS('mode') === 'edit_squad';
	},
	isaLeftShow:function (activeSchoolId, event, mode) {
		const 	isClosingMode 	= mode === 'closing',
				params 			= isClosingMode && TeamHelper.getParametersForLeftContext(activeSchoolId, event);

		return params && params.bundleName === 'teamsData';
	},
	isaRightShow:function (activeSchoolId, event, mode) {
		const 	isClosingMode 	= mode === 'closing',
				params 			= isClosingMode && TeamHelper.getParametersForRightContext(activeSchoolId, event);

		return params && params.bundleName === 'teamsData';
	},
	/**
	 * Function returns add photo button for gallery tab.
	 */
	getAddPhotoButton: function() {
		const binding = this.getDefaultBinding();

		const	userRole			= RoleHelper.getLoggedInUserRole(this),
				galleryBinding		= binding.sub('gallery'),
				activeSchool		= this.props.activeSchoolId,
				eventId				= this.eventId;

		const isUserCanUploadPhotos	= galleryBinding.toJS('isUserCanUploadPhotos');

		const isLoading				= !galleryBinding.toJS('isSync');

		return (
			<AddPhotoButton	handleChange			= { file => GalleryActions.addPhotoToEvent(userRole, galleryBinding, activeSchool, eventId, file) }
							isUserCanUploadPhotos	= { isUserCanUploadPhotos }
							isLoading				= { isLoading }
			/>
		);
	},
	handleClickAddTaskButton: function() {
		return this.getDefaultBinding().atomically()
			.set('tasksTab.editingTask',	undefined)
			.set('tasksTab.viewMode',		"ADD")
			.commit();

	},
	/**
	 * Function return add task button for tasks tab.
	 */
	getAddTaskButton: function() {
		if(RoleHelper.isParent(this) || RoleHelper.isStudent(this)) {
			return null;
		} else {
			return <Button extraStyleClasses="mAddTask" text="Add job" onClick={this.handleClickAddTaskButton}/>;
		}
	},
	/**
	 * Function returns the active tab.
	 * @returns {*}
	 */
	getActiveTab: function() {
		return this.getDefaultBinding().toJS('activeTab');
	},
	/**
	 * Function returns custom button for tabs.
	 * It depends on the current tab.
	 */
	getCustomButtonForTabs: function() {
		const viewMode = this.getDefaultBinding().toJS('tasksTab.viewMode');

		switch (true) {
			case this.getActiveTab() === "gallery":
				return this.getAddPhotoButton();
			case viewMode === "VIEW" && this.getActiveTab() === "tasks":
				return this.getAddTaskButton();
			default:
				return null;
		}
	},
	isShowMap: function() {
		return this.getDefaultBinding().toJS('model.venue.venueType') !== "TBD";
	},
	render: function() {
		const	self			= this,
				binding			= self.getDefaultBinding();

		const	event			= binding.toJS('model'),
				showingComment	= binding.get('showingComment'),
				activeTab		= this.getActiveTab(),
				mode			= binding.toJS('mode'),
				isaLeftShow		= this.isaLeftShow(this.props.activeSchoolId, event, mode),
				isaRightShow	= this.isaRightShow(this.props.activeSchoolId, event, mode),
				isParent		= RoleHelper.isParent(this),
				isStudent		= RoleHelper.isStudent(this);
		switch (true) {
			case !self.isSync():
				return (
					<div className="bEventContainer">
						<span className="eEvent_loading">loading...</span>
					</div>
				);
			// sync and any mode excluding edit_squad
			case self.isSync() && binding.toJS('mode') !== 'edit_squad':
				return (
					<div className="bEventContainer">
						<div className="bEvent">
							<EventHeaderWrapper	binding			= {binding}
												activeSchoolId	= {this.props.activeSchoolId}
							/>
							<EventRivals	binding			= {binding}
											activeSchoolId	= {this.props.activeSchoolId}
							/>
							<div className="bEventMiddleSideContainer">
								<div className="bEventMiddleSideContainer_row">
									<EditingTeamsButtons binding={binding} />
									<IndividualScoreAvailable binding={binding.sub('individualScoreAvailable.0')}
															  isVisible={isaLeftShow}
															  className="mLeft"/>
									<IndividualScoreAvailable binding={binding.sub('individualScoreAvailable.1')}
															  isVisible={isaRightShow}/>
								</div>
							</div>
							<EventTeams	binding			= {self.getEventTeamsBinding()}
										activeSchoolId	= {this.props.activeSchoolId}
							/>
							<If condition={this.isShowMap()}>
								<div className="bEventMap">
									<div className="bEventMap_row">
										<div className="bEventMap_col">
											<Map	binding	= {binding.sub('mapOfEventVenue')}
													venue	= {binding.toJS('model.venue')}
											/>
										</div>
									</div>
								</div>
							</If>
							<div className="bEventMiddleSideContainer">
								<Tabs	tabListModel	= {self.tabListModel}
										onClick			= {self.changeActiveTab}
										customButton	= {this.getCustomButtonForTabs()}
								/>
							</div>
							<If condition={activeTab === 'performance'} >
								<div className="bEventBottomContainer">
									<Performance	binding			= {self.getPerformanceTabBinding()}
													activeSchoolId	= {this.props.activeSchoolId}
									/>
								</div>
							</If>
							<If condition={activeTab === 'discipline'} >
								<div className="bEventBottomContainer">
									<DisciplineWrapper	binding			= {self.getDisciplineTabBinding()}
														activeSchoolId	= {this.props.activeSchoolId}
									/>
								</div>
							</If>
							<If condition={activeTab === 'tasks'} >
								<div className="bEventBottomContainer">
									<TasksWrapper	binding			= {this.getTasksTabBinding()}
													activeSchoolId	= {this.props.activeSchoolId}
									/>
								</div>
							</If>
							<If condition={activeTab === 'gallery'} >
								<EventGallery	activeSchoolId	= { this.props.activeSchoolId }
												eventId			= { self.eventId }
												binding			= { binding.sub('gallery') } />
							</If>
							<If condition={activeTab === 'details'} >
								<div className="bEventBottomContainer">
									<DetailsWrapper	eventId		= {self.eventId}
													schoolId	= {this.props.activeSchoolId}
													isParent	= {isParent}
													isStudent	= {isStudent}
									/>
									<div className="eDetails_border" />
								</div>
							</If>
							<If condition={activeTab === 'report'} >
								<div className="bEventBottomContainer">
									<MatchReport	binding		= {binding.sub('matchReport')}
													eventId		= {self.eventId}
													isParent	= {isParent}
													isStudent	= {isStudent}
									/>
								</div>
							</If>
							<div className="eEvent_commentBox">
								<Comments	binding					= {binding.sub('comments')}
											isUserCanWriteComments	= {binding.toJS('isUserCanWriteComments')}
											eventId					= {event.id}
											activeSchoolId			= {this.props.activeSchoolId}
								/>
							</div>
						</div>
					</div>
				);
			// sync and edit squad mode
			case self.isSync() && binding.toJS('mode') === 'edit_squad':
				return (
					<div className="bEventContainer">
						<ManagerWrapper	binding			= {binding}
										activeSchoolId	= {this.props.activeSchoolId}
						/>
					</div>
				);
		}
	}
});

module.exports = Event;