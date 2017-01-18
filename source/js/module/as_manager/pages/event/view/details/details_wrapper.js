const	React			= require('react'),

		EventHelper		= require('../../../../../helpers/eventHelper'),

		Actions			= require('./actions/actions'),
		Details			= require('./details'),
		Consts			= require('./details_components/consts'),
		DetailsStyleCss	= require('../../../../../../../styles/ui/b_details.scss');

const DetailsWrapper = React.createClass({

	VENUE_SERVER_CLIENT_MAP: {
		"HOME"		: 'Home',
		"AWAY"		: 'Away',
		"CUSTOM"	: 'Away',
		"TBD"		: 'TBD'
	},

	propTypes:{
		schoolId:	React.PropTypes.string.isRequired,
		eventId:	React.PropTypes.string.isRequired,
		isParent:	React.PropTypes.bool.isRequired,
		isStudent:	React.PropTypes.bool.isRequired
	},
	getInitialState: function(){
		return {
			isLoading			: true,
			eventDetails		: {},
			backupEventDetails	: {}
		};
	},
	componentWillMount: function() {
		let details;
		/**
		 * If role not equal student, do everything as usual
		 */
		if (!this.props.isStudent) {
			Actions.getDetailsByEventId(this.props.schoolId, this.props.eventId)
				.then(_details => {
					details = _details;

					return Actions.getEventById(this.props.schoolId, this.props.eventId);
				})
				.then(event => {
					this.backupEventDetails(details);
					this.setState({
						isLoading		: false,
						eventDetails	: details,
						eventName		: event.generatedNames[this.props.schoolId],
						officialName	: event.generatedNames.official,
						venue			: this.getVenueView(event)
					});
				});
		} else {
			if (this.props.eventId === '587c72823fc0db2866eccccb') {
				details = {"id":"587c729e0359cdc99607f658","teamDeparts":"2017-01-15T23:55:29.738Z","description":"8787899dsfgsdfgsdfg","kitNotes":"8978787","comments":"8789789777","staff":[]};
			} else {
				details = {};
			}
			const event = {"id":"587c72823fc0db2866eccccb","updatedAt":"2017-01-16T07:13:08.228Z","createdAt":"2017-01-16T07:13:06.144Z","gender":"MIXED","eventType":"INTERNAL_TEAMS","sportId":"57b6cc06a4e23b56709e5de1","startTime":"2017-01-22T19:00:00.000Z","inviterSchoolId":"57b6c9a6dd69264b6c5ba82f","albumId":"587c72843fc0db2866ecccd7","results":{"schoolScore":[],"houseScore":[],"teamScore":[],"individualPerformance":[],"individualDiscipline":[],"individualScore":[]},"threadId":"587c72823fc0db2866ecccca","ages":[3,5,7,10,13,8,4,6],"venue":{"postcodeId":"57b6c9a5dd69264b6c5ba82a","venueType":"HOME"},"individuals":[],"teams":["587c728118b196282a47a5a4","587c72813fc0db2866ecccc1"],"houses":[],"finishSchoolIds":[],"invitedSchoolIds":["57b6c9a6dd69264b6c5ba82f"],"status":"ACCEPTED","sport":{"updatedAt":"2016-11-04T12:09:43.650Z","createdAt":"2016-08-19T09:06:14.943Z","name":"Football","scoring":"MORE_SCORES","players":"TEAM","__v":0,"individualResultsAvailable":true,"performance":[{"maxValue":5,"minValue":0,"name":"Speed","_id":"581c7a8707b96fee31c4b79a"},{"maxValue":5,"minValue":0,"name":"Strength","_id":"581c7a8707b96fee31c4b799"},{"maxValue":6,"minValue":0,"name":"Endurance","_id":"581c7a8707b96fee31c4b798"}],"discipline":[{"name":"yellow card","namePlural":"yellow cards","description":"","_id":"581c7a8707b96fee31c4b797"},{"name":"red card","namePlural":"red cards","description":"","_id":"581c7a8707b96fee31c4b796"}],"points":{"namePlural":"goals","name":"goal","display":"PLAIN","pointsStep":1},"field":{"pic":"//img.stage1.squadintouch.com/images/u6rkhehn31t66q1nscqaqf443ryj6a08wf4x_1473590230190.jpg","positions":[{"description":"","name":"Position1","_id":"581c7a8707b96fee31c4b79d","coords":[]},{"description":"","name":"Position2","_id":"581c7a8707b96fee31c4b79c","coords":[]},{"description":"","name":"Position3","_id":"581c7a8707b96fee31c4b79b","coords":[]}]},"genders":{"mixed":true,"femaleOnly":true,"maleOnly":true},"id":"57b6cc06a4e23b56709e5de1"},"inviterSchool":{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","description":"The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. ","domain":"handcrosspark","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg","forms":[{"id":"57b6c9a6dd69264b6c5ba84e","name":"4A","age":4},{"id":"57b6c9a6dd69264b6c5ba84f","name":"4B","age":4},{"id":"57b6c9a6dd69264b6c5ba850","name":"4C","age":4},{"id":"57b6c9a6dd69264b6c5ba851","name":"4D","age":4},{"id":"57b6c9a6dd69264b6c5ba852","name":"4F","age":4},{"id":"57b6c9a6dd69264b6c5ba853","name":"5A","age":5},{"id":"57b6c9a6dd69264b6c5ba854","name":"5B","age":5},{"id":"57b6c9a6dd69264b6c5ba855","name":"5C","age":5},{"id":"57b6c9a6dd69264b6c5ba856","name":"5D","age":5},{"id":"57b6c9a6dd69264b6c5ba857","name":"5F","age":5},{"id":"57b6c9a6dd69264b6c5ba858","name":"6A","age":6},{"id":"57b6c9a6dd69264b6c5ba859","name":"6B","age":6},{"id":"57b6c9a6dd69264b6c5ba85a","name":"6C","age":6},{"id":"57b6c9a6dd69264b6c5ba85b","name":"6D","age":6},{"id":"57b6c9a6dd69264b6c5ba85c","name":"6F","age":6},{"id":"57b6c9a6dd69264b6c5ba85d","name":"7A","age":7},{"id":"57b6c9a6dd69264b6c5ba85e","name":"7B","age":7},{"id":"57b6c9a6dd69264b6c5ba85f","name":"7C","age":7},{"id":"57b6c9a6dd69264b6c5ba860","name":"7D","age":7},{"id":"57b6c9a6dd69264b6c5ba861","name":"7F","age":7},{"id":"57b6c9a6dd69264b6c5ba862","name":"8A","age":8},{"id":"57b6c9a6dd69264b6c5ba863","name":"8B","age":8},{"id":"57b6c9a6dd69264b6c5ba864","name":"8C","age":8},{"id":"57b6c9a6dd69264b6c5ba865","name":"8D","age":8},{"id":"57b6c9a6dd69264b6c5ba866","name":"8F","age":8},{"id":"57d54d426783fc943a6acc30","name":"assss","age":3},{"id":"581add5a07b96fee31c4a50d","name":"1 MPP","age":13},{"id":"5820f7eef936eae3317a75b1","name":"2XXY","age":10},{"id":"5820f7fbf936eae3317a75b6","name":"2XXZ","age":10}]},"invitedSchools":[{"id":"57b6c9a6dd69264b6c5ba82f","name":"Handcross Park School","description":"The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. The most important decision you will make as a parent is in choosing the right school for your child. You have now alighted upon one of the leading Preparatory Schools in Sussex. Handcross Park has gained a fast growing reputation for providing a happy, kind and purposeful learning environment, where the girls and boys develop and grow as individuals and are supported in reaching their personal and academic potential. This was confirmed by our 2014 inspection, where we were given the top possible grade in every area of school life. ","domain":"handcrosspark","pic":"//img.stage1.squadintouch.com/images/7yno33paoreslqf434jt84bk5o36cpdp0emb_1472626540371.jpg","forms":[{"id":"57b6c9a6dd69264b6c5ba84e","name":"4A","age":4},{"id":"57b6c9a6dd69264b6c5ba84f","name":"4B","age":4},{"id":"57b6c9a6dd69264b6c5ba850","name":"4C","age":4},{"id":"57b6c9a6dd69264b6c5ba851","name":"4D","age":4},{"id":"57b6c9a6dd69264b6c5ba852","name":"4F","age":4},{"id":"57b6c9a6dd69264b6c5ba853","name":"5A","age":5},{"id":"57b6c9a6dd69264b6c5ba854","name":"5B","age":5},{"id":"57b6c9a6dd69264b6c5ba855","name":"5C","age":5},{"id":"57b6c9a6dd69264b6c5ba856","name":"5D","age":5},{"id":"57b6c9a6dd69264b6c5ba857","name":"5F","age":5},{"id":"57b6c9a6dd69264b6c5ba858","name":"6A","age":6},{"id":"57b6c9a6dd69264b6c5ba859","name":"6B","age":6},{"id":"57b6c9a6dd69264b6c5ba85a","name":"6C","age":6},{"id":"57b6c9a6dd69264b6c5ba85b","name":"6D","age":6},{"id":"57b6c9a6dd69264b6c5ba85c","name":"6F","age":6},{"id":"57b6c9a6dd69264b6c5ba85d","name":"7A","age":7},{"id":"57b6c9a6dd69264b6c5ba85e","name":"7B","age":7},{"id":"57b6c9a6dd69264b6c5ba85f","name":"7C","age":7},{"id":"57b6c9a6dd69264b6c5ba860","name":"7D","age":7},{"id":"57b6c9a6dd69264b6c5ba861","name":"7F","age":7},{"id":"57b6c9a6dd69264b6c5ba862","name":"8A","age":8},{"id":"57b6c9a6dd69264b6c5ba863","name":"8B","age":8},{"id":"57b6c9a6dd69264b6c5ba864","name":"8C","age":8},{"id":"57b6c9a6dd69264b6c5ba865","name":"8D","age":8},{"id":"57b6c9a6dd69264b6c5ba866","name":"8F","age":8},{"id":"57d54d426783fc943a6acc30","name":"assss","age":3},{"id":"581add5a07b96fee31c4a50d","name":"1 MPP","age":13},{"id":"5820f7eef936eae3317a75b1","name":"2XXY","age":10},{"id":"5820f7fbf936eae3317a75b6","name":"2XXZ","age":10}]}],"housesData":[],"individualsData":[],"teamsData":[{"updatedAt":"2017-01-16T07:13:06.579Z","createdAt":"2017-01-16T07:13:05.792Z","name":"11111","sportId":"57b6cc06a4e23b56709e5de1","schoolId":"57b6c9a6dd69264b6c5ba82f","__v":0,"eventId":"587c72823fc0db2866eccccb","removed":false,"teamType":"ADHOC","players":[{"userId":"57b6c9a8dd69264b6c5bac52","permissionId":"57b6c9a8dd69264b6c5bac53","_id":"587c728118b196282a47a5cc","firstName":"Johnson","lastName":"Brown","gender":"MALE","id":"587c728118b196282a47a5cc","form":{"age":13,"name":"1 MPP","id":"581add5a07b96fee31c4a50d"}},{"userId":"57b6c9a8dd69264b6c5bac54","permissionId":"57b6c9a8dd69264b6c5bac55","_id":"587c728118b196282a47a5cb","firstName":"Heloise","lastName":"Hudson","gender":"MALE","id":"587c728118b196282a47a5cb","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac56","permissionId":"57b6c9a8dd69264b6c5bac57","_id":"587c728118b196282a47a5ca","firstName":"Bernhard","lastName":"Kuvalis","gender":"FEMALE","id":"587c728118b196282a47a5ca","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac58","permissionId":"57b6c9a8dd69264b6c5bac59","_id":"587c728118b196282a47a5c9","firstName":"Westley","lastName":"Will","gender":"FEMALE","id":"587c728118b196282a47a5c9","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac5a","permissionId":"57b6c9a8dd69264b6c5bac5b","_id":"587c728118b196282a47a5c8","firstName":"Cary","lastName":"Dietrich","gender":"MALE","id":"587c728118b196282a47a5c8","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac5c","permissionId":"57b6c9a8dd69264b6c5bac5d","_id":"587c728118b196282a47a5c7","firstName":"Kaylin","lastName":"Gutkowski","gender":"FEMALE","id":"587c728118b196282a47a5c7","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac5e","permissionId":"57b6c9a8dd69264b6c5bac5f","_id":"587c728118b196282a47a5c6","firstName":"Lonzo","lastName":"Predovic","gender":"MALE","id":"587c728118b196282a47a5c6","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac60","permissionId":"57b6c9a8dd69264b6c5bac61","_id":"587c728118b196282a47a5c5","firstName":"Jewel","lastName":"Howe","gender":"MALE","id":"587c728118b196282a47a5c5","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac62","permissionId":"57b6c9a8dd69264b6c5bac63","_id":"587c728118b196282a47a5c4","firstName":"Briana","lastName":"Rodriguez","gender":"FEMALE","id":"587c728118b196282a47a5c4","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac64","permissionId":"57b6c9a8dd69264b6c5bac65","_id":"587c728118b196282a47a5c3","firstName":"Murl","lastName":"Rodriguez","gender":"FEMALE","id":"587c728118b196282a47a5c3","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac66","permissionId":"57b6c9a8dd69264b6c5bac67","_id":"587c728118b196282a47a5c2","firstName":"Dan","lastName":"Rippin","gender":"MALE","id":"587c728118b196282a47a5c2","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac68","permissionId":"57b6c9a8dd69264b6c5bac69","_id":"587c728118b196282a47a5c1","firstName":"Mossie","lastName":"Wiegand","gender":"FEMALE","id":"587c728118b196282a47a5c1","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac6c","permissionId":"57b6c9a8dd69264b6c5bac6d","_id":"587c728118b196282a47a5c0","firstName":"Sigrid","lastName":"Jenkins","gender":"FEMALE","id":"587c728118b196282a47a5c0","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac6a","permissionId":"57b6c9a8dd69264b6c5bac6b","_id":"587c728118b196282a47a5bf","firstName":"Filomena","lastName":"Hudson","gender":"FEMALE","id":"587c728118b196282a47a5bf","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac74","permissionId":"57b6c9a8dd69264b6c5bac75","_id":"587c728118b196282a47a5be","firstName":"Garfield","lastName":"Waters","gender":"MALE","id":"587c728118b196282a47a5be","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac70","permissionId":"57b6c9a8dd69264b6c5bac71","_id":"587c728118b196282a47a5bd","firstName":"Russ","lastName":"Lubowitz","gender":"MALE","id":"587c728118b196282a47a5bd","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac72","permissionId":"57b6c9a8dd69264b6c5bac73","_id":"587c728118b196282a47a5bc","firstName":"Ryleigh","lastName":"Tremblay","gender":"MALE","id":"587c728118b196282a47a5bc","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac6e","permissionId":"57b6c9a8dd69264b6c5bac6f","_id":"587c728118b196282a47a5bb","firstName":"Ressie","lastName":"Zulauf","gender":"FEMALE","id":"587c728118b196282a47a5bb","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac76","permissionId":"57b6c9a8dd69264b6c5bac77","_id":"587c728118b196282a47a5ba","firstName":"Connie","lastName":"Ritchie","gender":"MALE","id":"587c728118b196282a47a5ba","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac78","permissionId":"57b6c9a8dd69264b6c5bac79","_id":"587c728118b196282a47a5b9","firstName":"Buford","lastName":"Wisozk","gender":"MALE","id":"587c728118b196282a47a5b9","form":{"age":4,"name":"4A","id":"57b6c9a6dd69264b6c5ba84e"}},{"userId":"57b6c9a8dd69264b6c5bac7c","permissionId":"57b6c9a8dd69264b6c5bac7d","_id":"587c728118b196282a47a5b8","firstName":"Bernhard","lastName":"Spencer","gender":"MALE","id":"587c728118b196282a47a5b8","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac7a","permissionId":"57b6c9a8dd69264b6c5bac7b","_id":"587c728118b196282a47a5b7","firstName":"Burdette","lastName":"Morar","gender":"FEMALE","id":"587c728118b196282a47a5b7","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac7e","permissionId":"57b6c9a8dd69264b6c5bac7f","_id":"587c728118b196282a47a5b6","firstName":"Wallace","lastName":"Dickinson","gender":"MALE","id":"587c728118b196282a47a5b6","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac82","permissionId":"57b6c9a8dd69264b6c5bac83","_id":"587c728118b196282a47a5b5","firstName":"Alena","lastName":"Schinner","gender":"FEMALE","id":"587c728118b196282a47a5b5","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac84","permissionId":"57b6c9a8dd69264b6c5bac85","_id":"587c728118b196282a47a5b4","firstName":"Albin","lastName":"Flatley","gender":"MALE","id":"587c728118b196282a47a5b4","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac86","permissionId":"57b6c9a8dd69264b6c5bac87","_id":"587c728118b196282a47a5b3","firstName":"Kris","lastName":"Kub","gender":"FEMALE","id":"587c728118b196282a47a5b3","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac80","permissionId":"57b6c9a8dd69264b6c5bac81","_id":"587c728118b196282a47a5b2","firstName":"Ola","lastName":"Grady","gender":"MALE","id":"587c728118b196282a47a5b2","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac8a","permissionId":"57b6c9a8dd69264b6c5bac8b","_id":"587c728118b196282a47a5b1","firstName":"Alberta","lastName":"Rogahn","gender":"FEMALE","id":"587c728118b196282a47a5b1","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac88","permissionId":"57b6c9a8dd69264b6c5bac89","_id":"587c728118b196282a47a5b0","firstName":"Madie","lastName":"MacGyver","gender":"FEMALE","id":"587c728118b196282a47a5b0","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac8c","permissionId":"57b6c9a8dd69264b6c5bac8d","_id":"587c728118b196282a47a5af","firstName":"Nyasia","lastName":"Cormier","gender":"MALE","id":"587c728118b196282a47a5af","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac8e","permissionId":"57b6c9a8dd69264b6c5bac8f","_id":"587c728118b196282a47a5ae","firstName":"Shaniya","lastName":"Farrell","gender":"FEMALE","id":"587c728118b196282a47a5ae","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac92","permissionId":"57b6c9a8dd69264b6c5bac93","_id":"587c728118b196282a47a5ad","firstName":"Manuel","lastName":"Hirthe","gender":"MALE","id":"587c728118b196282a47a5ad","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac94","permissionId":"57b6c9a8dd69264b6c5bac95","_id":"587c728118b196282a47a5ac","firstName":"Jovan","lastName":"Emard","gender":"MALE","id":"587c728118b196282a47a5ac","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac90","permissionId":"57b6c9a8dd69264b6c5bac91","_id":"587c728118b196282a47a5ab","firstName":"Titus","lastName":"Dach","gender":"FEMALE","id":"587c728118b196282a47a5ab","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac96","permissionId":"57b6c9a8dd69264b6c5bac97","_id":"587c728118b196282a47a5aa","firstName":"Lambert","lastName":"Harber","gender":"MALE","id":"587c728118b196282a47a5aa","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac98","permissionId":"57b6c9a8dd69264b6c5bac99","_id":"587c728118b196282a47a5a9","firstName":"Milo","lastName":"Rogahn","gender":"FEMALE","id":"587c728118b196282a47a5a9","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a9dd69264b6c5bad44","permissionId":"57b6c9a9dd69264b6c5bad45","_id":"587c728118b196282a47a5a8","firstName":"Laurie","lastName":"Walker","gender":"FEMALE","id":"587c728118b196282a47a5a8","form":{"age":5,"name":"5B","id":"57b6c9a6dd69264b6c5ba854"}},{"userId":"57b6c9a9dd69264b6c5bad46","permissionId":"57b6c9a9dd69264b6c5bad47","_id":"587c728118b196282a47a5a7","firstName":"Citlalli","lastName":"Breitenberg","gender":"MALE","id":"587c728118b196282a47a5a7","form":{"age":5,"name":"5B","id":"57b6c9a6dd69264b6c5ba854"}},{"userId":"57b6c9a9dd69264b6c5bad48","permissionId":"57b6c9a9dd69264b6c5bad49","_id":"587c728118b196282a47a5a6","firstName":"Kaleb","lastName":"Mueller","gender":"MALE","id":"587c728118b196282a47a5a6","form":{"age":5,"name":"5B","id":"57b6c9a6dd69264b6c5ba854"}},{"userId":"57b6c9a9dd69264b6c5bad4a","permissionId":"57b6c9a9dd69264b6c5bad4b","_id":"587c728118b196282a47a5a5","firstName":"Kayli","lastName":"Predovic","gender":"MALE","id":"587c728118b196282a47a5a5","form":{"age":5,"name":"5B","id":"57b6c9a6dd69264b6c5ba854"}}],"ages":[3,5,7,10,13,8,4,6],"gender":"MIXED","id":"587c728118b196282a47a5a4"},{"updatedAt":"2017-01-16T07:13:06.615Z","createdAt":"2017-01-16T07:13:05.820Z","name":"22","sportId":"57b6cc06a4e23b56709e5de1","schoolId":"57b6c9a6dd69264b6c5ba82f","__v":0,"eventId":"587c72823fc0db2866eccccb","removed":false,"teamType":"ADHOC","players":[{"userId":"57b6c9a8dd69264b6c5bac9a","permissionId":"57b6c9a8dd69264b6c5bac9b","_id":"587c72813fc0db2866ecccc8","firstName":"Tara","lastName":"Cassin","gender":"MALE","id":"587c72813fc0db2866ecccc8","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac9c","permissionId":"57b6c9a8dd69264b6c5bac9d","_id":"587c72813fc0db2866ecccc7","firstName":"Daija","lastName":"Lynch","gender":"FEMALE","id":"587c72813fc0db2866ecccc7","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5bac9e","permissionId":"57b6c9a8dd69264b6c5bac9f","_id":"587c72813fc0db2866ecccc6","firstName":"Kayden","lastName":"Carroll","gender":"FEMALE","id":"587c72813fc0db2866ecccc6","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5baca0","permissionId":"57b6c9a8dd69264b6c5baca1","_id":"587c72813fc0db2866ecccc5","firstName":"Lawson","lastName":"Labadie","gender":"FEMALE","id":"587c72813fc0db2866ecccc5","form":{"age":4,"name":"4B","id":"57b6c9a6dd69264b6c5ba84f"}},{"userId":"57b6c9a8dd69264b6c5baca2","permissionId":"57b6c9a8dd69264b6c5baca3","_id":"587c72813fc0db2866ecccc4","firstName":"Rico","lastName":"Romaguera","gender":"MALE","id":"587c72813fc0db2866ecccc4","form":{"age":4,"name":"4C","id":"57b6c9a6dd69264b6c5ba850"}},{"userId":"57b6c9a9dd69264b6c5baca4","permissionId":"57b6c9a9dd69264b6c5baca5","_id":"587c72813fc0db2866ecccc3","firstName":"Donald","lastName":"Kassulke","gender":"MALE","id":"587c72813fc0db2866ecccc3","form":{"age":4,"name":"4C","id":"57b6c9a6dd69264b6c5ba850"}},{"userId":"57b6c9a9dd69264b6c5baca6","permissionId":"57b6c9a9dd69264b6c5baca7","_id":"587c72813fc0db2866ecccc2","firstName":"Paxton","lastName":"Oberbrunner","gender":"FEMALE","id":"587c72813fc0db2866ecccc2","form":{"age":4,"name":"4C","id":"57b6c9a6dd69264b6c5ba850"}}],"ages":[3,5,7,10,13,8,4,6],"gender":"MIXED","id":"587c72813fc0db2866ecccc1"}],"generatedNames":{"57b6c9a6dd69264b6c5ba82f":"11111 vs 22 Football","official":"Handcross Park School 11111 vs 22 Football"}};
			this.backupEventDetails(details);
			this.setState({
				isLoading		: false,
				eventDetails	: details,
				eventName		: event.generatedNames[this.props.schoolId],
				officialName	: event.generatedNames.official,
				venue			: this.getVenueView(event)
			});
		}
	},
	/**
	 * Copy event details and set it as prop of component - this.backupEventDetails
	 * @param eventDetails
	 */
	backupEventDetails: function(eventDetails) {
		this.backupEventDetails = Object.assign(eventDetails);
	},
	restoreEventDetails: function() {
		this.setState({
			eventDetails: this.backupEventDetails
		});
	},
	getVenueView: function(event) {
		switch (true) {
			case EventHelper.isInterSchoolsEvent(event):
				return this.getInterSchoolsVenue(event);
			default:
				return this.VENUE_SERVER_CLIENT_MAP[event.venue.venueType];
		}
	},
	getInterSchoolsVenue: function(event) {
		switch (true) {
			case event.venue.venueType === 'HOME' && event.inviterSchoolId === this.props.schoolId:
				return this.VENUE_SERVER_CLIENT_MAP['HOME'];
			case event.venue.venueType === 'HOME' && event.inviterSchoolId !== this.props.schoolId:
				return this.VENUE_SERVER_CLIENT_MAP['AWAY'];
			case event.venue.venueType === 'AWAY' && event.inviterSchoolId === this.props.schoolId:
				return this.VENUE_SERVER_CLIENT_MAP['AWAY'];
			case event.venue.venueType === 'AWAY' && event.inviterSchoolId !== this.props.schoolId:
				return this.VENUE_SERVER_CLIENT_MAP['HOME'];
			case event.venue.venueType === 'CUSTOM':
				return this.VENUE_SERVER_CLIENT_MAP['CUSTOM'];
			case event.venue.venueType === 'TBD':
				return this.VENUE_SERVER_CLIENT_MAP['TBD'];
		}
	},
	submitChanges: function() {
		Actions.submitEventDetailsChangesById(this.props.schoolId, this.props.eventId, this.state.eventDetails)
			.then(updEventDetails => {
				this.setState({
					eventDetails : updEventDetails
				});
			});
	},
	handleChange: function(field, value) {
		// get old event details and update it
		const eventDetails = this.state.eventDetails;
		eventDetails[field] = value;

		this.setState({
			eventDetails: eventDetails
		});
	},
	onSave: function() {
		this.submitChanges();
	},
	onCancel: function() {
		this.restoreEventDetails();
	},
	render: function() {
		if(this.state.isLoading) {
			return null;
		} else {
			return (
				<Details	name				= { this.state.eventName }
							officialName		= { this.state.officialName }
							venue				= { this.state.venue }
							description			= { this.state.eventDetails.description }
							kitNotes			= { this.state.eventDetails.kitNotes }
							comments			= { this.state.eventDetails.comments }
							teamDeparts			= { this.state.eventDetails.teamDeparts }
							teamReturns			= { this.state.eventDetails.teamReturns }
							meetTime			= { this.state.eventDetails.meetTime }
							teaTime				= { this.state.eventDetails.teaTime }
							lunchTime			= { this.state.eventDetails.lunchTime }
							staff				= { this.state.eventDetails.staff }
							handleChange		= { this.handleChange }
							isParent			= { this.props.isParent }
							isStudent			= { this.props.isStudent }
							activeSchoolId		= { this.props.schoolId }
							onSave				= { this.onSave }
							onCancel			= { this.onCancel }
				/>
			);
		}
	}
});

module.exports = DetailsWrapper;